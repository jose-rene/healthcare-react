<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Routing\Exceptions\InvalidSignatureException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        // give a friendly 404 message when resources are not found with implicit binding in resource controller
        if ($exception instanceof ModelNotFoundException && $request->acceptsJson()) {
            return response()->json(['message' => 'Resource Not Found.'], 404);
        }

        // give a friendly 403 message when resources are denied for permissions
        if ($exception instanceof AuthorizationException && $request->acceptsJson()) {
            return response()->json(['message' => $exception->getMessage()], 403);
        }

        // invalid or expired signature
        if ($exception instanceof InvalidSignatureException && $request->acceptsJson()) {
            return response()->json(['message' => 'Invalid Signature.'], 403);
        }

        // http exceptions, send back friendly json messages
        if ($exception instanceof HttpException && $request->acceptsJson()) {
            $data = ['message' => $exception->getMessage()];
            // add an errors object for validation type errors
            if (422 === ($statusCode = $exception->getStatusCode())) {
                $data['errors'] = ['general' => $data['message']];
            }

            return response()->json($data, $statusCode);
        }

        return parent::render($request, $exception);
    }
}
