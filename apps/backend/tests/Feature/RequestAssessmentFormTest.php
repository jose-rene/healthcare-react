<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\Form;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Passport;
use Storage;
use Tests\TestCase;

/**
 * Class
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 */
class RequestAssessmentFormTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    private $user;
    private $request;
    private $form;


    public function testRetrieveFormSection()
    {
        // Request a form
        $url = route('api.request.request_form_section.show', [
            'request'              => $this->request->uuid,
            'request_form_section' => $this->form->slug,
        ]);

        $response = $this->get($url);
        // verify response
        $response
            ->assertSuccessful()
            ->assertJsonStructure([
                'name',
                'slug',
                'answer_data',
                'fields',
                'request_id',
            ])
            ->assertJsonPath('fields', $this->form->fields)
            ->assertJsonPath('request_id', $this->request->uuid)
            ->assertJsonPath('slug', $this->form->slug);
    }

    public function testSaveFormSection()
    {
        // Request a form
        $url = route('api.request.request_form_section.show', [
            'request'              => $this->request->uuid,
            'request_form_section' => $this->form->slug,
        ]);

        $response = $this->get($url);
        // verify response
        $response->assertSuccessful();

        // save the form
        $url = route('api.request.request_form_section.update', [
            'request'              => $this->request->uuid,
            'request_form_section' => $this->form->slug,
        ]);

        $response = $this->put($url, ['form_data' => ['pi' => 'are round']]);
        // verify response
        $response->assertSuccessful();

    }

    public function testRetrieveAssessment()
    {
        $assessment = Assessment::find(1);
        $response = $this->json('GET', route('api.request.assessment.show', ['request' => $this->request->uuid]));

        $response
            ->assertSuccessful()
            ->assertJsonStructure([
                'assessment_form',
            ])
            ->assertJsonPath('assessment_form.name', 'Standard Assessment')
            ->assertJsonPath('assessment_form.forms.0.slug', $this->form->slug);
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('passport:install');
        Artisan::call('db:seed');
        // add a request
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\RequestSeeder',
        ]);
        /*$path = storage_path('app/forms/social-history.json');
        $content = file_get_contents($path);*/
        $this->form = Form::create([
            'name'   => 'Social History',
            'slug'   => 'social-history',
            'description' => 'The Social History section',
            'fields' => ['name' => 'Hello World'],
        ]);
        $this->assessment = Assessment::create([
            'name' => 'Standard Assessment',
            'slug' => 'standard-assessment',
            'description' => 'The Standard Assessment',
        ]);
        $this->assessment->forms()->attach([$this->form->id]);
        // this will store a new user with random attributes in the database.
        /* @var User $user */
        $this->user   = User::factory(['password' => Hash::make('password')])->create();
        // request
        $this->request = Request::first();

        Passport::actingAs(
            $this->user
        );
    }
}
