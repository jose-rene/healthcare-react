<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment\Section;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $data = Section::paginate($request->get('perPage', 50));

        return response()->json(compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $section = Section::create($request->validate([
            // TODO :: validation here
        ]));

        return response()->json(compact('section'));
    }

    /**
     * Display the specified resource.
     *
     * @param  Section  $section
     * @return JsonResponse
     */
    public function show(Section $section)
    {
        return response()->json(compact('section'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  Section  $section
     * @return JsonResponse
     */
    public function update(Request $request, Section $section)
    {
        $section->update($request->validate([
            // TODO :: validation here
        ]));

        return response()->json(['message' => 'ok']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Section  $section
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Section $section)
    {
        $section->delete();

        return response()->json(['message' => 'ok']);
    }
}
