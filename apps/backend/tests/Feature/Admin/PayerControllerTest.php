<?php

namespace Tests\Feature\Admin;

use App\Models\Language;
use App\Models\MemberNumberType;
use App\Models\Payer;
use App\Models\Address;
use App\Models\TrainingDocument;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class.
 * @link  https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link  https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 * @group admin
 */
class PayerControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $member;
    protected $user;

    /**
     * Test payer profile route.
     *
     * @return void
     */
    public function testProfile()
    {
        // fetch the payer profile
        $response = $this->get('/v1/payer/profile');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'company_name',
                'lines_of_business',
                'payers',
                'member_number_types',
                'classifications',
                'languages',
                'contacts',
            ])
            ->assertJsonCount(Language::all()->count(), 'languages');
    }

    /**
     * Test fetching payer.
     *
     * @return void
     */
    public function testGetPayer()
    {
        // get the payer
        $response = $this->json('GET', route('api.admin.payer.show', $this->payer->uuid));
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'company_name',
                'lines_of_business',
                'payers',
                'member_number_types',
                'classifications',
                'languages',
                'contacts',
            ])
            ->assertJsonCount(Language::all()->count(), 'languages');
    }

    /**
     * Test fetching payer.
     *
     * @return void
     */
    public function testGetPayerWithChildren()
    {
        // add child records
        $this->payer->children()->saveMany(
            Payer::factory()->hasLobs(3)->count($payerCount = 3)->create()
        );
        // get the payer
        $response = $this->json('GET', route('api.admin.payer.show', $this->payer->uuid));
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['company_name', 'lines_of_business', 'payers', 'member_number_types', 'contacts'])
            ->assertJsonCount($payerCount, 'payers');
    }

    /**
     * Test that the payer child hierarchy is retrieved properly.
     *
     * @return void
     */
    public function testPayerChildHierarchy()
    {
        // child record with children
        $child = Payer::factory()->hasLobs(3)->create();
        // add children to child
        $child->children()->saveMany(
            Payer::factory()->hasLobs(3)->count($payerCount = 3)->create()
        );
        // add child records
        $this->payer->children()->save($child);
        // get the payer
        $response = $this->json('GET', route('api.admin.payer.show', $this->payer->uuid));
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['company_name', 'lines_of_business', 'payers', 'member_number_types'])
            ->assertJsonCount($payerCount, 'payers.0.payers');
    }

    /**
     * Test payer update.
     *
     * @return void
     */
    public function testUpdatePayer()
    {
        $formData = [
            'name'                => $company = $this->faker->company,
            'category_id'         => 2,
            'abbreviation'        => substr($company, 0, 3),
            'assessment_label'    => $this->faker->catchPhrase,
            'member_number_types' => [MemberNumberType::first()->id],
            'has_phi'             => 1,
        ];
        // update the payer
        $response = $this->json('PUT', route('api.admin.payer.update', $this->payer->uuid), $formData);

        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['company_name', 'lines_of_business', 'payers', 'member_number_types'])
            ->assertJsonCount(1, 'member_number_types')
            ->assertJsonPath('company_name', $formData['name'])
            ->assertJsonPath('abbreviation', $formData['abbreviation'])
            ->assertJsonPath('assessment_label', $formData['assessment_label'])
            ->assertJsonPath('category.id', $formData['category_id'])
            ->assertJsonPath('has_phi', (bool) $formData['has_phi']);
    }

    /**
     * Test adding address.
     *
     * @return void
     */
    public function testCompanyAddAddress()
    {
        $formData = [
            'is_primary'      => true,
            'address_1'       => $this->faker->streetAddress,
            'city'            => $this->faker->city,
            'county'          => $this->faker->lastName,
            'state'           => $this->faker->stateAbbr,
            'postal_code'     => $this->faker->postcode,
            'address_type_id' => 2,
        ];
        $response = $this->json('POST', route('api.admin.payer.address.create', ['payer' => $this->payer]), $formData);
        $response
            ->assertStatus(201)
            ->assertJsonPath('type.id', $formData['address_type_id'])
            ->assertJsonPath('is_primary', $formData['is_primary'])
            ->assertJsonPath('address_1', $formData['address_1'])
            ->assertJsonPath('city', $formData['city'])
            ->assertJsonPath('county', $formData['county'])
            ->assertJsonPath('state', $formData['state'])
            ->assertJsonPath('postal_code', $formData['postal_code']);
    }

    /**
     * Test updating address.
     *
     * @return void
     */
    public function testCompanyUpdateAddress()
    {
        $formData = [
            'is_primary'      => true,
            'address_1'       => $this->faker->streetAddress,
            'city'            => $this->faker->city,
            'county'          => $this->faker->lastName,
            'state'           => $this->faker->stateAbbr,
            'postal_code'     => $this->faker->postcode,
            'address_type_id' => 2,
        ];
        $response = $this->json('PUT', route('api.admin.payer.address.update', [
            'payer' => $this->payer,
            'id' => $this->payer->main_address->id,
        ]), $formData);

        $response
            ->assertOk()
            ->assertJsonPath('type.id', $formData['address_type_id'])
            ->assertJsonPath('is_primary', $formData['is_primary'])
            ->assertJsonPath('address_1', $formData['address_1'])
            ->assertJsonPath('city', $formData['city'])
            ->assertJsonPath('county', $formData['county'])
            ->assertJsonPath('state', $formData['state'])
            ->assertJsonPath('postal_code', $formData['postal_code']);
    }

    /**
     * Test updating address.
     *
     * @return void
     */
    public function testCompanyDeleteAddress()
    {
        $response = $this->json('DELETE', route('api.admin.payer.address.delete', [
            'payer' => $this->payer,
            'id' => $this->payer->main_address->id,
        ]));
        // should not process, cannot delete only address
        $response
            ->assertStatus(422);

        // add an address
        Address::factory()->create(['addressable_type' => Payer::class, 'addressable_id' => $this->payer->id]);
        $addressCount = $this->payer->addresses->count();
        // try again
        $response = $this->json('DELETE', route('api.admin.payer.address.delete', [
            'payer' => $this->payer,
            'id' => $this->payer->main_address->id,
        ]));
        // should not process, cannot delete only address
        $response
            ->assertOk();
        // address was deleted
        $addressCount--;
        $this->assertEquals($addressCount, $this->payer->addresses()->get()->count());
    }

    /**
     * Test payer's phone update.
     *
     * @return void
     */
    public function testUpdatePayerPhone()
    {
        $formData = [
            'number'     => $this->faker->phoneNumber(),
            'is_primary' => 0,
        ];
        $route = route('api.admin.payer.phone.update', [
            'payer' => $this->payer,
            'id'    => $this->payer->phones->first()->uuid,
        ]);
        // update the payer's phone
        $response = $this->json('PUT', $route, $formData);
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonPath('contact', $formData['number'])
            ->assertJsonPath('is_primary', (bool) $formData['is_primary']);
    }

    /**
     * Test payer's email update.
     *
     * @return void
     */
    public function testUpdatePayerEmail()
    {
        $formData = [
            'email'      => $this->faker->companyEmail(),
            'is_primary' => 0,
        ];
        $route = route('api.admin.payer.email.update', [
            'payer' => $this->payer,
            'id'    => $this->payer->emails->first()->uuid,
        ]);
        // update the payer's email
        $response = $this->json('PUT', $route, $formData);
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonPath('contact', $formData['email'])
            ->assertJsonPath('is_primary', (bool) $formData['is_primary']);
    }

    /**
     * Test delete payer's email.
     *
     * @return void
     */
    public function testDeletePayerEmail()
    {
        $route = route('api.admin.payer.email.delete', [
            'payer' => $this->payer,
            'id'    => $this->payer->emails->first()->uuid,
        ]);
        // update the payer's email
        $response = $this->json('DELETE', $route);
        // should return an error since there is only one email contact
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);

        // add an email
        $this->payer->emails()->create(['email' => $email = $this->faker->companyEmail, 'is_primary' => true]);
        // try again, should be successful
        $response = $this->json('DELETE', $route);
        // should return ok when email is deleted
        $response->assertOk();
        // verify email is deleted
        $this->assertEquals($email, $this->payer->main_email->email);
        $this->assertEquals(1, $this->payer->emails->count());
    }

    /**
     * Test delete payer's email.
     *
     * @return void
     */
    public function testDeletePayerPhone()
    {
        $route = route('api.admin.payer.phone.delete', [
            'payer' => $this->payer,
            'id'    => $this->payer->phones->first()->uuid,
        ]);
        // update the payer's email
        $response = $this->json('DELETE', $route);
        // should return an error since there is only one phone contact
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);

        // add a phone
        $this->payer->phones()->create(['number' => $phone = $this->faker->phoneNumber, 'is_primary' => true]);
        // try again, should be successful
        $response = $this->json('DELETE', $route);
        // should return ok when email is deleted
        $response->assertOk();
        // verify email is deleted
        $this->assertEquals($phone, $this->payer->main_phone->number);
        $this->assertEquals(1, $this->payer->phones->count());
    }

    /**
     * @group training
     * @group document
     * @group functional
     */
    public function testLoadingTrainingDocuments()
    {
        Passport::actingAs(
            $this->user
        );

        TrainingDocument::factory()->count(4)->create(['training_document_type_id' => '2']);

        // Make sure I can get training documents by correct type.
        $response = $this->get(route('api.training_document.index') . '?training_document_type_id=2');
        $response->assertSuccessful();
        $data = $response->json();
        self::assertCount(4, $data);

        // Make sure I get n o training documents by wrong type.
        $response = $this->get(route('api.training_document.index') . '?training_document_type_id=1');
        $response->assertSuccessful();
        $data = $response->json();
        self::assertCount(0, $data);
    }

     /**
     * @group training
     * @group document
     * @group functional
     */
    public function testIndexHealthPlans()
    {
        Passport::actingAs(
            $this->user
        );

        // create some hps for a total of 5
        Payer::factory()
            ->hasLobs(5, ['is_tat_enabled' => 1])
            ->hasAddresses(1, ['is_primary' => true])
            ->hasEmails(1)
            ->hasPhones(1)
            ->count(4)
            ->create();

        // Make sure I can get training documents by correct type.
        $response = $this->get(route('api.admin.payer.index', ['category' => 1, 'subcategory' => 1]));
        $response
            ->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(5, 'data');
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        Artisan::call('db:seed', [
            '--class' => 'RequestTypeSeeder',
        ]);
        Artisan::call('db:seed', [
            '--class' => 'LanguageSeeder',
        ]);
        $this->payer = Payer::factory()
            ->hasLobs(5, ['is_tat_enabled' => 1])
            ->hasAddresses(1, ['is_primary' => true])
            ->hasEmails(1)
            ->hasPhones(1)
            ->create();
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create(['payer_id' => $this->payer]));

        Bouncer::allow('admin')->everything();

        Bouncer::sync($this->user)->roles(['hp_user', 'admin']);
        $this->user->save();
        Passport::actingAs(
            $this->user
        );
    }
}
