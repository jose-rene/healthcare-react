<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Tags\Tag;

class MediaTagSeeder extends Seeder
{
    protected $tags = [
        'Front Door',
        'Rear Door',
        'Garage Door',
        'Bathroom Entry',
        'Kitchen Entry',
        'Bedroom Entry',
        'Equipment',
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->tags as $tag) {
            Tag::findOrCreate($tag, 'media');
        }
    }
}
