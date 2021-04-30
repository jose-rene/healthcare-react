<?php

namespace Database\Seeders;

use App\Models\Payer;
use App\Models\RequestType;
use App\Models\RequestTypeDetail;
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
        $payer = Payer::firstWhere('name', 'Test Health Plan');
        $types = [
            'In-Home Assessment',
            'Complex Assessment',
            'EM Home Assessment',
            'Home Modification',
            'Speech Device - Chart Review',
            'Workplace Ergonomic Assessment',
        ];
        if (null !== RequestType::firstWhere('name', $types[0])) {
            return;
        }
        foreach ($types as $name) {
            $requestType = RequestType::factory()->create(['name' => $name, 'payer_id' => $payer]);
            $children = $requestType->children()->saveMany(
                RequestType::factory()
                    // ->hasChildren(3)
                    // ->hasRequestTypeDetails(10)
                    ->count(3)
                    ->create(['payer_id' => $payer])
            );
            // add some children to children with request details
            $children->each(fn ($child) => $child->children()->saveMany(
                    RequestType::factory()
                        ->hasRequestTypeDetails(10)
                        ->count(3)
                        ->create(['payer_id' => $payer])
                )
            );
        }

        // dd($requestType->toArray());
    }
}
