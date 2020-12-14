<?php

namespace App\Console\Commands\AwsInspector;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

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
        if ('production' !== ($environment = $this->argument('environment'))) {
            $environment = 'staging';
        }
        if (null === ($region = env($param = 'AWS_REGION')) || empty($region)) {
            $this->info(sprintf('There is not an AWS Region [%s] defined this environment [%s].', $param, $environment));

            return 0;
        }
        if (false === ($data = Cache::get($cacheKey = 'inspector_run_' . $environment, false)) || empty($data)) {
            $this->info(sprintf('There is not a recent inspector scan available for this environment [%s].', $environment));
            Cache::put('inspector_run_' . $environment, ['arn' => 'arn:aws:inspector:us-west-2:452494236181:target/0-yOMEVtVm/template/0-MUJbu40s/run/0-hyb2Q59Q', 'name' => 'Inspector Run - Staging'], now()->addMinutes(120));

            return 0;
        }

        $this->info('Fetching the inspector run');

        $client = \AWS::createClient('Inspector');
        $params = [
            'assessmentRunArn' => $data['arn'],
            'reportFileFormat' => 'PDF',
            'reportType'       => 'FINDING',
        ];
        if (null === ($result = $client->getAssessmentReport($params)) || empty($result)) {
            $this->info(sprintf('Could not retrieve Inspector report for %s environment', $environment));

            return 0;
        }
        if ('COMPLETED' !== ($status = $result->get('status'))) {
            $this->info(sprintf('Inspector report not available for %s environment, status: %s', $environment, $status));

            return 0;
        }
        $this->info(sprintf('Inspector report successfully fetched in %s environment.', $environment));

        // fetch report
        $response = Http::withOptions(['sink' => $file = tempnam(sys_get_temp_dir(), 'inspector_')]) // 'debug' => true
            ->withHeaders(['User-Agent' => 'DME API/1.0'])
            ->get($url = $result->get('url'));
        if (!$response->successful()) {
            $this->info(sprintf('Retrieving report url [%s], was unsuccessful: [%s] [%s].', $url, $response->status(), $response->clientError()));

            return 0;
        }

        // $this->info(sprintf('File [%s] successfully retrieved.', $file));
        // email the report
        /*$text = sprintf('Monthly AWS Inspector run is now available: %s', $name);
        Mail::mailer('ses')->send([
            'html' => '<p>' . $text . '</p>',
            'text' => $text,
        ], [], function ($message) {
            $message
            ->to(env('DEVS_EMAIL', 'devs@dme-cg.com'))
            ->subject('Monthly AWS Inspector Run');
        });*/
        // save to S3
        $s3 = \AWS::createClient('s3');
        $s3->putObject([
            'Bucket'     => 'dme-security',
            'Key'        => now()->format('Y_m_d_') . preg_replace('~[\s\-]+~', '_', $data['name']),
            'SourceFile' => $file,
        ]);
        // cleanup
        unlink($file);
        Cache::forget($cacheKey);

        return 1;
    }
}
