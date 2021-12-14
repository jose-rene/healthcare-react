<?php

namespace App\Services;

use AWS;
use GuzzleHttp\Psr7\Stream;

class LambdaInvoke
{
    public function handler($function_name, $data)
    {
        $client = AWS::createClient('lambda');

        $raw_response = $client->invoke([
            'FunctionName' => $function_name,
            'Payload'      => json_encode($data),
        ]);

        /** @var Stream $payload */
        $payload          = $raw_response->get('Payload');
        $payload_contents = $payload->getContents();
        $decoded          = json_decode($payload_contents);

        return object_get(json_decode($decoded->body), 'data.template');
    }
}
