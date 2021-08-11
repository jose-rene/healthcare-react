<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\Payer;
use App\Models\RequestType;
use Illuminate\Database\Seeder;

class RequestTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (null === ($testPayer = Payer::firstWhere('name', 'Test Health Plan'))) {
            return;
        }
        // get a collection of the child payers
        $payerCollection = $testPayer->children;
        // prepend the main payer
        $payerCollection->prepend($testPayer);
        // main classifications
        $classifications = [
            'In-Home Assessment',
            'Complex Assessment',
            'EM Home Assessment',
            'Home Modification',
            'Speech Device - Chart Review',
            'Workplace Ergonomic Assessment',
        ];
        if (null !== Classification::firstWhere('name', $classifications[0])) {
            return;
        }
        foreach ($payerCollection as $payer) {
            foreach ($classifications as $name) {
                // $requestType = RequestType::factory()->create(['name' => $name, 'payer_id' => $payer]);
                $classification = Classification::factory()->create(['name' => $name, 'payer_id' => $payer]);
                $requestTypes = $classification->requestTypes()->saveMany(
                RequestType::factory()
                    ->count(3)
                    ->create(['payer_id' => $payer, 'classification_id' => $classification])
                );
                // add some children to children with request details
                $children = $requestTypes->each(fn ($type) => $type->children()->saveMany(
                    RequestType::factory()
                        ->hasRequestTypeDetails(10)
                        ->count(3)
                        ->create(['payer_id' => $payer])
                ));
                // if you wanted to add one more level (remove details above)
                /*$children->each(fn ($child) => $child->children()->saveMany(
                    RequestType::factory()
                        ->hasRequestTypeDetails(10)
                        ->count(3)
                        ->create(['payer_id' => $payer])
                ));*/
            }
        }

        // dd($requestType->toArray());
    }
}
