<?php

namespace App\Providers;

use App\Interfaces\ReportBuilder;
use App\Interfaces\ToPDF;
use App\Services\LambdaInvoke;
use App\Services\ReportBuilderService;
use App\Services\ToPdfLib;
use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;

class PdfProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->singleton(ToPDF::class, function () {
            return new ToPdfLib(config('services.pdf'));
        });

        $this->app->singleton(ReportBuilder::class, function () {
            return App::call(function (ToPDF $to_pdf, LambdaInvoke $lambda) {
                return new ReportBuilderService($to_pdf, $lambda);
            });
        });
    }
}
