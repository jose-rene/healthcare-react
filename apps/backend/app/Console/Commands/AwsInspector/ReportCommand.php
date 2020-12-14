<?php

namespace App\Console\Commands\AwsInspector;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

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
            $this->info(sprintf('There is not an AWS Region defined this environment: AWS_REGION', $param));

            return 0;
        }
        if (false === ($arn = Cache::get('inspector_run_' . $environment, false)) || empty($arn)) {
            $this->info(sprintf('There is not a recent inspector scan available for this environment: %s', $param));

            return 0;
        }

        $this->info('Fetching the inspector run');

        $client = \AWS::createClient('Inspector');
        $params = [
            'assessmentRunArn' => $arn,
            'reportFileFormat' => 'PDF',
            'reportType'       => 'FINDING',
        ];
        if (null === ($result = $client->getAssessmentReport($params)) || empty($result)) {
            $this->info(sprintf('Could not retrieve Inspector report for %s environment', $environment));

            return 0;
        }
        // Cache::put('inspector_run_' . $environment, $result->assessmentRunArn, now()->addMinutes(120));

        if ('COMPLETED' !== ($status = $result->get('status'))) {
            $this->info(sprintf('Inspector report not available for %s environment, status: %s', $environment, $status));

            return 0;
        }
        $this->info(sprintf('Inspector report successfully fetched in %s environment, %s', $environment, $result->get('url')));

        return 1;
    }
}
