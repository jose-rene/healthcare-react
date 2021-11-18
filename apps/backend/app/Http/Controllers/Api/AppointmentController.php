<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Request as modelRequest;
use App\Http\Requests\AppointmentRequest;
use App\Http\Requests\RescheduleRequest;
use App\Http\Resources\AppointmentResource;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Exceptions\HttpResponseException;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  App\Requests\AppointmentRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(AppointmentRequest $request)
    {
        $appointment = $this->createAppointment($request->validated());

        return new AppointmentResource($appointment);
    }

    /**
     * Display the specified resource.
     *
     * @param  App\Requests\RescheduleRequest $request
     * @return \Illuminate\Http\Response
     */
    public function reschedule(RescheduleRequest $request)
    {
        $data = $request->validated();
        // if not explicitly cancelled it's a reschedule
        if (empty($data['is_cancelled'])) {
            $data['is_reschedule'] = true;
        }
        $appointment = $this->createAppointment($data);

        return new AppointmentResource($appointment);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function show(Appointment $appointment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Appointment $appointment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Appointment $appointment)
    {
        //
    }

    protected function createAppointment($data)
    {
        // get the request
        $modelRequest = modelRequest::firstWhere('uuid', $data['request_id']);
        if ($modelRequest->received_date->gt(Carbon::createFromFormat('Y-m-d',$data['called_at']))) {
            throw new HttpResponseException(response()->json(['errors' => ['called_at' => ['The called date must be on or after the received date.']]], 422));
        }
        $data['request_id'] = $modelRequest->id;
        $data['clinician_id'] = auth()->user()->id;
        
        return Appointment::create($data);
    }
}
