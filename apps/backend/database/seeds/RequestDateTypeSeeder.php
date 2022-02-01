<?php

namespace Database\Seeders;

use App\Models\RequestDateType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RequestDateTypeSeeder extends Seeder
{
    protected $types = [
        'Received',
        'Assigned',
        'Scheduled',
        'Assessed',
        'Submitted',
        'Completed',
        'On Hold',
        'Cancelled',
        'Reopened',
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->types as $name) {
            RequestDateType::firstOrCreate(['slug' => $slug = Str::snake($name)], ['name' => $name]);
        }
    }
}
