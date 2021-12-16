<?php


namespace App\Http\SearchPipeline;

class Sort extends BaseSearchPipeline
{
    protected function applyFilter($builder, $param)
    {
        //check for relationship
        $columnMap     = explode('.', $param);
        $sortDirection = request('sortDirection', 'desc');

        if (count($columnMap) > 1) {
            $mainModel     = $builder->getModel();
            $mainModalName = $mainModel::class;
            $mainTableName = $mainModel->getTable();
            switch ($columnMap[0]) {
                case 'address':
                    return $builder
                        ->leftJoin('addresses', function ($join) use ($mainTableName, $mainModalName) {
                            $join->on("$mainTableName.id", "addresses.addressable_id")
                                ->where("addresses.addressable_type", $mainModalName)
                                ->whereNull("addresses.deleted_at");
                        })
                        ->orderBy("addresses.{$columnMap[1]}", $sortDirection);
                break;

                case 'member':
                    $column = 'name' === $columnMap[1] ? 'last_name' : $columnMap[1];

                    return $builder
                        ->join('members', 'requests.member_id', '=', 'members.id')
                        ->orderBy("members.{$column}", $sortDirection);
                break;

                case 'payer':
                    $column = 'company_name' === $columnMap[1] ? 'name' : $columnMap[1];

                    return $builder
                        ->join('payers', 'requests.payer_id', '=', 'payers.id')
                        ->orderBy("payers.{$column}", $sortDirection);
                break;

                default:
                    return null;
                break;
            }
        }

        return $builder->orderBy($param, $sortDirection);
    }
}
