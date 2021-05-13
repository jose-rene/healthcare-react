<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param Request $request
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $data = User::paginate($request->get('perPage', 50));

        return UserResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UserRequest $request
     * @return UserResource
     */
    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());

        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return UserResource
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserRequest $request
     * @param User        $user
     * @return UserResource
     */
    public function update(UserRequest $request, User $user)
    {
        $user->update($request->validated());

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'ok']);
    }
}
