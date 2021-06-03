<?php

namespace Database\Seeders;

use App\Models\Payer;
use Illuminate\Database\Seeder;

class TestPayerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $count = 1;
        // prompt for the number of payers if not unit test env
        if ('testing' !== app()->environment()) {
            $count = (int) $this->command->ask('How many test payers would you like to seed?');
        }

        // create the payers
        $payers = Payer::factory()
            ->hasPhones(1, ['is_primary' => true])
            ->hasAddresses(1, ['is_primary' => true])
            ->hasLobs(rand(2, 5))
            ->count($count)
            ->create();

        // add child payers to 30% of the payers
        $payers->each(function ($payer) {
            if (mt_rand(0, 99) > 69) {
                $payer->children()->saveMany(
                    Payer::factory()->hasLobs(rand(2, 5))->count(rand(2, 5))->create()
                );
            }
        });
    }
}
