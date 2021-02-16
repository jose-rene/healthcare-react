<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\MyUserResource;
use App\Http\Resources\UserResource;
use App\Models\Phone;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Create the controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // uses App\Policies\UserPolicy
        $this->authorizeResource(User::class, 'user');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UserRequest $request
     * @return Response
     *
     * @OA\Post(
     *      path="/user",
     *      operationId="createUser",
     *      tags={"user"},
     *      summary="Create new user",
     *      description="Returns created user object.",
     *      @OA\RequestBody(
     *        required=true,
     *        description="User creation schema.",
     *        @OA\JsonContent(
     *          required={"email","password","first_name","last_name"},
     *          @OA\Property(property="email", type="string", format="email", example="user1@mail.com"),
     *          @OA\Property(property="password", type="string", format="password", example="PassWord!123"),
     *          @OA\Property(property="first_name", type="string", format="string", example="Peter"),
     *          @OA\Property(property="last_name", type="string", format="string", example="Griffin"),
     *          @OA\Property(property="phone", type="string", format="string", example="555-555-5555"),
     *        ),
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *            ref="#/components/schemas/UserResource"
     *          ),
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Validation Error"
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */
    public function store(UserRequest $request)
    {
        // the validation is already ran due to the magic of service binding, this is just retrieving the data
        $data = $request->validated();
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
        ]);
        // add the phone number
        if (!empty($data['phone'])) {
            $phone = Phone::make([
                'number'     => $data['phone'],
                'is_primary' => 1,
            ]);
            $user->phones()->save($phone);
        }

        // send validation email if requested in form
        if (!empty($data['send_verification'])) {
            $user->sendEmailVerificationNotification();
        } else {
            $user->markEmailAsVerified();
        }
        $user->save();

        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User
     * @return Response
     *
     * @OA\Get(
     *      path="/user/{id}",
     *      operationId="retrieveUser",
     *      tags={"user"},
     *      summary="Retrieve user",
     *      description="Retrieve existing user.",
     *      @OA\Parameter(
     *          name="id",
     *          description="user id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="uuid"),
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *            ref="#/components/schemas/UserResource"
     *          ),
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Not Found"
     *      ),
     * )
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserRequest $request
     * @param  int    $id
     * @return Response
     *
     * @OA\Put(
     *      path="/user/{id}",
     *      operationId="updateUser",
     *      tags={"user"},
     *      summary="Update existing user",
     *      description="Returns updated user object.",
     *      @OA\Parameter(
     *          name="id",
     *          description="user id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="uuid"),
     *      ),
     *      @OA\RequestBody(
     *        required=true,
     *        description="User update schema.",
     *        @OA\JsonContent(
     *          required={"first_name","last_name"},
     *          @OA\Property(property="first_name", type="string", format="string", example="Peter"),
     *          @OA\Property(property="last_name", type="string", format="string", example="Griffin"),
     *          @OA\Property(property="phone", type="string", format="string", example="555-555-5555"),
     *        ),
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserResource"),
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Validation Error"
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */
    public function update(UserRequest $request, User $user)
    {
        $data = $request->validated();
        foreach ($data as $name => $value) {
            $user->{$name} = $value;
        }
        $user->save();

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     *
     * @OA\Delete(
     *      path="/user/{id}",
     *      operationId="deleteUser",
     *      tags={"user"},
     *      summary="Delete existing user",
     *      description="Removes the specified user.",
     *      @OA\Parameter(
     *          name="id",
     *          description="user id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="uuid"),
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Not Found"
     *      ),
     * )
     */
    public function destroy(User $user)
    {
        $email = $user->email;
        $user->delete();

        return response()->json(['message' => sprintf('Account [%s] deleted', $email)]);
    }

    /**
     * logged in user information.
     * @param Request $request
     * @return MyUserResource
     */
    public function profile(Request $request): MyUserResource
    {
        return new MyUserResource($request->user());
    }
}
