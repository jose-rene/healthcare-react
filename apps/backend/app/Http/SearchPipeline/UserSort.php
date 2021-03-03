<?php


namespace App\Http\SearchPipeline;


use App\Models\User;
use Illuminate\Support\Str;

class UserSort extends BaseSearchPipeline
{

    protected function applyFilter($builder, $param)
    {
        //check for relationship
        $columnMap = explode('.', $param);

        if (count($columnMap) > 1 && $columnMap[0] == 'address') {
            $tableName = Str::plural($columnMap[0]);

            return $builder
                ->leftJoin($tableName, function($join) use ($tableName){
                    $join->on('users.id', "$tableName.addressable_id")
                        ->where("$tableName.addressable_type", User::class)
                        ->whereNull("$tableName.deleted_at");
                })
                ->orderBy("addresses.{$columnMap[1]}", request('sortDirection', 'desc'));
        }

        return $builder->orderBy($param, request('sortDirection', 'desc'));
    }
}
