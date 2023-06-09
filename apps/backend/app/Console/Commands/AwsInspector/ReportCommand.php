<?php

namespace App\Console\Commands\AwsInspector;

use AWS;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Swift_Attachment;

class ReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inspector:report {environment?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Retrieve the latest AWS Inspector Scan run';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if ('production' !== ($environment = $this->argument('environment')) && 'all' !== $environment) {
            $environment = 'staging';
        }
        if (null === ($region = env($param = 'AWS_REGION')) || empty($region)) {
            $this->info(sprintf('There is not an AWS Region [%s] defined.', $param));

            return 0;
        }

        $envs = 'all' === $environment ? ['staging', 'production'] : [$environment];

        foreach ($envs as $environment) {
            if (0 !== $this->runReport($environment)) {
                $this->info(sprintf('Inspector report successfully fetched in %s environment.', $environment));
            }
        }

        return 1;
    }

    /**
     * Fetch the requested AWS Inspector run.
     *
     * @param string $environment
     * @param string $region
     *
     * @return int
     */
    protected function runReport($environment)
    {
        if (false === ($data = Cache::get($cacheKey = 'inspector_run_' . $environment, false)) || empty($data)) {
            $this->info(sprintf('There is not a recent inspector scan available for this environment [%s].', $environment));

            return 0;
        }

        $this->info('Fetching the inspector run');

        $client = AWS::createClient('Inspector');
        $params = [
            'assessmentRunArn' => $data['arn'],
            'reportFileFormat' => 'PDF',
            'reportType'       => 'FINDING',
        ];
        try {
            if (null === ($result = $client->getAssessmentReport($params)) || empty($result)) {
                $this->info(sprintf('Could not retrieve Inspector report for %s environment', $environment));

                return 0;
            }
        } catch (Aws\Inspector\Exception\InspectorException $e) {
            $this->info(sprintf('Inspector report error: %s [%s]', $e->getMessage(), $environment));

            return 0;
        }
        if ('COMPLETED' !== ($status = $result->get('status'))) {
            $this->info(sprintf('Inspector report not available for %s environment, status: %s', $environment, $status));

            return 0;
        }
        $this->info(sprintf('Inspector report successfully fetched in %s environment.', $environment));

        // fetch report
        $file = tempnam(sys_get_temp_dir(), 'inspector_');
        $response = Http::withOptions(['sink' => $file]) // 'debug' => true
            ->withHeaders(['User-Agent' => 'DME API/1.0'])
            ->get($url = $result->get('url'));
        if (!$response->successful()) {
            $this->info(sprintf('Retrieving report url [%s], was unsuccessful: [%s] [%s].', $url, $response->status(), $response->clientError()));

            return 0;
        }

        // remove date from file name
        $nameParts = array_values(array_filter(array_map('trim', explode(' - ', $data['name']))));
        array_pop($nameParts);
        $fileName = preg_replace('~\s+~', '_', $name = implode(' ', $nameParts) . ' ' . now()->format('M Y'));
        $text = sprintf('Monthly AWS Inspector run is now available: %s', $name);
        // email the report
        Mail::mailer('smtp')->send([], [], function ($message) use ($file, $fileName, $text) {
            $message->to(env('DEVS_EMAIL', 'skylar.langdon@dme-cg.com'))
                ->setFrom('noreply@dme-cg.com', 'DME-CG')
                ->setSubject('Monthly AWS Inspector Run')
                ->setBody('<html><p>' . $text . '</p></html>', 'text/html')
                ->addPart($text, 'text/plain')
                ->attach(Swift_Attachment::fromPath($file)->setFilename($fileName . '.pdf'));
        });

        // save to S3
        $s3 = AWS::createClient('s3');
        $s3->putObject([
            'Bucket'     => 'dme-security',
            'Key'        => $fileName,
            'SourceFile' => $file,
        ]);

        // cleanup
        unlink($file);
        Cache::forget($cacheKey);
    }
}
