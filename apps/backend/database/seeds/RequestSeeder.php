<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Payer;
use App\Models\Request;
use App\Models\RequestStatus;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class RequestSeeder extends Seeder
{
    protected $faker;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $count = 1;
        // prompt for the number of requests if not unit test env
        if ('testing' !== app()->environment()) {
            $count = (int) $this->command->ask('How many requests would you like to seed?');
        }

        // instansiate faker
        $this->faker = Faker::create();

        // the test healthplan
        $payer = Payer::firstWhere(['name' => 'Test Health Plan']);

        if (empty($payer)) {
            $this->command->error('Run the database seeder to create the Test Health Plan and associated records');

            return;
        }

        for ($xx = 0; $xx < $count; $xx++) {
            $this->generateRequest($payer);
        }
    }

    protected function generateRequest($payer)
    {
        // get a member
        $member = Member::factory()
            ->hasPhones(1)
            ->hasAddresses(1)
            ->count(1)
            ->create([
                'payer_id' => $payer,
                'lob_id'   => $payer->lobs->slice(rand(0, $payer->lobs->count() - 1), 1)->first(),
            ])
            ->first();

        // make a request
        $request = Request::factory()->create([
            'auth_number'             => $this->faker->regexify('[A-Za-z0-9]{24}'),
            'due_at'                  => Carbon::now()->addWeeks(1),
            'member_verified_at'      => Carbon::now(),
            'member_id'               => $member,
            'payer_user_id'           => User::firstWhere('email', 'admin@admin.com'),
            'member_payer_history_id' => $member->history->first(),
            'member_address_id'       => $member->addresses->first()->id,
        ]);

        // add relevant diagnosis
        $request->relevantDiagnoses()->create(['code' => 'A20.0', 'description' => 'A20.0 - Bubonic plague']);

        // get request types that don't have children there will have details
        $types = $payer->requestTypes()->doesntHave('children')->get();
        // get a random request type
        $requestType = $types->slice(rand(0, $types->count() - 1), 1);
        // get the request details from the request type
        $details = $requestType->first()->requestTypeDetails;
        // params for the request item based upon the request type
        $requestItem = $requestType
            ->map(fn ($item) => ['id' => null, 'request_id' => $request->id, 'request_type_id' => $item['id'], 'name' => $item['name']])
            ->all();
        // sync the request item
        $request
            ->requestItems()
            ->sync($requestItem);
        // sync a random details from the request type details of the associated request type for the request item
        $request->requestItems->first()->requestTypeDetails()->sync(
            $details->slice(rand(0, $details->count() - 1), 1)->first()->toArray()
        );
        // add the received date
        $request->requestDates()->create(['request_date_type_id' => 1, 'date' => Carbon::now()]);

        // update status to received
        $request->requestStatus()->associate(RequestStatus::find(1))->save();
    }
}
