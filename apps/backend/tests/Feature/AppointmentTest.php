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
        $formData['appointment_date'] = '';
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['appointment_date'],
            ]);
        
        // validation for reschedule
        $formData['is_cancelled'] = 0;
        $formData['initiated_by'] = 'Member';
        $formData['reason'] = $this->faker->sentence;
        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
        // validate response code and structure
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['appointment_date'],
            ]);

        // time validation
        $formData = $this->getFormData();
        $formData['end_time'] = '';
        $response = $this->json('POST', route('api.appointment.store', $formData));
        // validate response code and structure
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['end_time'],
            ]);

        // time validation for reschedule
        $formData['is_cancelled'] = 0;
        $formData['initiated_by'] = 'Member';
        $formData['reason'] = $this->faker->sentence;
        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
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
            'request_id'   => $this->request->uuid,
            'initiated_by' => 'Member',
            'reason'       => $this->faker->sentence,
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
            ->assertJsonPath('is_cancelled', $formData['is_cancelled']);

        $this->request->refresh();
        // there should be a cancelled date
        $this->assertNotNull($this->request->on_hold_date);
        // request should be placed on hold
        $this->assertEquals($this->request->request_status_id, Request::$on_hold);
        $this->assertEquals($this->request->statusName, 'On Hold');
    }

    /**
     * Test rescheduling an appointment.
     *
     * @return void
     */
    public function testAppointmentReschedule()
    {
        $formData = $this->getFormData();
        $formData['is_cancelled'] = false;
        $formData['initiated_by'] = 'Member';

        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
        // reason is required
        $response->assertStatus(422)->assertJsonStructure(['errors']);

        // add reason for reschedule
        $formData['reason'] = $this->faker->sentence;
        $response = $this->json('POST', route('api.appointment.reschedule', $formData));
        // validate response code and structure
        $response
            ->assertStatus(201)
            ->assertJsonPath('is_cancelled', false)
            ->assertJsonPath('is_reschedule', true)
            ->assertJsonPath('reason', $formData['reason']);

        // verify appointment date was generated from observer
        $data = $response->json();
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
        // dd($response->json());
        $apptDate = Carbon::tomorrow();
        // our central time times in utc
        $startTime = Carbon::parse($formData['appointment_date'] . ' ' . $formData['start_time'] . ':00', $formData['timeZone'])
            ->tz('UTC')
            ->format('m/d/Y H:i:s');
        $endTime = Carbon::parse($formData['appointment_date'] . ' ' . $formData['end_time'] . ':00', $formData['timeZone'])
            ->tz('UTC')
            ->format('m/d/Y H:i:s');
        $response
            ->assertOk()
            ->assertJsonStructure([
                'appointment_date',
                'appointment',
            ])
            ->assertJsonPath('appointment.appointment_date', $apptDate->format('m/d/Y'))
            ->assertJsonPath('appointment.start_time', $startTime)
            ->assertJsonPath('appointment.end_time', $endTime)
            ->assertJsonPath('status', 'Scheduled')
            ->assertJsonPath('appt_window.start', $startTime)
            ->assertJsonPath('appt_window.end', $endTime);
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
            'timeZone'        => 'America/Chicago',
        ];
    }

    protected function setUp(): void
    {
        parent::setUp();
        // seed the Bouncer roles
        Artisan::call('db:seed', [
            '--class' => 'BouncerSeeder',
        ]);
        Artisan::call('db:seed', [
            '--class' => 'ActivityTypeSeeder',
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
