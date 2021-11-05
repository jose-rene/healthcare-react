<?php

namespace Tests\Feature\Admin;

use App\Jobs\Admin\RequestAssessmentJob;
use App\Models\Assessment;
use App\Models\Form;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $forms;
    protected $request;

    /**
     * Test form index call.
     *
     * @return void
     */
    public function testFormIndex()
    {
        // verify the form index works for assessment building
        $response = $this->json('GET', route('api.form.index'));
        $response
            ->assertOk()
            ->assertJsonCount(5, 'data');
    }

    /**
     * Test store assessment.
     *
     * @return void
     */
    public function testAssessmentStore()
    {
        // data to store assessment
        $data = [
            'name'        => $name = $this->faker->catchPhrase(),
            'description' => $this->faker->sentence(),
            'forms'    => $this->forms->map(fn($form) => ['id' => $form->id, 'name' => $name . ' pivot', 'position' => abs($form->id - 6)])->toArray(),
        ];
        $response = $this->json('POST', route('api.admin.assessments.store'), $data);
        $response
            ->assertStatus(201)
            ->assertJsonStructure(['id']);

        // fetch the created form
        $id = $response->json()['id'];
        $response = $this->json('GET', route('api.admin.assessments.show', $id));
        // should be order reverse due to position set in data
        // assert correct position and that name is overriden
        $response
            ->assertOk()
            ->assertJsonStructure(['id', 'name', 'description', 'sections'])
            ->assertJsonCount(5, 'sections')
            ->assertJsonPath('sections.0.name', $data['forms'][4]['name']);
    }

    /**
     * Test update assessment.
     *
     * @return void
     */
    public function testAssessmentUpdate()
    {
        $assessment = Assessment::factory()->create();
        // data to update assessment
        $data = [
            'name'        => $name = $this->faker->catchPhrase(),
            'description' => $this->faker->sentence(),
            'forms'       => collect([Form::factory()->create()])->map(fn($form) => ['id' => $form->id, 'name' => $name . ' pivot', 'position' => 1])->toArray(),
        ];
        $response = $this->json('PUT', route('api.admin.assessments.update', ['assessment' => $assessment->uuid]), $data);
        $response
            ->assertOk()
            ->assertJsonStructure(['id', 'name', 'description', 'sections'])
            ->assertJsonPath('name', $data['name'])
            ->assertJsonPath('description', $data['description'])
            ->assertJsonCount(1, 'sections')
            ->assertJsonPath('sections.0.name', $data['forms'][0]['name']);
    }

     /**
     * Test assessment index.
     *
     * @return void
     */
    public function testAssessmentIndex()
    {
        // create some assessments
        Assessment::factory()->hasForms(5)->count(5)->create();
        // get index of assessments
        $response = $this->json('GET', route('api.admin.assessments.index'));
        $response
            ->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(5, 'data')
            ->assertJsonCount(5, 'data.0.sections');
    }

    public function testBindToRequest()
    {
        // create an assessment
        $data = [
            'name'        => $name = $this->faker->catchPhrase(),
            'description' => $this->faker->sentence(),
            'forms'       => $this->forms->map(fn($form) => ['id' => $form->id, 'name' => $name . ' pivot', 'position' => abs($form->id - 6)])->toArray(),
        ];
        $response = $this->json('POST', route('api.admin.assessments.store'), $data);
        $response->assertStatus(201)
                 ->assertJsonCount(count($data['forms']), 'sections');

        // get the created assessment
        $assessment = Assessment::firstWhere('uuid', $response->json()['id']);
        // test the job to make the request form sections from the assessment
        dispatch(new RequestAssessmentJob($this->request, $assessment));
        $this->assertEquals($this->request->requestFormSections->count(), 5);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        // make a request
        $this->request = Request::factory()->create();
        // make some forms
        $this->forms = Form::factory()->count(5)->create();
        $this->admin = User::factory()->create(['user_type' => 4, 'primary_role' => 'client_services_specialist']);
        Bouncer::sync($this->admin)->roles(['client_services_specialist']);
        $this->admin->save();
        Passport::actingAs(
            $this->admin
        );
    }
}
