<?php

namespace Tests\Feature;

use App\Models\Member;
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
        Passport::actingAs(
            $this->user
        );
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
        Passport::actingAs(
            $this->user
        );
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
        Passport::actingAs(
            $this->user
        );
        // get the member
        $response = $this->withHeaders([
            'Accept'           => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->json('GET', 'v1/plan/idtypes');
        // validate response code
        $response->assertStatus(200);
    }

    /**
     * Test search plan members.
     *
     * @return void
     */
    public function testSearchMembers()
    {
        // create members to search
        $members = Member::factory(['payer_id' => $this->user->healthPlanUser->payer])->count(2)->create();
        // get a dob to search
        $member = $members->first();

        $search = [
            'dob'        => $member->dob->format('Y-m-d'),
            'first_name' => $member->first_name,
            'last_name'  => $member->last_name,
        ];
        Passport::actingAs(
            $this->user
        );
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
        $members = Member::factory(['payer_id' => $this->user->healthPlanUser->payer])->count(5)->create();
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
        Passport::actingAs(
            $this->user
        );

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
        Passport::actingAs(
            $this->user
        );
        $formData = $this->getFormData();
        $response = $this->post('/v1/member', $formData);
        // dd($response->json());
        $response->assertStatus(201);
        $response->assertJsonPath('payer.id', $this->payer->uuid);
        $response->assertJsonPath('lob.id', $formData['line_of_business']);
    }

    protected function getFormData()
    {
        $member = Member::factory()->hasPhones(1)->hasAddresses(1)->count(1)->create()->first();
        $address = $member->addresses->first();
        $phone = ['type' => 'Phone', 'value' => $member->phones->first()->number];
        $phoneAlt = ['type' => 'Phone', 'value' => $this->faker->phonenumber];
        $email = ['type' => 'Home Email', 'value' => $this->faker->email];

        return [
            'title'            => $member->name_title,
            'first_name'       => $member->first_name,
            'last_name'        => $member->last_name,
            'dob'              => $member->dob->format('Y-m-d'),
            'gender'           => $member->gender,
            'plan'             => $this->payer->uuid,
            'member_number'    => $member->member_number,
            'member_id_type'   => $member->member_id_type,
            'line_of_business' => $this->payer->lobs()->first()->pivot->id,
            'language'         => $member->language,
            'address_1'        => $address->address_1,
            'address_2'        => '',
            'city'             => $address->city,
            'state'            => $address->state,
            'postal_code'      => $address->postal_code,
            'county'           => $address->county,
            'contacts'         => [$phone, $phoneAlt, $email],
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
        $this->member = Member::factory()->hasPhones(1)->hasAddresses(1)->count(1)->create()->first();
        $this->payer = Payer::factory()->hasLobs(5)->count(1)->create()->first();
        $this->member->payer()->associate($this->payer);
        $this->member->lob()->associate($this->payer->lobs()->first()->pivot->id);
        $this->member->save();
        // dd($this->member->contacts->toArray());
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create());
        Bouncer::sync($this->user)->roles(['hp_user']);
        $this->user->save();
    }
}
