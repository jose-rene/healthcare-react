<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

class MemberTest extends TestCase
{
    use RefreshDatabase;

    protected $member;
    protected $address;
    protected $user;

    /**
     * Test fetching member.
     *
     * @return void
     */
    public function testGetMember()
    {
        $this->withoutExceptionHandling();
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
        $response->assertJsonStructure(['id', 'gender', 'title', 'firstName', 'lastName', 'address']);
        // validate data
        $data = json_decode($response->getContent(), true);
        // id is the uuid
        $this->assertEquals($data['id'], $this->member->uuid);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // Address factory will create a member as addressable entity.
        $this->address = Address::factory()->create();
        $this->member = $this->address->addressable()->first();
        $this->user = User::factory()->create();
    }
}
