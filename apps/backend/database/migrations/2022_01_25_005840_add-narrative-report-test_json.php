<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNarrativeReportTestJson extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('narrative_report_templates', function (Blueprint $table) {
            $table->longText('test_json')->nullable()->after('template')->default(json_encode([]));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('narrative_report_templates', function (Blueprint $table) {
            $table->dropColumn('test_json');
        });
    }
}
