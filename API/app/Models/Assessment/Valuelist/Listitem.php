<?php

namespace App\Models\Assessment\Valuelist;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listitem extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * Relationship to valuelists.
     *
     * @return App\Models\Assessment\Valuelist
     */
    public function valuelist()
    {
        return $this->belongsTo(Valuelist::class)->withDefault();
    }

    /**
     * Create many list items from an array of data.
     *
     * @return Illuminate\Database\Eloquent\Collection of Listitem
     */
    public function createMany(array $data)
    {
        $listitems = [];
        foreach ($data as $item) {
            $listitems[] = $this->create($item);
        }

        return $this->newCollection($listitems);
    }
}
