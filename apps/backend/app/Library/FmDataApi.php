<?php

namespace App\Library;

use Illuminate\Support\Facades\Cache;
use Psr\Log\LoggerInterface;

class FmDataApi
{
    protected $tokenName = 'fmtoken';
    protected $httpClient;
    protected $config;

    public function __construct(\Illuminate\Http\Client\Factory $httpClient, array $config)
    {
        $this->httpClient = $httpClient;
        $this->config = $config;
    }

    public function connect()
    {
        if (false !== ($token = Cache::get($this->tokenName, false)) && !empty($token)) {
            return $token;
        }
        $url = $this->config['host'].'/fmi/data/'.$this->config['version'].'/databases/'.rawurlencode($this->config['db']).'/sessions';
        $headers = [
            'Authorization' => 'Basic '.base64_encode($this->config['user'].':'.$this->config['pass']),
            'Content-Type'  => 'application/json',
        ];
        $response = $this->httpClient->withOptions(['verify' => false])->withHeaders($headers)->post($url);
        if (!$response->successful()) {
            return false;
        }
        $result = $response->json();
        if (!$result) {
            return false;
        }

        $token = false;
        if (isset($result['response']['token'])) {
            $token = $result['response']['token'];
            $expiresAt = now()->addMinutes(15); // the token lasts 15 minutes
            Cache::put($this->tokenName, $token, $expiresAt);
        }

        return $token;
    }
}
