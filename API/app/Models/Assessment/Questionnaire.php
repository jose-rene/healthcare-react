<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 */
class Questionnaire extends Model
{
    protected $guarded = [
        'id',
    ];

    /**
     * Relationship to sections.
     *
     * @return Illuminate\Database\Eloquent\Collection of Section
     */
    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    /**
     * Relationship to assessments.
     *
     * @return Illuminate\Database\Eloquent\Collection of Assessments
     */
    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    /**
     * Find questionnaire and return with relations populated.
     *
     * @param  int  $id
     * @return App\Models\Assessment\Questionnaire
     */
    public static function fetch($id)
    {
        // find with relations
        $questionnaire = Questionnaire::find($id)->with([
            'sections' => function ($query) {
                $query->with([
                    'childSections' => function ($query) {
                        $query->with(['questions' => function ($query) {
                            $query->with(['valuelist' => function ($query) {
                                $query->with('listitems');
                            }])->orderBy('listitem_id');
                        }, // @note this has to be added to get the questions for the nested children
                        'children' => function ($query) {
                            $query->with(['questions' => function ($query) {
                                $query->with(['valuelist' => function ($query) {
                                    $query->with('listitems');
                                }]);
                            }]);
                        },
                        ]);
                    },
                ]);
            }
        ])->orderBy('questionnaire_section_position', 'asc')->first();
        //dd($questionnaire->sections->offsetGet(2)->children->count());
        return $questionnaire;
    }
}
