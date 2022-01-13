<?php

namespace Tests\Feature;

use App\Models\Request;
use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 */
class AssessmentDiagnosisTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    private $user;
    private $request;

    public function testUpdateDiagnosis()
    {
        // Send request to update diagnosis
        $route = route('api.request.assessment.diagnosis', ['request' => $this->request->uuid]);
        $code = $this->request->relevantDiagnoses->first();
        $response = $this->put($route, $params = [
            'type_name' => 'diagnosis-only',
            'codes'     => [
                ['code' => $code->code, 'description' => $code->description],
                ['code' => 'A123', 'description' => 'hello world'],
            ],
        ]);
        $response->assertOk();
        // refresh request object
        $this->request->refresh();
        // verify relevantDiagnosis has been updated
        $diagnoses = $this->request->relevantDiagnoses->pluck('code');
        foreach ($params['codes'] as $key => $item) {
            $this->assertEquals($item['code'], $diagnoses->get($key));
        }
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

        // field clinician
        $this->user = User::factory(['user_type' => 3])->create();
        Bouncer::sync($this->user)->roles(['field_clinician']);
        // get the seeded request
        $this->request = Request::first();

        Passport::actingAs(
            $this->user
        );
    }
}
