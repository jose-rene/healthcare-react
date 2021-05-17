<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (null !== Language::firstWhere('name', 'English')) {
            return;
        }
        $languages = '["Arabic","Armenian","Cambodian","Cantonese","Chinese","English","French","German","Hmong","Italian","Japanese","Korean","Laotian","Mandarin","Polish","Portugese","Russian","Somalian","Spanish","Swahili","Tagalog","Vietnamese"]';
        foreach (json_decode($languages, true) as $name) {
            Language::create(['name' => $name]);
        }
    }
}
