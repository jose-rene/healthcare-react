<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Assessment\Section;
use App\Models\Assessment\Question;

class SectionTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    private $section;

    /**
     * Test basic instance.
     *
     * @return void
     */
    public function testSection()
    {
        $this->assertInstanceOf(Section::class, $this->section);
    }

    /**
     * Test association of questions and sections.
     *
     * @return void
     */
    public function testAttachQuestion()
    {
        $this->section->questions()->saveMany(
            $questions = factory(Question::class, $number = $this->faker->randomDigitNot(0))->make()
        );
        // verify the questions were associated
        $this->assertInstanceOf(Collection::class, $this->section->questions);
        $question = $this->section->questions->first();
        $this->assertEquals($questions->first()->id, $question->id);
        $this->assertEquals($number, $this->section->questions->count());
        // the inverse relationship
        $this->assertEquals($this->section->id, $question->section->first()->id);
    }

    /**
     * Test section parent child relationship.
     *
     * @return void
     */
    public function testParentChild()
    {
        // parent and child sections
        $sectionParent = $this->section;
        $sectionsChildren = factory(Section::class, $number = $this->faker->randomDigitNot(0))->create();
        // recursive child
        $child = $sectionsChildren->first();
        $sectionSubChild = factory(Section::class)->create();
        $child->children()->save($sectionSubChild);
        $this->assertInstanceOf(Collection::class, $child->children);
        $this->assertEquals(1, $child->children->count());
        // attach children to parent
        $sectionParent->children()->saveMany($sectionsChildren);
        $this->assertInstanceOf(Collection::class, $sectionParent->children);
        $this->assertEquals($number, $sectionParent->children->count());
        $childOne = $sectionParent->children->first();
        $this->assertInstanceOf(Section::class, $childOne);
        $this->assertEquals($child->id, $childOne->id);
        // test recurrsion, get all children recursively
        $children = $sectionParent->childSections()->get();
        $this->assertInstanceOf(Collection::class, $children);
        // test that the child child exists in first element of collection
        $this->assertEquals(1, $children->first()->children->count());
        // verify the subchild
        $this->assertEquals($sectionSubChild->id, $children->first()->children->first()->id);
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->section = factory(Section::class)->create();
    }
}
