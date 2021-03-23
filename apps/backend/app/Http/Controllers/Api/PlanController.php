<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Faker\Factory as Faker;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Fetch plans for this company.
     *
     * @return \Illuminate\Http\Response
     */
    public function plans()
    {
        // @todo, use real plans
        $faker = Faker::create();
        $json = [];
        for ($xx = 0; $xx < 5; $xx++) {
            $json[] = ['id' => $faker->uuid, 'plan' => $faker->company];
        }

        return response()->json($json);
    }

    /**
     * Fetch lobs for this company.
     *
     * @return \Illuminate\Http\Response
     */
    public function lobs()
    {
        // @todo, use real lobs
        $faker = Faker::create();
        $json = [];
        for ($xx = 0; $xx < 5; $xx++) {
            $json[] = ['id' => $faker->uuid, 'plan' => $faker->catchPhrase];
        }

        return response()->json($json);
    }

    /**
     * Retrieve member id types.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function idtypes(Request $request)
    {
        // @todo connect this to member id type tables
        $faker = Faker::create();
        $types = [
            ['id' => $faker->uuid, 'name' => 'cin_number', 'title' => 'CIN#'],
            ['id' => $faker->uuid, 'name' => 'member_id', 'title' => 'Member ID'],
        ];

        return response()->json($types);
    }
}
