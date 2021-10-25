<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Artisan;
use Bouncer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;
use Illuminate\Support\Str;

class FormTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;

    /**
     * Test storing a form.
     *
     * @return void
     */
    public function testFormStore()
    {
        // make a form
        $data = [
            'name'        => $name = $this->faker->catchPhrase(),
            'slug'        => Str::slug($name, '-'),
            'description' => $this->faker->sentence(),
        ];
        $response = $this->json('POST', route('api.form.store'), $data);
        // validate response code and structure
        $response
            ->assertStatus(201)
            ->assertJsonPath('name', $name)
            ->assertJsonPath('slug', $data['slug'])
            ->assertJsonPath('description', $data['description'])
            ->assertJsonPath('fields', []);

        // form is in index of forms
        $response = $this->json('GET', route('api.form.index'));
        $response
            ->assertOk()
            ->assertJsonPath('data.0.name', $name)
            ->assertJsonPath('data.0.slug', $data['slug'])
            ->assertJsonPath('data.0.description', $data['description']);

        // show form
        $form = $response->json()['data'][0];
        $response = $this->json('GET', $url = route('api.form.show', ['form' => $form['slug']]));
        $response
            ->assertOk()
            ->assertJsonPath('name', $name)
            ->assertJsonPath('slug', $data['slug'])
            ->assertJsonPath('description', $data['description'])
            ->assertJsonPath('fields', []);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Artisan::call('passport:install');
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        $this->admin = User::factory()->create(['user_type' => 4, 'primary_role' => 'client_services_specialist']);
        Bouncer::sync($this->admin)->roles(['client_services_specialist']);
        $this->admin->save();
        Passport::actingAs(
            $this->admin
        );
    }
}
