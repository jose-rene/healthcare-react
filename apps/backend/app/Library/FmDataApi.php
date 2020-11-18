<?php

namespace App\Library;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class FmDataApi
{
    protected $tokenName = 'fmtoken';
    protected $layout = 'session';
    protected $errors = [];
    /**
     * @var string
     */
    private $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.fmapi.host') . '/fmi/data/' . config('services.fmapi.version') . '/databases/' . rawurlencode(config('services.fmapi.db'));
    }

    public function connect()
    {
        if ($token = $this->getToken()) {
            return $token;
        }

        $response = $this->post('sessions', [], [
            'headers' => ['Authorization' => 'Basic ' . base64_encode(config('services.fmapi.user') . ':' . config('services.fmapi.pass'))],
        ]);

        if (false === $response) {
            return false;
        }

        if (!$response->successful()) {
            $this->errors[] = sprintf('Token request failed with status: %d', $response->status());

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

    public function find(array $params, $layout = null)
    {
        if (!empty($layout)) {
            $this->layout = $layout;
        }
        $response = $this->post('/layouts/' . rawurlencode($this->layout) . '/_find', $params);

        return null === ($data = $this->checkResponse($response)) || empty($data) ? $data : $this->formatData($data, true);
    }

    public function fetch($recordId, $layout = null)
    {
        if (!empty($layout)) {
            $this->layout = $layout;
        }

        $response = $this->get('/layouts/' . rawurlencode($this->layout) . '/records/' . $recordId);

        return null === ($data = $this->checkResponse($response)) || empty($data) ? $data : $this->formatData($data, true);
    }

    public function create($data, $layout = null)
    {
        if (!empty($layout)) {
            $this->layout = $layout;
        }
        $response = $this->post('/layouts/' . rawurlencode($this->layout) . '/records', ['fieldData' => $data]);

        if (false === $response) {
            return false;
        }

        if (!$response->successful()) {
            $this->errors[] = sprintf('Request failed with status: %d %s', $response->status(), $response->body());

            return false;
        }
        // needs to return recordId
        if (false === ($data = $response->json()) || empty($data['response'])) {
            return false;
        }

        $recordId = $data['response']['recordId'];
        if (false === ($record = $this->fetch($recordId)) || empty($record)) {
            // $this->errors[] = sprintf('Could not retrieve created record [%s]', $recordId);

            return false;
        }

        return $record;
    }

    /**
     * @param        $url
     * @param array  $params
     * @param string $method
     * @param array  $options
     * @return
     */
    public function call($url, array $params = [], $method = 'get', array $options = [])
    {
        $callUrl = Arr::get($options, 'baseUrl', $this->baseUrl) . '/' . $url;

        $headers = [
            'Content-Type' => 'application/json',
        ] + Arr::get($options, 'headers', []);

        if (empty($headers['Authorization'])) { // get token from cache or connect and request a token
            if (false === ($token = $this->getToken()) && false === ($token = $this->connect())) {
                $this->errors[] = 'Could not get authorization token.';

                return false;
            }
            $headers['Authorization'] = 'Bearer ' . $token;

            $response = Http::withOptions(['verify' => false])
                ->withHeaders($headers)
                ->{$method}($callUrl, $params);
        } else { // login, expects object in body
            $response = Http::withOptions(['verify' => false])
                ->withBody('{}', 'application/json')
                ->withHeaders($headers)
                ->{$method}($callUrl, $params);
        }

        // if the data api session ends unexpectedly, there will be a bad token error, check here
        if ($this->isBadToken($response)) {
            // retry with new token
            if (Arr::get($options, 'retry', false)) { // limit to one retry
                $this->errors[] = 'Could not get authorization token after retry.';

                return false;
            }
            Cache::forget($this->tokenName);
            $options['retry'] = true;

            return $this->call($url, $params, $method, $options);
        }

        return $response;
    }

    public function post($url, $data = [], $headers = [])
    {
        return $this->call($url, $data, 'post', $headers);
    }

    public function get($url, $data = [], $headers = [])
    {
        return $this->call($url, $data, 'get', $headers);
    }

    public function put($url, $data = [], $headers = [])
    {
        return $this->call($url, $data, 'put', $headers);
    }

    public function delete($url, $data = [], $headers = [])
    {
        return $this->call($url, $data, 'delete', $headers);
    }

    public function getLastError()
    {
        reset($this->errors);

        return empty($this->errors) ? '' : last($this->errors);
    }

    protected function getToken()
    {
        if (false !== ($token = Cache::get($this->tokenName, false)) && !empty($token)) {
            // reset cache timeout
            Cache::put($this->tokenName, $token, now()->addMinutes(15));

            return $token;
        }

        return false;
    }

    protected function isBadToken($response)
    {
        if (401 != $response->status() || false === ($result = $response->json()) || empty($result['messages'])) {
            return false;
        }
        if (!isset($result['messages'][0]['code']) || '952' != $result['messages'][0]['code']) {
            return false;
        }

        return true;
    }

    protected function formatData($data, $isRecord = false)
    {
        $data = array_map(function ($item) {
            $item['fieldData']['recordId'] = $item['recordId'];

            return $item['fieldData'];
        }, $data);
        if ($isRecord) {
            return $data[0];
        }

        return $data;
    }

    public function checkResponse($response, $key = 'response.data', $default = null)
    {
        if (!$response->successful()) {
            // log error
            $this->errors[] = sprintf($error = 'Request failed with status: %d %s', $response->status(), $response->body());
            logger()->error($error);

            return $default;
        }

        if (false === ($data = $response->json()) || empty($data['response'])) {
            return $default;
        }

        return Arr::get($data, $key, $default);
    }
}
