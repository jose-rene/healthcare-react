<?php

namespace Database\Seeders;

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
        $name = 'Test Health Plan';
        Payer::firstOrCreate(['name' => $name], [
            'name' => $name,
        ]);
    }
}
