<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()->unreadNotifications()->orderBy('created_at', 'desc')->get();
        $readNotifications = auth()->user()->readNotifications()->orderBy('created_at', 'desc')->take(5)->get();

        return NotificationResource::collection($notifications->merge($readNotifications));
    }

    /**
     * mark a batch or single notification as read
     * @param Request $request
     */
    public function update(Request $request)
    {
        $ids = $request->get('ids', []);
        if (!is_array($ids)) {
            $ids = [$ids];
        }

        auth()->user()->unreadNotifications()->whereIn('id', $ids)->get()->markAsRead();

        return response()->json(['status' => true]);
    }
}
