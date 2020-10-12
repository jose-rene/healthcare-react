<?php

namespace Tests\Unit;

use App\Models\Assessment\Questionnaire;
use App\Models\Assessment\Section;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class QuestionnaireTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    private $questionnaire;

    /**
     * Test basic instance.
     *
     * @return void
     */
    public function testQuestionnaire()
    {
        $this->assertInstanceOf(Questionnaire::class, $this->questionnaire);
    }

    /**
     * Test association of questionnaires and sections.
     *
     * @return void
     */
    public function testAttachSection()
    {
        $this->questionnaire->sections()->saveMany(
            $sections = Section::factory($number = $this->faker->randomDigitNot(0))->make()
        );
        // verify the sections were associated
        $this->assertInstanceOf(Collection::class, $this->questionnaire->sections);
        $section = $this->questionnaire->sections->first();
        $this->assertEquals($sections->first()->id, $section->id);
        $this->assertEquals($number, $this->questionnaire->sections->count());
        // the inverse relationship
        $this->assertEquals($this->questionnaire->id, $section->questionnaire->first()->id);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->questionnaire = Questionnaire::factory()->create();
    }
}
