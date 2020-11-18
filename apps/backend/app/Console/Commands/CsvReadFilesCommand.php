<?php

namespace App\Console\Commands;

use App\Library\FmDataApi;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CsvReadFilesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ftp:csv-read {--t|test : Read in one row}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download and read in csv files row by row';

    /**
     * Execute the console command.
     *
     * @param FmDataApi $fmDataApi
     * @return int
     */
    public function handle(FmDataApi $fmDataApi)
    {
        $files = Storage::disk('csv-files-inbox')->allFiles('.');

        foreach($files as $file){
            $stuff = [];
            // TODO :: read in the file as csv and part it to an array
            $csv_array = [];

            // TODO :: make sure the array is formatted correctly

            // TODO :: mash array to the transport function to push the array to filemaker

            // After the file is successfully imported move the file to the final spot
            $fmDataApi->post('save-the-stuff', compact('stuff'));
        }

        return 0;
    }
}
