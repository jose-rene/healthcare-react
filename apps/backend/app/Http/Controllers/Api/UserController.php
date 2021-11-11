<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\ImageResource;
use App\Http\Resources\MyUserResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Jobs\PasswordExpireCheckJob;
use App\Jobs\UserCreationJob;
use App\Models\User;
use Bouncer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

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

        $users = User::searchAllUsers($user)->paginate(request('perPage', 50));

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
        // user type is set in passed validation, never passed in request
        $data['user_type'] = $request['user_type'];
        $userJob = new UserCreationJob($data);
        dispatch($userJob);

        return new UserResource($userJob->getUser());
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
        // @todo move this logic to a service
        if ($user->first_name !== $data['first_name']) {
            $user->first_name = $data['first_name'];
        }
        if ($user->last_name !== $data['last_name']) {
            $user->last_name = $data['last_name'];
        }
        if (isset($data['email']) && $user->email !== $data['email']) {
            $user->email = $data['email'];
        }
        // add the phone number
        // var_dump($data['phone'], $user->phones->firstWhere(['is_primary' => 1]));
        if (!empty($data['phone'])) {
            if (null !== ($phone = $user->phones->firstWhere('is_primary', 1))) {
                if ($data['phone'] !== $phone->number) {
                    $phone->number = $data['phone'];
                    $phone->is_primary = 1;
                    $phone->save();
                }
            } else { // create
                $user->phones()->create(['number' => $data['phone'], 'is_primary' => 1, 'phoneable_type' => User::class, 'phoneable_id' => $user->id]);
            }
        }
        // switch the role
        if (!empty($data['primary_role']) && $data['primary_role'] !== $user->primary_role) {
            // this will vary by user type
            if ('HealthPlanUser' === $user->user_type_name) {
                // healthplans will only have one role
                Bouncer::sync($user)->roles([$data['primary_role']]);
                $user->primary_role = $data['primary_role'];
            }
        }
        // @todo, updating / creating users should be a service, likely by different user types
        if ('HealthPlanUser' === $user->user_type_name) {
            empty($data['can_view_reports']) ? $user->disallow('view-reports') : $user->allow('view-reports');
            empty($data['can_view_invoices']) ? $user->disallow('view-invoices') : $user->allow('view-invoices');
            empty($data['can_create_users']) ? $user->disallow('create-users') : $user->allow('create-users');
            // refresh perms cache
            Bouncer::refreshFor($user);
            // healthplan specific field
            if (!empty($data['job_title'])) {
                $user->healthPlanUser()->first()->update(['job_title' => $data['job_title']]);
            }
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
        $this->dispatch(new PasswordExpireCheckJob($request->user()));

        return new MyUserResource($request->user());
    }

    public function profileDelete(Request $request)
    {
        /** @var User $authed_user */
        $authed_user = $request->user();

        // allow user to only update their own profile
        if ($authed_user->cannot('delete', $authed_user)) {
            return response()->json(['message' => 'You do not have permissions for the requested resource.'], 403);
        }

        $authed_user->token()->revoke();
        $authed_user->update(['inactive_at' => Carbon::now()]);

        return response()->json(['message' => 'bye']);
    }

    public function profileSave(Request $request)
    {
        $user = $request->user();
        // allow user to only update their own profile
        if ($user->cannot('view', $user)) {
            return response()->json(['message' => 'You do not have permissions for the requested resource.'], 403);
        }

        $request_data = $request->except('password', 'roles', 'user_type');

        if ($request->has('primary_role')) {
            // validate the primary role
            $user_found_role = Bouncer::role()->firstWhere(['name' => $request_data['primary_role']]);
            if (empty($user_found_role) || !$user->roles->contains('name', $request_data['primary_role'])) {
                return response()->json(['message' => 'Invalid primary role.'], 422);
            }

            // change the user type if applicable
            if ($user->user_type_domain !== $user_found_role->domain) {
                // change the user type
                $request_data['user_type'] = User::mapTypeForDomain($user_found_role->domain);
            }
        }


        $user->update($request_data);

        return new MyUserResource($user);
    }

    public function profileImageSave(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        $file = $request->file('file');

        $profileImage = $user->profileImage()->updateOrCreate([
            'name'      => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
        ]);

        $profileImage->file = $request->file('file');
        $profileImage->save();

        return new ImageResource($profileImage);
    }

    public function permissionCheck(Request $request)
    {
        if (!$request->get('ability')) {
            return response()->json(['passed' => true]);
        }

        if ($request->has('id')) {
            $passed = auth()->user()->can($request->get('ability'), $request->get('id'));

            return response()->json(compact('passed'));
        }

        $passed = auth()->user()->can($request->get('ability'));

        return response()->json(compact('passed'));
    }
}
