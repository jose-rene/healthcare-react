<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\MemberPayerHistory;
use App\Models\Payer;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class MemberTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $member;
    protected $payer;
    protected $user;

    /**
     * Test fetching member.
     *
     * @return void
     */
    public function testGetMember()
    {
        // get the member
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/member/' . $this->member->uuid);
        // validate response code
        $response->assertStatus(200);
        // validate structure
        $response->assertJsonStructure(['id', 'gender', 'title', 'first_name', 'last_name', 'address']);
        // validate data
        $data = json_decode($response->getContent(), true);
        // id is the uuid
        $this->assertEquals($data['id'], $this->member->uuid);
    }

    /**
     * Test fetching plans.
     *
     * @return void
     */
    public function testGetPlans()
    {
        // get the member
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/plan/plans');
        // validate response code
        $response->assertStatus(200);
    }

    /**
     * Test fetching member id types.
     *
     * @return void
     */
    public function testGetMemberIdTypes()
    {
        // get the member
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/plan/idtypes');
        // validate response code
        $response->assertStatus(200);
    }

    /**
     * @group admins
     */
    public function testMemberDups()
    {
        Bouncer::allow('admin')->everything();

        $this->user->assign('admin');

        $duplicateMembers = Member::factory(['payer_id' => $this->user->healthPlanUser->payer])
            ->hasAddresses(1, ['is_primary' => true])
            ->count(2)
            ->create([
                'first_name' => 'amin',
                'last_name'  => 'amin',
                'dob'        => '2021-05-22',
            ]);

        $response = $this->get(route('api.admin.member.duplicates'));

        // Make sure I get back my new duplicate members
        $response
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['id' => $duplicateMembers->first()->uuid]);
    }

    /**
     * Test search plan members.
     *
     * @return void
     */
    public function testSearchMembers()
    {
        // create members to search
        $members = Member::factory()
            ->hasAddresses(1, ['is_primary' => true])
            ->count(2)
            ->create(['payer_id' => $this->user->healthPlanUser->payer]);
        // get a dob to search
        $member = $members->first();

        $search = [
            'dob'        => $member->dob->format('Y-m-d'),
            'first_name' => $member->first_name,
            'last_name'  => $member->last_name,
        ];

        // dd($this->user->isA('hp_user'), $this->user->healthPlanUser->payer->id);
        $response = $this->post('/v1/member/search', $search);
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);

        // there should be 1 member
        $response->assertJsonPath('meta.total', 1);
        $response->assertJsonPath('data.0.dob', $member->dob->format('m/d/Y'));
        $response->assertJsonPath('data.0.first_name', $search['first_name']);
        $response->assertJsonPath('data.0.last_name', $search['last_name']);
    }

    /**
     * Test search plan members that belong to a child payer.
     *
     * @return void
     */
    public function testSearchSubMembers()
    {
        // make a child payer
        $childPayer = Payer::factory()->hasLobs(5)->create(['parent_id' => $this->user->payer]);
        // create members to search
        $members = Member::factory()
            ->hasAddresses(1, ['is_primary' => true])
            ->count(2)
            ->create(['payer_id' => $childPayer]);
        // get a dob to search
        $member = $members->first();

        $search = [
            'dob'        => $member->dob->format('Y-m-d'),
            'first_name' => $member->first_name,
            'last_name'  => $member->last_name,
        ];

        // dd($this->user->isA('hp_user'), $this->user->healthPlanUser->payer->id);
        $response = $this->post('/v1/member/search', $search);
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'meta']);

        // there should be 1 member
        $response->assertJsonPath('meta.total', 1);
        $response->assertJsonPath('data.0.dob', $member->dob->format('m/d/Y'));
        $response->assertJsonPath('data.0.first_name', $search['first_name']);
        $response->assertJsonPath('data.0.last_name', $search['last_name']);
    }

    /**
     * Test search plan members.
     *
     * @return void
     */
    public function testSearchMembersValidation()
    {
        // create members to search
        $members = Member::factory()
            ->hasAddresses(1, ['is_primary' => true])
            ->count(5)
            ->create(['payer_id' => $this->user->healthPlanUser->payer]);
        // get a dob to search
        $member = $members->first();
        // set invalid dob
        $member->dob = Carbon::now()->addWeek();
        $member->save();

        $search = [
            'dob'        => $member->dob->format('Y-m-d'),
            'first_name' => $member->first_name,
            'last_name'  => $member->last_name,
        ];

        $response = $this->post('/v1/member/search', $search);
        // should validate dob and return error;
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['dob']]);
    }

    /**
     * Test search plan members.
     *
     * @return void
     */
    public function testMemberStore()
    {
        $this->withoutExceptionHandling();
        $formData = $this->getFormData();
        $response = $this->post('/v1/member', $formData);
        $response
            ->assertStatus(201)
            ->assertJsonPath('payer.id', $this->payer->uuid)
            ->assertJsonPath('lob.id', $formData['line_of_business']);
        // verify member history was created by member create event
        $data = $response->json();
        // get the created member
        $member = Member::firstWhere('uuid', $data['id']);
        $this->assertInstanceOf(Member::class, $member);
        // the member payer history was created
        $this->assertInstanceOf(MemberPayerHistory::class, $member->history->first());
    }

    /**
     * Test member update address.
     *
     * @return void
     */
    public function testMemberUpdateAddress()
    {
        // test update address
        $formData = [
            'address_1'   => $this->faker->streetAddress,
            'address_2'   => '',
            'city'        => $this->faker->city,
            'county'      => $this->faker->lastName,
            'state'       => $this->faker->stateAbbr,
            'postal_code' => $this->faker->postcode,
        ];
        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);

        $response
            ->assertStatus(200)
            ->assertJsonPath('address.address_1', $formData['address_1']);

        // adds the address
        $this->assertCount(2, $this->member->addresses);
    }

    /**
     * Test member update with same address.
     *
     * @return void
     */
    public function testMemberUpdateSameAddress()
    {
        // test update address with the same address 
        $formData = [
            'address_1'   => $this->member->address->address_1,
            'address_2'   => $this->member->address->address_2,
            'city'        => $this->member->address->city,
            'county'      => $this->member->address->county,
            'state'       => $this->member->address->state,
            'postal_code' => $this->member->address->postal_code,
            'phone'       => $this->faker->phoneNumber, // extraneous to the address data
        ];
        $historyCount  = $this->member->history->count();
        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);
        $response
            ->assertStatus(200)
            ->assertJsonPath('address.address_1', $formData['address_1']);
        
        // does not duplicate the current address
        $this->assertCount(1, $this->member->addresses);
    }

    /**
     * Test member update phone.
     *
     * @return void
     */
    public function testMemberUpdatePhone()
    {
        // test update phone
        $formData = [
            'phone' => $this->faker->phoneNumber,
        ];
        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);
        $response
            ->assertStatus(200)
            ->assertJsonPath('phone.number', $formData['phone']);

        // phone was added
        $this->assertCount(2, $this->member->phones);
    }

     /**
     * Test member update same phone.
     *
     * @return void
     */
    public function testMemberUpdateSamePhone()
    {
        // test update same phone
        $formData = [
            'phone' => $this->member->mainPhone->number,
        ];
        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);
        $response
            ->assertStatus(200)
            ->assertJsonPath('phone.number', $formData['phone']);

        // phone was not added
        $this->assertCount(1, $this->member->phones);
    }

    /**
     * Test member update data.
     *
     * @return void
     */
    public function testMemberUpdateData()
    {
        // test update new language, gender and dob
        $formData = [
            'phone'       => $this->member->mainPhone->number,
            'language_id' => 15,
            'gender'      => 'Male' === $this->member->gender ? $this->member->gender : 'Female',
            'dob'         => $this->faker->date,
        ];

        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);
        $response
            ->assertStatus(200)
            ->assertJsonPath('language_id', $formData['language_id'])
            ->assertJsonPath('gender', $formData['gender'])
            ->assertJsonPath('dob', Carbon::parse($formData['dob'])->format('m/d/Y'));
    }

    /**
     * Test member update payer (plan).
     *
     * @return void
     */
    public function testMemberUpdatePayer()
    {
        // test update payer
        $payer = $this->payer->children->first();
        $formData = [
            'plan' => $payer->uuid,
        ];
        $historyCount = $this->member->history->count();
        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);
        $response
            ->assertStatus(200)
            ->assertJsonPath('payer.id', $payer->uuid);

        // a history record should have been created
        $historyCount++;
        $memberHistory = $this->member->history()->orderBy('id', 'desc')->get();
        $this->assertEquals($historyCount, $memberHistory->count());
        // assert the history is current
        $this->assertEquals($memberHistory->first()->payer_id, $payer->id);
    }

    /**
     * Test member update lob.
     *
     * @return void
     */
    public function testMemberUpdateLob()
    {
        // test update payer
        $formData = [
            'line_of_business' => $lobId = $this->payer->lobs()->whereNotIn('id',
                [$memberLobId = $this->member->lob->id])->first()->id,
        ];
        $historyCount = $this->member->history->count();
        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);
        $response
            ->assertStatus(200)
            ->assertJsonPath('lob.id', $lobId);

        // a history record should have been created
        $historyCount++;
        $memberHistory = $this->member->history()->orderBy('id', 'desc')->get();
        $this->assertEquals($historyCount, $memberHistory->count());
        // assert the history is current
        $this->assertEquals($memberHistory->first()->lob_id, $lobId);
    }

    /**
     * Test member update member id number.
     *
     * @return void
     */
    public function testMemberUpdateMemberId()
    {
        // test update payer
        $formData = ['member_number' => $memberId = $this->faker->isbn10];
        $historyCount = $this->member->history->count();
        $response = $this->put('/v1/member/' . $this->member->uuid, $formData);
        $response
            ->assertStatus(200)
            ->assertJsonPath('member_number', $memberId);
        // dd($response->json());
        // a history record should have been created
        $historyCount++;
        $memberHistory = $this->member->history()->orderBy('id', 'desc')->get();
        $this->assertEquals($historyCount, $memberHistory->count());
        // assert the history is current
        $this->assertEquals($memberHistory->first()->member_number, $memberId);
    }

    protected function getFormData()
    {
        $member = Member::factory()
            ->hasPhones(1)
            ->hasAddresses(1, ['is_primary' => 1])
            ->create();
        $address = $member->addresses->first();
        $phone = ['type' => 'Phone', 'value' => $member->phones->first()->number];
        $phoneAlt = ['type' => 'Phone', 'value' => $this->faker->phonenumber];
        $email = ['type' => 'Home Email', 'value' => $this->faker->email];

        return [
            'title'              => $member->name_title,
            'first_name'         => $member->first_name,
            'last_name'          => $member->last_name,
            'dob'                => $member->dob->format('Y-m-d'),
            'gender'             => $member->gender,
            'plan'               => $this->payer->uuid,
            'member_number'      => $member->member_number,
            'member_number_type' => $member->member_number_type,
            'line_of_business'   => $this->payer->lobs()->first()->id,
            'language_id'        => 6,
            'address_1'          => $address->address_1,
            'address_2'          => '',
            'city'               => $address->city,
            'state'              => $address->state,
            'postal_code'        => $address->postal_code,
            'county'             => $address->county,
            'contacts'           => [$phone, $phoneAlt, $email],
        ];
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\BouncerSeeder',
        ]);
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\LanguageSeeder',
        ]);
        $this->member = Member::factory()
            ->hasPhones(1)
            ->hasAddresses(1, ['is_primary' => 1])
            ->create();
        $this->payer = Payer::factory()->hasLobs(5)->hasChildren(5)->count(1)->create()->first();
        $this->member->payer()->associate($this->payer);
        $this->member->lob()->associate($this->payer->lobs()->first()->id);
        $this->member->save();
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());
        Bouncer::sync($this->user)->roles(['hp_user']);
        $this->user->save();
        Passport::actingAs(
            $this->user
        );
    }
}
