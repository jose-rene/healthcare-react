<?php

namespace Database\Seeders;

use App\Models\Lob;
use App\Models\Payer;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class PayerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $name = 'Test Health Plan';
        if (null === ($payer = Payer::firstWhere('name', $name))) {
            $payer = Payer::factory()
                ->hasAddresses(1)
                ->hasPhones(1)
                ->hasLobs(5)
                ->create(['name' => $name])->first();
        }
        // add child payers
        if (!$payer->children()->exists()) {
            $payer->children()->saveMany(
                Payer::factory()->hasLobs(3)->hasAddresses(1)->hasPhones(1)->count(5)->create()
            );
        }
    }
}
