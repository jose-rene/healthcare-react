<?php

namespace Tests\Unit;

use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase;

    private $assessment;

    /**
     * Test basic instance.
     *
     * @return void
     */
    public function testAssessment()
    {
        $this->assertInstanceOf(Assessment::class, $this->assessment);
        $this->assertInstanceOf(Questionnaire::class, $this->assessment->questionnaire);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->assessment = Assessment::factory()->create();
    }
}
