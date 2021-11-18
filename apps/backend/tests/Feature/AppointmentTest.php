<?php

namespace Tests\Feature;

use App\Models\Activity\Activity;
use App\Models\Appointment;
use App\Models\Request;
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
     * Test creating an appointment with invalid called date.
     *
     * @return void
     */
    public function testAppointmentValidation()
    {
        $formData = $this->getFormData();
        unset($formData['appointment_date']);
        // data before yesterday, should fail
        $formData['called_at']  = Carbon::yesterday()->format('Y-m-d');
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['appointment_date'],
            ]);
        
        $formData = $this->getFormData();
        unset($formData['end_time']);
        // data before yesterday, should fail
        $formData['called_at']  = Carbon::yesterday()->format('Y-m-d');
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['end_time'],
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
        $response
            ->assertStatus(201)
            ->assertJsonPath('called_at', Carbon::today()->format('m/d/Y'))
            ->assertJsonPath('is_scheduled', $formData['is_scheduled']);

        // verify called date and appointment date were generated from observer
        $data = $response->json();
        $this->assertEquals($data['called_at'], $this->request->called_date->format('m/d/Y'));
        $this->assertEquals($data['appointment_date'], $this->request->appointment_date->format('m/d/Y'));

        // verify activity was created
        $activity = Activity::where('request_id', $this->request->id)->orderBy('id', 'desc')->first()->toArray();
        $this->assertArrayHasKey('json_message', $activity);
        $this->assertArrayHasKey('appointment_date', $activity['json_message']);
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

    /**
     * Test cancelling an appointment.
     *
     * @return void
     */
    public function testAppointmentCancel()
    {
        $formData = [
            'request_id'       => $this->request->uuid,
            'called_at'        => Carbon::today()->format('Y-m-d'),
            'reason'           => $this->faker->sentence,
        ];
        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
        // reschedule or cancel is required
        $response->assertStatus(422)->assertJsonStructure(['errors']);

        // cancel
        $formData['is_cancelled'] = true;
        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
        // validate response code and structure
        $response
            ->assertStatus(201)
            ->assertJsonPath('called_at', Carbon::today()->format('m/d/Y'))
            ->assertJsonPath('is_cancelled', $formData['is_cancelled']);
    }

    /**
     * Test cancelling an appointment.
     *
     * @return void
     */
    public function testAppointmentReschedule()
    {
        $formData = $this->getFormData();
        $formData['is_cancelled'] = false;

        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
        // reason is required
        $response->assertStatus(422)->assertJsonStructure(['errors']);

        // add reason for reschedule
        $formData['reason'] = $this->faker->sentence;
        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
        // validate response code and structure
        $response
            ->assertStatus(201)
            ->assertJsonPath('called_at', Carbon::today()->format('m/d/Y'))
            ->assertJsonPath('is_cancelled', false)
            ->assertJsonPath('is_reschedule', true)
            ->assertJsonPath('reason', $formData['reason']);

        // verify called date and appointment date were generated from observer
        $data = $response->json();
        $this->assertEquals($data['called_at'], $this->request->called_date->format('m/d/Y'));
        $this->assertEquals($data['appointment_date'], $this->request->appointment_date->format('m/d/Y'));

        // verify activity was created
        $activity = Activity::where('request_id', $this->request->id)->orderBy('id', 'desc')->first()->toArray();
        $this->assertArrayHasKey('json_message', $activity);
        $this->assertArrayHasKey('appointment_date', $activity['json_message']);
    }

    /* Test appointment relation to request.
     *
     * @return void
     */
    public function testRequestAppointment()
    {
        $formData = $this->getFormData();
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        $response->assertStatus(201);
        $appointment = Appointment::find($response->json()['id']);
        $this->assertEquals($appointment->request->uuid, $this->request->uuid);

        // verify the appointment is set for the request
        $response = $this->json('GET', route('api.request.assessment.show', ['request' => $this->request->uuid]));
        // validate response code and structure
        $response
            ->assertOk()
            ->assertJsonStructure([
                'appointment_date',
                'appointments',
            ])
            ->assertJsonCount(1, 'appointments');
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
        $this->user = User::factory()->create(['user_type' => 3, 'primary_role' => 'field_clinican']);
        Bouncer::sync($this->user)->roles(['field_clinician']);
        $this->request = Request::factory()->create(['clinician_id' => $this->user->id]);
        $this->request->requestDates()->create(['request_date_type_id' => 1, 'date' => Carbon::now()]);
        Passport::actingAs(
            $this->user
        );
    }
}
