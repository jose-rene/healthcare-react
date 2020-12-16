<?php

namespace App\Console\Commands\AwsInspector;

use AWS;
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
        if ('production' !== ($environment = $this->argument('environment')) && 'all' !== $environment) {
            $environment = 'staging';
        }
        if (null === ($region = env($param = 'AWS_REGION')) || empty($region)) {
            $this->info(sprintf('There is not an AWS Region [%s] defined.', $param));

            return 0;
        }

        $envs = 'all' === $environment ? ['staging', 'production'] : [$environment];

        foreach ($envs as $environment) {
            if (0 !== $this->runScan($environment, $region)) {
                $this->info(sprintf('Inspector run successfully initiated in %s environment.', $environment));
            }
        }

        return 1;
    }

    /**
     * Run the requested AWS assessment.
     *
     * @param string $environment
     * @param string $region
     *
     * @return int
     */
    protected function runScan($environment, $region)
    {
        if (null === ($arn = env($param = 'AWS_INSPECTOR_ARN_' . strtoupper($environment))) || empty($arn)) {
            $this->info(sprintf('There is not an AWS Inspector template arn [%s] defined in this environment [%s].', $param, $environment));

            return 0;
        }

        $client = AWS::createClient('Inspector');
        try {
            $result = $client->startAssessmentRun([
                'assessmentRunName'     => $name = sprintf('Run - %s - %s', ucfirst($environment), now()->format('Y-m-d H:i')),
                'assessmentTemplateArn' => $arn, // required
            ]);
        } catch (Aws\Inspector\Exception\InspectorException $e) {
            $this->info(sprintf('Inspector run error: %s [%s]', $e->getMessage(), $environment));

            return 0;
        }

        $data = [
            'arn'  => $result->get('assessmentRunArn'),
            'name' => $name,
        ];
        Cache::put('inspector_run_' . $environment, $data, now()->addMinutes(180));

        return 1;
    }
}
