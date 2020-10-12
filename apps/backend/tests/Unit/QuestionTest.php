<?php

namespace Tests\Unit;

use App\Models\Assessment\Question;
use App\Models\Assessment\Valuelist\Listitem;
use App\Models\Assessment\Valuelist\Valuelist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class QuestionTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    private $question;

    /**
     * Test basic instance.
     *
     * @return void
     */
    public function testQuestion()
    {
        $this->assertInstanceOf(Question::class, $this->question);
    }

    /**
     * Test valuelist relationship.
     *
     * @return void
     */
    /*public function testAddValuelist()
    {
        $valuelist = factory(Valuelist::class)->create();
        $listitems = factory(Listitem::class, $number = $this->faker->randomDigitNot(0))->create();
        $valuelist->listitems()->saveMany($listitems);
        $this->question->valuelist()->associate($valuelist)->save();
        // verify valuelist associated as expected
        $this->assertInstanceOf(Valuelist::class, $this->question->valuelist);
        $this->assertEquals($number, $this->question->valuelist->listitems->count());
        $this->assertEquals($listitems->first()->id, $this->question->valuelist->listitems->first()->id);
        // inverse relationship
        $this->assertEquals($this->question->id, $this->question->valuelist->questions->first()->id);
    }*/

    protected function setUp(): void
    {
        parent::setUp();
        $this->question = Question::factory()->create();
    }
}
