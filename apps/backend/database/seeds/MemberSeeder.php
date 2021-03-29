<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Payer;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $payer = Payer::firstWhere(['name' => 'Test Health Plan']);
        if (Member::where('payer_id', $payer->id)->get()->count()) {
            return;
        }
        Member::factory(['payer_id' => $payer])->hasPhones(1)->hasAddresses(1)->count(1)->create();
    }
}
