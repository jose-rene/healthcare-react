<?php

namespace Tests\Feature\Http\Controllers\Admin;

use App\Models\Assessment;
use App\Models\AssessmentRule;
use App\Models\Payer;
use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class AssessmentRuleControllerTest
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 */
class AssessmentRuleControllerTest extends TestCase{
    use RefreshDatabase, WithFaker;

    /**
     * @var User
     */
    protected $admin;

    /**
     * @var Collection
     */
    protected $assessments;

    /**
     * Test AssessmentRule creation.
     *
     * @return void
     */
    public function testCreateRule()
    {
        // $this->withoutExceptionHandling();
        $assessment = $this->assessments->first();
        $params = [
            'name'          => $this->faker->catchPhrase(),
            'assessment_id' => $assessment->id,
        ];
        $response = $this->json('POST', route('api.admin.assessment-rules.store'), $params);
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'assessment_id'])
            ->assertJsonPath('name', $params['name'])
            ->assertJsonPath('assessment_id', $params['assessment_id']);
    }

    /**
     * Test AssessmentRule with Payer creation.
     *
     * @return void
     */
    public function testCreatePayerRule()
    {
        // get an assessment
        $assessment = $this->assessments->first();
        // create a payer
        $payer = Payer::factory()
            ->hasLobs(5, ['is_tat_enabled' => 1])
            ->hasAddresses(1, ['is_primary' => true])
            ->hasEmails(1)
            ->hasPhones(1)
            ->create();
        // make the request
        $params = [
            'name'          => $this->faker->catchPhrase(),
            'assessment_id' => $assessment->id,
            'payer_id'      => $payer->id,
        ];
        $response = $this->json('POST', route('api.admin.assessment-rules.store'), $params);
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'assessment_id', 'payer_id'])
            ->assertJsonPath('name', $params['name'])
            ->assertJsonPath('assessment_id', $params['assessment_id'])
            ->assertJsonPath('payer_id', $params['payer_id']);

        // create a therapy network
        $network = Payer::factory()
            ->hasAddresses(1, ['is_primary' => true])
            ->hasEmails(1)
            ->hasPhones(1)
            ->create(['category_id' => 3]);
        // make the request
        $params = [
            'name'          => $this->faker->catchPhrase(),
            'assessment_id' => $assessment->id,
            'payer_id'      => $network->id,
        ];
        // should fail with invalid payer
        $response = $this->json('POST', route('api.admin.assessment-rules.store'), $params);
        $response
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['payer_id']]);
    }

    /**
     * Test AssessmentRule index.
     *
     * @return void
     */
    public function testIndexRules()
    {
        // create some rules
        AssessmentRule::factory()->count(3)->create();
        $response = $this->json('GET', route('api.admin.assessment-rules.index'));
        $response
            ->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(3, 'data');
    }

    /**
     * Test show AssessmentRule.
     *
     * @return void
     */
    public function testShowRule()
    {
        // create a rule
        $rule = AssessmentRule::factory()->create();
        // request that rule
        $response = $this->json('GET', route('api.admin.assessment-rules.show', ['assessment_rule' => $rule]));
        $response
            ->assertOk()
            ->assertJsonStructure(['id', 'name', 'assessment_id'])
            ->assertJsonPath('name', $rule->name)
            ->assertJsonPath('assessment_id', $rule->assessment_id);
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        // create some assessments
        $this->assessments = Assessment::factory()->hasForms(5)->count(5)->create();
        $this->admin = User::factory()->create(['user_type' => 4, 'primary_role' => 'client_services_specialist']);
        Bouncer::sync($this->admin)->roles(['client_services_specialist']);
        $this->admin->save();
        Passport::actingAs(
            $this->admin
        );
    }
}
