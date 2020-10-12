<?php

namespace Tests\Unit;

use App\Models\Assessment\Valuelist\Listitem;
use App\Models\Assessment\Valuelist\Valuelist;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ValuelistTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test valuelist construction.
     *
     * @return void
     */
    public function testValuelist()
    {
        $this->assertInstanceOf(Valuelist::class, $this->valuelist);
    }

    /**
     * Test attach list items.
     *
     * @return void
     */
    public function testAttachItems()
    {
        $this->valuelist->listitems()->save($listitem = Listitem::factory()->create());
        $this->assertInstanceOf(Collection::class, $this->valuelist->listitems);
        $this->assertEquals($this->valuelist->listitems->first()->id, $listitem->id);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->valuelist = Valuelist::factory()->create();
    }
}
