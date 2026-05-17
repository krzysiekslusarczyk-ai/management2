<?php

namespace App\Http\Controllers;

use App\Models\iCloudAccount;
use App\Models\Task;
use App\Services\iCloudSyncService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class iCloudSyncController extends Controller
{
    public function __construct(private iCloudSyncService $syncService)
    {
    }

    public function connectAccount(Request $request)
    {
        $validated = $request->validate([
            'icloud_email' => 'required|email',
            'app_password' => 'required|string|min:16',
        ]);

        try {
            $account = $this->syncService->validateAndCreateAccount(
                $request->user(),
                $validated['icloud_email'],
                $validated['app_password']
            );

            return response()->json([
                'message' => 'iCloud account connected successfully',
                'account' => $account,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to connect iCloud account: ' . $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getAccounts(Request $request)
    {
        $accounts = iCloudAccount::where('user_id', $request->user()->id)
            ->select('id', 'icloud_email', 'calendar_id', 'sync_enabled', 'last_sync_at', 'sync_status')
            ->get();

        return response()->json($accounts);
    }

    public function syncTasks(Request $request, iCloudAccount $account)
    {
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        try {
            $this->syncService->syncTasksToiCloud($account);

            return response()->json([
                'message' => 'Tasks synced successfully',
                'last_sync_at' => $account->last_sync_at,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Sync failed: ' . $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function toggleSync(Request $request, iCloudAccount $account)
    {
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $account->update(['sync_enabled' => !$account->sync_enabled]);

        return response()->json([
            'message' => 'Sync ' . ($account->sync_enabled ? 'enabled' : 'disabled'),
            'sync_enabled' => $account->sync_enabled,
        ]);
    }

    public function disconnectAccount(Request $request, iCloudAccount $account)
    {
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $account->delete();

        return response()->json(['message' => 'iCloud account disconnected']);
    }
}
