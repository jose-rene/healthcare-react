<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNarrativeReportSubmissionMethodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('narrative_report_submission_methods', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('name');
            $table->string('slug')->nullable()->comment('slug');

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
        Schema::dropIfExists('narrative_report_submission_methods');
    }
}
