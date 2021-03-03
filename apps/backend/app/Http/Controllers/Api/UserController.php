<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\MyUserResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Phone;
use App\Models\User;
use Bouncer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
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
        return response()->json(['message' => 'Not a valid endpoint.'], 422);
    }

    /**
     * Search users.
     *
     * @param UserRequest $request
     * @return AnonymousResourceCollection
     *
     * @OA\Post(
     *      path="/user/search",
     *      operationId="createUser",
     *      tags={"user"},
     *      summary="Search existing users",
     *      description="Returns array of users matching search criteria.",
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
    public function search(Request $request)
    {
        // @todo may use a formrequest for this eventually
        $user = auth()->user();
        if ($user->cannot('viewAny', User::class)) {
            return response()->json(['message' => 'You do not have permissions for the requested resource.'], 403);
        }

        $users = User::searchAllUsers()->paginate(request('perPage', 50));

        return UserResource::collection($users);
    }

    public function availableRoles(Request $request)
    {
        $user = auth()->user();
        // @todo check if this can be mapped to the create policy like the create route is
        if ($user->cannot('create', User::class)) {
            return response()->json(['message' => 'You do not have permissions for the requested resource.'], 403);
        }

        if ($user->can('apply-any-role')) {
            return RoleResource::collection(Bouncer::role()->orderBy('name')->get());
        }

        $primaryRole = $user->roles->firstWhere('name', $user->primary_role);

        return RoleResource::collection(Bouncer::role()->where(['domain' => $primaryRole->domain])->orderBy('name')->get());
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
            'first_name'   => $data['first_name'],
            'last_name'    => $data['last_name'],
            'email'        => $data['email'],
            'password'     => Hash::make($data['password']),
            'primary_role' => $data['primary_role'],
            'user_type'    => $request['user_type'], // this is set in passed validation, never passed in request
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

        // add the primary role
        $user->assign($data['primary_role']);
        // sync the user type, creates user type relation if null
        $userType = $user->syncUserType();
        // @todo, support passing company id so admins can add health plan users
        if ('HealthPlanUser' === $user->user_type_name && 'HealthPlanUser' === auth()->user()->user_type_name) {
            // at this point only a health plan will be adding so get company from hp manager use
            $payer = auth()->user()->healthplanUser->payer->first();
            // set company relationship in user type
            $userType->payer()->associate($payer)->save();
        }
        $user->save();

        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     *
     * @param User
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

    public function profileSave(Request $request)
    {
        $user = $request->user();
        // allow user to only update their own profile
        if ($user->cannot('view', $user)) {
            return response()->json(['message' => 'You do not have permissions for the requested resource.'], 403);
        }

        $data = $request->except('password', 'roles', 'user_type');
        // validate the primary role
        $role = Bouncer::role()->firstWhere(['name' => $data['primary_role']]);
        if (empty($role) || !$user->roles->contains('name', $data['primary_role'])) {
            return response()->json(['message' => 'Invalid primary role.'], 422);
        }
        // change the user type if applicable
        if ($user->user_type_domain !== $role->domain) {
            // change the user type
            $data['user_type'] = User::mapTypeForDomain($role->domain);
        }

        $user->update($data);

        return new MyUserResource($user);
    }
}
