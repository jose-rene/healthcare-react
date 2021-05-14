<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNarrativeReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('narrative_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('narrative_report_template_id')->comment('id of related narrative report template');
            $table->string('object_name')->comment('S3 object name');
            $table->string('request_id')->comment('id of parent request');
            $table->string('text')->comment('formatted report text');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('narrative_reports');
    }
}
