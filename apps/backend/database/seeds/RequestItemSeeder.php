<?php

namespace Database\Seeders;

use App\Models\RequestItem;
use Illuminate\Database\Seeder;

class RequestItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /** @var RequestItem $item */
        $item = RequestItem::firstOrCreate([
            'name' => 'Manual Wheelchair(Heavy duty)',
        ]);

        if ($item->itemDetails()->count() === 0) {
            $itemDetails = [
                'Tilt-In-Space',
                'Recline',
                'Barbaric Cushion',
            ];
            foreach ($itemDetails as $name) {
                $item->itemDetails()->create(compact('name'));
            }
        }
    }
}
