<?php

namespace Tests\Feature;

use App\Models\Language;
use App\Models\Payer;
use App\Models\TrainingDocument;
use App\Models\User;
use App\Models\UserType\HealthPlanUser;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class PayerTest extends TestCase
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
            ->assertJsonStructure(['company_name', 'lines_of_business', 'payers', 'member_number_types', 'request_types', 'languages'])
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
        $response = $this->json('GET', 'v1/payer/' . $this->payer->uuid);
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['company_name', 'lines_of_business', 'payers', 'member_number_types', 'request_types', 'languages'])
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
        $response = $this->json('GET', 'v1/payer/' . $this->payer->uuid);
        // validate response code and structure
        // dd($response->json());
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['company_name', 'lines_of_business', 'payers', 'member_number_types'])
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
        $response = $this->json('GET', 'v1/payer/' . $this->payer->uuid);
        // validate response code and structure
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['company_name', 'lines_of_business', 'payers', 'member_number_types'])
            ->assertJsonCount($payerCount, 'payers.0.payers');
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
        $this->payer = Payer::factory()->hasLobs(5, ['is_tat_enabled' => 1])->count(1)->create()->first();
        $this->user = User::factory()->create(['user_type' => 2, 'primary_role' => 'hp_user']);
        $this->user->healthPlanUser()->save(HealthPlanUser::factory()->create(['payer_id' => $this->payer]));
        Bouncer::sync($this->user)->roles(['hp_user']);
        $this->user->save();
        Passport::actingAs(
            $this->user
        );
    }
}
