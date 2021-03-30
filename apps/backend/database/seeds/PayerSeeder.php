<?php

namespace Database\Seeders;

use App\Models\Lob;
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
        $payer = Payer::firstOrCreate(['name' => $name], [
            'name' => $name,
        ]);
        $payer->lobs()->sync(Lob::factory()->count(5)->create()->map(fn ($item) => $item->id)->toArray());
    }
}
