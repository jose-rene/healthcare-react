<?php

namespace Database\Seeders;

use App\Models\MemberNumberType;
use App\Models\Payer;
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
        $memberNumberTypes = MemberNumberType::all()->pluck('id')->toArray();
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
        // member number types
        $payer->memberNumberTypes()->sync($memberNumberTypes);
    }
}
