<?php

namespace App\Ssr;

use Exception;
use Illuminate\Http\Client\StrayRequestException;
use Illuminate\Support\Facades\Http;
use Inertia\Ssr\HasHealthCheck;
use Inertia\Ssr\HttpGateway;
use Inertia\Ssr\Response;

/**
 * Same as Inertia's HttpGateway, but fails fast so a slow/hung SSR
 * process cannot hold PHP until the CDN returns 502.
 */
class TimeoutHttpGateway extends HttpGateway implements HasHealthCheck
{
    public function dispatch(array $page): ?Response
    {
        if (! $this->shouldDispatch()) {
            return null;
        }

        try {
            $response = Http::connectTimeout(1)
                ->timeout(2)
                ->post($this->getUrl('/render'), $page)
                ->throw()
                ->json();
        } catch (Exception $e) {
            if ($e instanceof StrayRequestException) {
                throw $e;
            }

            return null;
        }

        if (is_null($response)) {
            return null;
        }

        return new Response(
            implode("\n", $response['head']),
            $response['body']
        );
    }

    public function isHealthy(): bool
    {
        try {
            return Http::connectTimeout(1)
                ->timeout(2)
                ->get($this->getUrl('/health'))
                ->successful();
        } catch (Exception $e) {
            if ($e instanceof StrayRequestException) {
                throw $e;
            }

            return false;
        }
    }
}
