<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Assessment\Valuelist\Valuelist;
use App\Models\Assessment\Valuelist\Listitem;
use Illuminate\Database\Eloquent\Collection;

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
        $this->valuelist->listitems()->save($listitem = factory(Listitem::class)->create());
        $this->assertInstanceOf(Collection::class, $this->valuelist->listitems);
        $this->assertEquals($this->valuelist->listitems->first()->id, $listitem->id);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->valuelist = factory(Valuelist::class)->create();
    }
}
