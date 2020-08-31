<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Assessment\Answer;
use App\Models\Assessment\Question;
use App\Models\Assessment\Valuelist\Listitem;

class AnswerTest extends TestCase
{
    use RefreshDatabase;

    private $answer;

    /**
     * Test basic instance.
     *
     * @return void
     */
    public function testAnswer()
    {
        $this->assertInstanceOf(Answer::class, $this->answer);
    }

    /**
     * Test question relationship
     *
     * @return void
     */
    public function testQuestion()
    {
        $this->assertInstanceOf(Question::class, $this->answer->question);
    }

    /**
     * Test valuelist relationship
     *
     * @return void
     */
    public function testValuelist()
    {
        $this->answer->listitem()->associate($listitem = factory(Listitem::class)->create())->save();
        $this->assertInstanceOf(Listitem::class, $this->answer->listitem);
        $this->assertEquals($listitem->val, $this->answer->listitem->val);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->answer = factory(Answer::class)->create();
    }
}
