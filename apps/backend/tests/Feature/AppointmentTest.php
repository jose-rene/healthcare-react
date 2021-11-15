<?php

namespace Tests\Feature;

use App\Models\Request;
use App\Models\Appointment;
use App\Models\User;
use Artisan;
use Bouncer;
use Carbon\Carbon;
use Database\Seeders\HealthPlanUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $request;
    protected $user;

    /**
     * Test creating an appointment with invalid called date.
     *
     * @return void
     */
    public function testAppointmentCalledDate()
    {
        $formData = $this->getFormData();
        // data before yesterday, should fail
        $formData['called_at']  = Carbon::yesterday()->format('Y-m-d');
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['called_at'],
            ]);
    }

    /**
     * Test creating an appointment.
     *
     * @return void
     */
    public function testAppointmentCreation()
    {
        $formData = $this->getFormData();
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        // dd($response->json());
        $response
            ->assertStatus(201)
            ->assertJsonPath('called_at', Carbon::today()->format('m/d/Y'))
            ->assertJsonPath('is_scheduled', $formData['is_scheduled']);

        $this->request->refresh();
    }

    /**
     * Test creating without appointment.
     *
     * @return void
     */
    public function testCreationNoAppt()
    {
        Event::fake();
        $formData = [
            'request_id'   => $this->request->uuid,
            'called_at'    => Carbon::today()->format('Y-m-d'),
            'is_scheduled' => false,
            'reason'       => $this->faker->sentence,
        ];
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        // dd($response->json());
        $response
            ->assertStatus(201)
            ->assertJsonPath('called_at', Carbon::today()->format('m/d/Y'))
            ->assertJsonPath('is_scheduled', $formData['is_scheduled'])
            ->assertJsonPath('reason', $formData['reason']);

        // assert the created event was dispatched
        Event::assertDispatched("eloquent.created: App\Models\Appointment");
    }

    protected function getFormData()
    {
        return [
            'request_id'       => $this->request->uuid,
            'is_scheduled'     => true,
            'called_at'        => Carbon::today()->format('Y-m-d'),
            'appointment_date' => Carbon::tomorrow()->format('Y-m-d'),
            'start_time'       => '10:00',
            'end_time'         => '12:00',
        ];
    }

    protected function setUp(): void
    {
        parent::setUp();
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        $this->request = Request::factory()->create();
        $this->request->requestDates()->create(['request_date_type_id' => 1, 'date' => Carbon::now()]);
        $this->user = User::factory()->create(['user_type' => 3, 'primary_role' => 'field_clinican']);
        Bouncer::sync($this->user)->roles(['field_clinician']);
        Passport::actingAs(
            $this->user
        );
    }
}
