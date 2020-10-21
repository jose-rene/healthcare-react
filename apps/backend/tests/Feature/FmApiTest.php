<?php

namespace Tests\Feature;

use App\Library\FmDataApi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Passport\Passport;
use Tests\TestCase;

class FmApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test api instance.
     *
     * @var App\Library\FmDataApi
     */
    protected $fmApi;

    /**
     * Fm api response autorization token.
     *
     * @var string
     */
    protected $expectedToken;

    /**
     * Verify api is loaded correctly from test route.
     *
     * @return void
     */
    public function testApiLoad()
    {
        $this->withoutExceptionHandling();
        Passport::actingAs(
            User::factory()->create()
        );
        // test route to load api
        $response = $this->get('/api/fmtest');

        $response->assertStatus(200);
    }

    /**
     * Verify api is loaded correctly from test route.
     *
     * @return void
     */
    public function testApiConnect()
    {
        // first response without token should be invalid
        $token = $this->fmApi->connect();
        $this->assertFalse($token);
        // next response valid, should return authorization token
        $token = $this->fmApi->connect();
        $this->assertEquals($this->expectedToken, $token);
    }

    protected function setUp(): void
    {
        parent::setUp();

        // mock successful api connection payload
        $payload = [
            'response' => [
                'token' => $this->expectedToken = Str::random(51),
            ],
            'messages' => [
                [
                    'code'    => '0',
                    'message' => 'OK',
                ],
            ],
        ];

        // @note config will be pulled from .env.testing for unit tests
        $config = Config::get('services.fmapi');
        // test responses
        $responses = [$config['host'].'/*' => Http::sequence()
            ->push(json_encode(['hello' => 'world']), 200)
            ->push(json_encode($payload), 200),
            // ->pushStatus(404),
        ];
        // mock http client factory
        $client = Http::fake($responses);
        // instaniate Fm data api with mock http client
        $this->fmApi = new FmDataApi($client, $config);
    }
}
