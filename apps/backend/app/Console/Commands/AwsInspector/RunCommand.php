<?php

namespace App\Console\Commands\AwsInspector;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class RunCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inspector:run {environment?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run the AWS Inspector Scan';

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
        if (null === ($arn = env($param = 'AWS_INSPECTOR_ARN_' . strtoupper($environment))) || empty($arn)) {
            $this->info(sprintf('There is not an AWS Inspector template arn [%s] defined in this environment [%s].', $param, $environment));

            return 0;
        }

        $client = \AWS::createClient('Inspector');
        $result = $client->startAssessmentRun([
            'assessmentRunName'     => $name = sprintf('Run - %s', ucfirst($environment)),
            'assessmentTemplateArn' => $arn, // required
        ]);

        $data = [
            'arn'  => $result->get('assessmentRunArn'),
            'name' => $name,
        ];
        Cache::put('inspector_run_' . $environment, $data, now()->addMinutes(180));
        // dd($result);
        $this->info(sprintf('Inspector run successfully initiated in %s environment.', $environment));

        return 1;
    }
}
