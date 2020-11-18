<?php

namespace App\Console\Commands;

use App\Library\FmDataApi;
use Illuminate\Console\Command;

class FmApiTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fmapi:test {action?}';

    /**
     * Instance of the fm data api object.
     *
     * @var \App\Library\FmDataApi
     */
    protected $fm;

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(FmDataApi $fm)
    {
        parent::__construct();
        $this->fm = $fm;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($this->argument('action')) {
            case 'create':
                $this->create();
            break;
            default:
                $this->find();
            break;
        }

        return 0;
    }

    protected function find()
    {
        $payerId = 'Comp-QW3B-RMFR';
        $memberId = 'TESTsadfasdfadsf';
        $search = [];
        $search[] = ['MemberPayerHistory::member_id' => '=='.$memberId, 'MemberPayerHistory::id_payer' => $payerId];
        $query = ['query' => $search];
        $data = $this->fm->find($query, 'cwp_patient');
        dd($data, $this->fm->getLastError());
    }

    protected function create()
    {
        $patient = [
            'nameFirst'      => 'Billy',
            'nameMiddle'     => 'T',
            'nameLast'       => 'Goat',
            'type'           => 'Patient',
            'nameSalutation' => '',
            'date_of_birth'  => '12/31/1999',
            'gender'         => 'M',
            'language'       => 'English',
        ];
        $data = $this->fm->create($patient, 'cwp_patient');
        dd($data, $this->fm->getLastError());
    }
}
