<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CheckTaskOwner
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $task = $request->route('task');
        
        // Allow access if user is admin or task owner
        if ($request->user()->role === 'admin' || $task->client_id === $request->user()->id) {
            return $next($request);
        }

        return response()->json(
            ['error' => 'Unauthorized'],
            Response::HTTP_FORBIDDEN
        );
    }
}
