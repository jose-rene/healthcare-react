<?php

namespace Tests\Unit;

use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Seeder will run without exception.
     *
     * @return void
     */
    public function testSeeder()
    {
        $seed = Artisan::call('db:seed');
        $this->assertEquals(0, $seed);
    }
}
