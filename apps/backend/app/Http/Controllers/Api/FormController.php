<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormController extends Controller
{
    public function index(Request $request)
    {
        return Form::paginate($request->get('perPage', 50));
    }

    /**
     * Display the specified resource.
     *
     * @param Form $form
     * @return JsonResponse
     */
    public function show(Form $form)
    {
        return response()->json(compact('form'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Form    $form
     * @return JsonResponse
     */
    public function update(Request $request, Form $form)
    {
        $fields = $request->get('form', []);
        $form->update(compact('fields'));

        return response()->json(['message' => 'ok']);
    }

    public function store(Request $request)
    {
        Form::create(['fields' => []] + $request->all());

        return response()->noContent();
    }

    public function destroy(Form $form)
    {
        $form->delete();

        return response()->noContent();
    }
}
