<?php

use Illuminate\Database\Seeder;
use App\Models\Assessment\Questionnaire;
use App\Models\Assessment\Question;
use App\Models\Assessment\Section;
use App\Models\Assessment\Valuelist\Valuelist;
use Facades\App\Models\Assessment\Valuelist\Listitem as ListitemFacade;

class PcaSeeder extends Seeder
{
    protected $valuelists = [];

    /**
     * Run the PCA questionnaire seeds.
     *
     * @return void
     */
    public function run()
    {
        // create common question definitions with basic properties, name and title, used in assessment
        $questions = $this->createQuestions();
        // create value lists for questions
        $this->createValueLists();
        // group common questions in an array with contexual properties
        $common = [
            'comments' => ['props' => array_merge($questions['comments'], ['position' => 1, 'required' => true, 'ele_type' => 'textarea'])],
            'functional' => [
                'props' => array_merge($questions['functional'], ['position' => 2, 'required' => true, 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
            'days_per_week' => ['props' => array_merge($questions['days_per_week'], ['position' => 3, 'required' => true, 'ele_type' => 'select'])],
            'considerations' => ['props' => array_merge($questions['considerations'], ['position' => 4, 'ele_type' => 'textarea'])],
            'dme_functional' => [
                'props' => array_merge($questions['dme_functional'], ['position' => 5, 'dependencies' => ['required' => ['considerations' => []]], 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
        ];
        // these are used often too, sames as above with times per day
        $commonWithTimes = [
            'comments' => ['props' => array_merge($questions['comments'], ['position' => 1, 'required' => true, 'ele_type' => 'textarea'])],
            'functional' => [
                'props' => array_merge($questions['functional'], ['position' => 2, 'required' => true, 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
            'days_per_week' => ['props' => array_merge($questions['days_per_week'], ['position' => 3, 'required' => true, 'ele_type' => 'select'])],
            'times_per_day' => ['props' => array_merge($questions['times_per_day'], ['position' => 4, 'required' => true, 'ele_type' => 'select'])],
            'considerations' => ['props' => array_merge($questions['considerations'], ['position' => 5, 'ele_type' => 'textarea'])],
            'dme_functional' => [
                'props' => array_merge($questions['dme_functional'], ['position' => 6, 'dependencies' => ['required' => ['considerations' => []]], 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
        ];
        // just comments
        $comments = [
            'comments' => ['props' => array_merge($questions['comments'], ['position' => 1, 'required' => true, 'ele_type' => 'textarea'])],
        ];
        // this is used a few times no days per week
        $commonNoDays = [
            'comments' => ['props' => array_merge($questions['comments'], ['position' => 1, 'required' => true, 'ele_type' => 'textarea'])],
            'functional' => [
                'props' => array_merge($questions['functional'], ['position' => 2, 'required' => true, 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
            'considerations' => ['props' => array_merge($questions['considerations'], ['position' => 3, 'ele_type' => 'textarea'])],
            'dme_functional' => [
                'props' => array_merge($questions['dme_functional'], ['position' => 4, 'dependencies' => ['required' => ['considerations' => []]], 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
        ];

        // create basic sections
        $sections = ['basic' => $this->createBasicSections()];
        // associate questions with sections
        $sections['basic']['bathing']->questions()->saveMany($this->toQuestion($common));
        $sections['basic']['personal_hygiene']->questions()->saveMany($this->toQuestion($common));
        $sections['basic']['dressing_upper_body']->questions()->saveMany($this->toQuestion($common));
        $sections['basic']['dressing_lower_body']->questions()->saveMany($this->toQuestion($common));
        // questions for walking section for n/a field to be added
        $walkingQuestions = [
            // logic for question type is handled by dependency field in other questions
            'na' => ['props' =>
                ['name' => 'na', 'title' => 'N/A', 'position' => 0, 'required' => false, 'ele_type' => 'checkbox', 'question_type' => 'section_control'],
            ],
            'comments' => ['props' => array_merge($questions['comments'], [
                'position' => 1,
                'required' => true,
                'dependencies' => ['disabled' => ['na' => 1]],
                'ele_type' => 'textarea'])
            ],
            'functional' => [
                'props' => array_merge($questions['functional'], ['position' => 2, 'required' => true, 'dependencies' => ['disabled' => ['na' => 1]], 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
            'days_per_week' => ['props' => array_merge($questions['days_per_week'], ['position' => 3, 'required' => true, 'dependencies' => ['disabled' => ['na' => 1]], 'ele_type' => 'select'])],
            'times_per_day' => ['props' => array_merge($questions['times_per_day'], ['position' => 4, 'required' => true, 'dependencies' => ['disabled' => ['na' => 1]], 'ele_type' => 'select'])],
            'considerations' => ['props' => array_merge($questions['considerations'], ['position' => 5, 'dependencies' => ['disabled' => ['na' => 1]], 'ele_type' => 'textarea'])],
            'dme_functional' => [
                'props' => array_merge($questions['dme_functional'], [
                    'position' => 6,
                    'dependencies' => [
                        'disabled' => ['na' => 1],
                        // @note empty array indicates any value would cause this to be required
                        'required' => ['considerations' => []]
                    ],
                    'ele_type' => 'select',
                ]),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
        ];
        $sections['basic']['walking']->questions()->saveMany($this->toQuestion($walkingQuestions));
        $sections['basic']['personal_mobility']->questions()->saveMany($this->toQuestion($common));
        $sections['basic']['toliet_transfer']->questions()->saveMany($this->toQuestion($commonWithTimes));
        $sections['basic']['toliet_use']->questions()->saveMany($this->toQuestion($commonWithTimes));
        $sections['basic']['bed_mobility']->questions()->saveMany($this->toQuestion($commonWithTimes));
        $sections['basic']['eating']->questions()->saveMany($this->toQuestion($commonWithTimes));
        // exercise questions and valuelists
        $exerciseQuestions = [
            'prescribed_program' => Question::create([
                'name' => 'prescribed_program',
                'title' => 'Is there a physician/therapist prescribed program?',
                'position' => 1,
                'ele_type' => 'select',
            ]),
            'require_assistance' => Question::create([
            'name' => 'require_assistance',
                'title' => 'If yes, does person require assistance to perform the program?',
                'position' => 2,
                'ele_type' => 'select',
                'dependencies' => json_encode(['visible' => ['prescribed_program' => 'Yes']])
            ]),
        ];
        // associate values lists
        $exerciseQuestions['prescribed_program']->valuelist()->associate($this->valuelists['yes_no'])->save();
        $exerciseQuestions['require_assistance']->valuelist()->associate($this->valuelists['yes_no'])->save();
        $sections['basic']['exercise']->questions()->saveMany($exerciseQuestions);

        // create instrumental sections
        $sections['instrumental'] = $this->createInstrumentalSections();
        // populate the questions to instrumental sections
        $sections['instrumental']['meal_preperation']->questions()->saveMany($this->toQuestion($commonWithTimes));
        $sections['instrumental']['housework_cleaning']->questions()->saveMany($this->toQuestion($common));
        $sections['instrumental']['finances']->questions()->saveMany($this->toQuestion($commonNoDays));
        $sections['instrumental']['medication']->questions()->saveMany($this->toQuestion($common));
        $sections['instrumental']['phone']->questions()->saveMany($this->toQuestion($commonNoDays));
        $sections['instrumental']['stairs']->questions()->saveMany($this->toQuestion($common));
        $sections['instrumental']['shopping']->questions()->saveMany($this->toQuestion($common));
        $sections['instrumental']['transportation']->questions()->saveMany($this->toQuestion($common));
        $sections['instrumental']['supervision']->questions()->saveMany($this->toQuestion($comments));
        // single use laundry question set
        $laundryQuestions = [
            'comments' => ['props' => array_merge($questions['comments'], ['position' => 1, 'required' => true, 'ele_type' => 'textarea'])],
            'washer_dryer' => [
                'props' => [
                    'name' => 'washer_dryer',
                    'title' => 'Washer and/or dryer in the home?',
                    'position' => 2,
                    'ele_type' => 'select',
                ],
                'valuelist' => $this->valuelists['yes_no'],
            ],
            'functional' => [
                'props' => array_merge($questions['functional'], ['position' => 3, 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
            'loads_per_week' => [
                'props' => [
                    'name' => 'loads_per_week',
                    'title' => 'Number of loads per week',
                    'position' => 4,
                    'ele_type' => 'select',
                ],
                'valuelist' => $this->valuelists['loads_per_week'],
            ],
            'considerations' => ['props' => array_merge($questions['considerations'], ['position' => 5, 'ele_type' => 'textarea'])],
            'dme_functional' => [
                'props' => array_merge($questions['dme_functional'], ['position' => 6, 'ele_type' => 'select']),
                'valuelist' => $this->valuelists['functional_scores'],
            ],
        ];
        // attach questions to laundry section
        $sections['instrumental']['housework_laundry']->questions()->saveMany($this->toQuestion($laundryQuestions));
        // create summary section, just one section
        $sections['summary'] = [
                'summary' => Section::create([
                'name' => 'summary',
                'title' => 'ASSESSMENT SUMMARY',
                'position' => 1,
            ]),
        ];
        $sections['summary']['summary']->questions()->saveMany($this->toQuestion($comments));
        // generate the main sections with the sub sections
        $main = $this->createMainSections($sections);
        // dd($main);
        // finally create the questionnaire
        $questionnaire = Questionnaire::create(['title' => 'PCA Assessment']);
        // attach the main sections
        $questionnaire->sections()->saveMany($main);
        // dd($questionnaire->sections->toJson());
    }

    /**
     * Create the common questions used througout the assessment.
     *
     * @return array of App\Question
     */
    protected function createQuestions()
    {
        $questions = collect([
            'na' => [
                'name' => 'na',
                'title' => 'N/A',
            ],
            'functional' => [
                'name' => 'functional',
                'title' => 'ADL Functional Level Score',
            ],
            'comments' => [
                'name' => 'comments',
                'title' => 'Comments',
            ],
            'dme_functional' => [
                'name' => 'dme_functional',
                'title' => 'DME ADL Functional Level Score'
            ],
            'considerations' => [
                'name' => 'considerations',
                'title' => 'Considerations',
            ],
            'days_per_week' => [
                'name' => 'days_per_week',
                'title' => 'Number days a week',
            ],
            'times_per_day' => [
                'name' => 'times_per_day',
                'title' => 'Number times a day',
            ],
        ]);

        return $questions;
    }

    /**
    * Create value lists used in this assessment.
    *
    * @return array of App\Valuelist
    */
    protected function createValueLists()
    {
        // create the function scores value list
        $this->valuelists['functional_scores'] = Valuelist::create([
            'title' => 'ADL Functional Level Scores',
        ]);
        $values = [
            ['val' => '0', 'title' => 'Choose one'],
            ['val' => '1', 'title' => '1 Independent, Setup Help Only'],
            ['val' => '2', 'title' => '2 Supervision – Oversight / Cueing'],
            ['val' => '3', 'title' => '3 Min Assist – performs most of the task'],
            ['val' => '4', 'title' => '4 Mod Assist – performs 50% or more of task'],
            ['val' => '5', 'title' => '5 Max Assist – performs less than 50% of task'],
            ['val' => '6', 'title' => '6 Total Dependence'],
            ['val' => '-1', 'title' => 'Activity does not occur'],
        ];
        // create listitem collection
        $items = ['scores' => ListitemFacade::createMany($values)];
        $this->valuelists['functional_scores']->listitems()->saveMany($items['scores']);
        // create the yes / no value list
        $this->valuelists['yes_no'] = Valuelist::create([
            'title' => 'Yes / No',
        ]);
        $values = [
            ['val' => '', 'title' => 'Select'],
            ['val' => 'Yes', 'title' => 'Yes'],
            ['val' => 'No', 'title' => 'No'],
        ];
        $items['yes_no'] = ListitemFacade::createMany($values);
        $this->valuelists['yes_no']->listitems()->saveMany($items['yes_no']);
        // days per week value list
        $this->valuelists['days_per_week'] = Valuelist::create([
            'title' => 'Days per Week',
        ]);
        $values = [
            ['val' => '', 'title' => 'Choose One'],
        ];
        $values = $this->addValueNumbers($values, 0, 7);
        $items['days_per_week'] = ListitemFacade::createMany($values);
        $this->valuelists['days_per_week']->listitems()->saveMany($items['days_per_week']);
        // one time laundry loads per week list
        $this->valuelists['loads_per_week'] = Valuelist::create([
            'title' => 'Loads per Week',
        ]);
        $values = [
            ['val' => '', 'title' => 'Choose One'],
        ];
        $values = $this->addValueNumbers($values, 0, 5);
        $items['loads_per_week'] = ListitemFacade::createMany($values);
        $this->valuelists['loads_per_week']->listitems()->saveMany($items['loads_per_week']);
    }

    /**
     * Generate variable times per day list on demand.
     *
     * @return App\Valuelist
     */
    protected function timesPerDayList($min, $max)
    {
        // check if the value list already exists
        $key = 'times_per_day_' . $min . '_' . $max;
        if (!empty($this->valuelists[$key])) {
            return $this->valuelists[$key];
        }
        // create the new valuelist if it does not exist
        $this->valuelists[$key] = Valuelist::create([
            'title' => 'Times per Day (' . $min . ' - ' . $max . ')',
        ]);
        $values = [
            ['val' => '', 'title' => 'Choose One'],
        ];
        $values = $this->addValueNumbers($values, $min, $max);
        $items = ListitemFacade::createMany($values);
        $this->valuelists[$key]->listitems()->saveMany($items['days_per_week']);
        return $this->valuelists[$key];
    }

    /**
     * Create the basic section sections.
     *
     * @return array of Section
     */
    protected function createBasicSections()
    {
        $sections = [
            'bathing' => Section::create([
                'name' => 'bathing',
                'title' => '1. BATHING',
                'position' => 1,
            ]),
            'personal_hygiene' => Section::create([
                'name' => 'personal_hygiene',
                'title' => '2. PERSONAL HYGIENE',
                'position' => 2,
            ]),
            'dressing_upper_body' => Section::create([
                'name' => 'dressing_upper_body',
                'title' => '3. DRESSING UPPER BODY',
                'position' => 3,
            ]),
            'dressing_lower_body' => Section::create([
                'name' => 'dressing_lower_body',
                'title' => '4. DRESSING LOWER BODY',
                'position' => 4,
            ]),
            'walking' => Section::create([
                'name' => 'walking',
                'title' => '5. WALKING',
                'position' => 5,
            ]),
            'personal_mobility' => Section::create([
                'name' => 'personal_mobility',
                'title' => '6. PERSONAL MOBILITY',
                'position' => 6,
            ]),
            'exercise' => Section::create([
                'name' => 'exercise',
                'title' => '7. EXERCISE',
                'position' => 7,
            ]),
            'toliet_transfer' => Section::create([
                'name' => 'toliet_transfer',
                'title' => '8. TOILET TRANSFER',
                'position' => 8,
            ]),
            'toliet_use' => Section::create([
                'name' => 'toliet_use',
                'title' => '9. TOILET USE',
                'position' => 9,
            ]),
            'bed_mobility' => Section::create([
                'name' => 'bed_mobility',
                'title' => '10. BED MOBILITY AND TRANSFERS',
                'position' => 10,
            ]),
            'eating' => Section::create([
                'name' => 'toliet_transfer',
                'title' => '11. EATING',
                'position' => 11,
            ]),
        ];
        return $sections;
    }

    /**
     * Create the instrumental section sections.
     *
     * @return array of Section
     */
    protected function createInstrumentalSections()
    {
        $sections = [
            'meal_preperation' => Section::create([
                'name' => 'meal_preperation',
                'title' => '12. MEAL PREPARATION',
                'position' => 1,
            ]),
            'housework_cleaning' => Section::create([
                'name' => 'housework_cleaning',
                'title' => '13. ORDINARY HOUSEWORK - CLEANING',
                'position' => 2,
            ]),
            'housework_laundry' => Section::create([
                'name' => 'housework_laundry',
                'title' => '14. ORDINARY HOUSEWORK - LAUNDRY',
                'position' => 3,
            ]),
            'finances' => Section::create([
                'name' => 'finances',
                'title' => '15. MANAGING FINANCES',
                'position' => 4,
            ]),
            'medication' => Section::create([
                'name' => 'medication',
                'title' => '16. MEDICATION MANAGEMENT',
                'position' => 4,
            ]),
            'phone' => Section::create([
                'name' => 'phone',
                'title' => '17. PHONE USE',
                'position' => 5,
            ]),
            'stairs' => Section::create([
                'name' => 'stairs',
                'title' => '18. STAIRS',
                'position' => 6,
            ]),
            'shopping' => Section::create([
                'name' => 'shopping',
                'title' => '19. SHOPPING',
                'position' => 7,
            ]),
            'transportation' => Section::create([
                'name' => 'transportation',
                'title' => '20. TRANSPORTATION',
                'position' => 8,
            ]),
            'supervision' => Section::create([
                'name' => 'supervision',
                'title' => '21. SUPERVISION',
                'position' => 9,
            ]),
        ];
        return $sections;
    }

    /**
     * Create the main assessment sections and add child section.
     *
     * @param $sections array of Section
     *
     * @return array of Section
     */
    protected function createMainSections(array $sections)
    {
        $main = [
            'summary' => Section::create([
                'name' => 'summary',
                'title' => 'ASSESSMENT SUMMARY',
                'position' => 1,
            ]),
            'basic_activities' => Section::create([
                'name' => 'basic_activities',
                'title' => 'Part: 1. BASIC ACTIVITIES OF DAILY LIVING',
                'position' => 2,
            ]),
            'instrumental_activities' => Section::create([
                'name' => 'instrumental_activities',
                'title' => 'Part: 2. INSTRUMENTAL ACTIVITIES OF DAILY LIVING',
                'position' => 3,
            ]),
        ];
        $main['basic_activities']->children()->saveMany($sections['basic']);
        $main['summary']->children()->saveMany($sections['summary']);
        $main['instrumental_activities']->children()->saveMany($sections['instrumental']);
        
        return $main;
    }

    /**
     * Map question definitions to Question objects.
     *
     * @return object Question
     */
    protected function toQuestion(array $defs)
    {
        return collect(
            array_map(function ($item) {
                if (!isset($item['props'])) {
                    dd($item);
                    throw new \RuntimeException('Question definitions must have properties');
                }
                $question = App\Models\Assessment\Question::create($item['props']);
                if (isset($item['valuelist']) && $item['valuelist'] instanceof Valuelist) {
                    $question->valuelist()->associate($item['valuelist'])->save();
                }
                return $question;
            }, $defs)
        );
    }

    /**
     * Append a sequence of numbers to a listitem array.
     *
     * @return array of listitem parameters
     */
    protected function addValueNumbers($values, $start, $stop)
    {
        for ($xx = $start; $xx<=$stop; $xx++) {
            $values[] = ['val' => $xx, 'title' => $xx,];
        }
        return $values;
    }
}
