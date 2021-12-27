<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\Consideration;
use App\Models\Request;
use App\Models\RequestItem;
use App\Models\RequestType;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 */
class ConsiderationRequestTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    private $user;
    private $request;

    public function testAddConsideration()
    {
        // Get the assessment request
        $response = $this->json('GET', route('api.request.assessment.show', ['request' => $this->request->uuid]));
        // verify default consideration was created
        $requestItem = $this->request->requestItems()->first();
        $response
            ->assertSuccessful()
            ->assertJsonStructure([
                'request_items' => [['considerations']],
            ])
            ->assertJsonPath('request_items.0.considerations.0.is_default', true)
            ->assertJsonPath('request_items.0.considerations.0.request_type_id', (int) $requestItem->request_type_id);
        
        // the default consideration, based on the request item request type
        $defaultConsideration = $response->json()['request_items'][0]['considerations'][0];

        // get the associated request type
        $requestType = RequestType::find($requestItem->request_type_id);
        // the parent request type will have the classification id
        $classificationId = RequestType::find($requestType->parent_id)->classification_id;
        // get some request types to add that are not the default consideration
        $types = RequestType::where([['parent_id', $requestType->parent_id], ['id', '<>', $requestType->id]])->get()->map(fn($item) => $item->id);
        // Create another consideration
        $considerations = [
            [   // update the default consideration
                'id'                => $defaultConsideration['id'],
                'request_item'      => $requestItem->uuid,
                'request_type_id'   => $defaultConsideration['request_type_id'],
                'classification_id' => $defaultConsideration['classification'],
                'summary'           => 'This is a summary.',
                'is_default'        => true,
                'is_recommended'    => true,
            ],
            [   // Create another consideration
                'request_item'      => $requestItem->uuid,
                'request_type_id'   => $types[0],
                'classification_id' => (int) $classificationId,
                'summary'           => 'This is an additional consideration summary.'
            ],
        ];
        // add / update the considerations
        $response = $this->json('POST', route('api.request.assessment.consideration', ['request' => $this->request->uuid]), ['considerations' => $considerations]);
        // verify success
        $response
            ->assertSuccessful();

        // Get the assessment request
        $response = $this->json('GET', route('api.request.assessment.show', ['request' => $this->request->uuid]));
        // verify additional consideration was added
        $requestItem = $this->request->requestItems()->first();
        $response
            ->assertSuccessful()
            ->assertJsonStructure([
                'request_items' => [['considerations']],
            ])
            ->assertJsonPath('request_items.0.considerations.0.is_default', true)
            ->assertJsonPath('request_items.0.considerations.0.is_recommended', true)
            ->assertJsonPath('request_items.0.considerations.0.summary', $considerations[0]['summary'])
            ->assertJsonPath('request_items.0.considerations.1.summary', $considerations[1]['summary'])
            ->assertJsonPath('request_items.0.considerations.1.request_type_id', $considerations[1]['request_type_id']);
        
        // get the data for the added consideration
        $considerationData = $response->json()['request_items'][0]['considerations'][1];
        // change the consideration data
        $considerations[1]['id'] = $considerationData['id'];
        $considerations[1]['summary'] = 'This is an updated summary';

        // update the added consideration
        $response = $this->json('POST', route('api.request.assessment.consideration', ['request' => $this->request->uuid]), ['considerations' => $considerations]);
        // verify success
        $response
            ->assertSuccessful();

        // Get the assessment request
        $response = $this->json('GET', route('api.request.assessment.show', ['request' => $this->request->uuid]));
        // verify additional consideration was updated
        $requestItem = $this->request->requestItems()->first();
        $response
            ->assertSuccessful()
            ->assertJsonStructure([
                'request_items' => [['considerations']],
            ])
            ->assertJsonCount(2, 'request_items.0.considerations')
            ->assertJsonPath('request_items.0.considerations.1.summary', $considerations[1]['summary'])
            ->assertJsonPath('request_items.0.considerations.1.request_type_id', $considerations[1]['request_type_id']);
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
        // add a user
        $this->user = User::factory(['password' => Hash::make('password')])->create();
        // request
        $this->request = Request::first();
        Passport::actingAs(
            $this->user
        );
    }
}
