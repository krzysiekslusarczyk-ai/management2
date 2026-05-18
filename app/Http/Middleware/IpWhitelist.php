<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IpWhitelist
{
    /**
     * List of allowed IP addresses.
     * 
     * @var array<string>
     */
    protected $allowedIps = [
        '127.0.0.1',      // localhost
        '::1',            // localhost IPv6
        '93.159.141.66',  // external authorized IP
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $clientIp = $request->ip();

        // Check if client IP is in the whitelist
        if (!in_array($clientIp, $this->allowedIps)) {
            return response('Unauthorized: Your IP address is not whitelisted.', 403);
        }

        return $next($request);
    }
}
