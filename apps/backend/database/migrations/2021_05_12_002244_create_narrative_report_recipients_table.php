<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNarrativeReportRecipientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('narrative_report_recipients', function (Blueprint $table) {
            $table->id();

            $table->string('bcc_email')->comment('"bcc" email when sending narrative report');
            $table->string('bcc_name')->comment('"bcc" name when sending narrative report');
            $table->string('cc_email')->comment('"cc" email when sending narrative report');
            $table->string('cc_name')->comment('"cc" name when sending narrative report');
            $table->string('email_body')->comment('email body when sending narrative report');
            $table->string('email_subject')->comment('email subject when sending narrative report');
            $table->boolean('is_use_default')->comment('boolean flag to use the default narrative report temlpate');
            $table->foreignId('narrative_report_submission_method_id')->comment('id of method to use for sending narrative report');
            $table->foreignId('narrative_report_template_id')->comment('id of default narrative report template to use');
            $table->foreignId('payer_id')->comment('id of parent payer');
            $table->string('to_email')->comment('"to" email when sending narrative report');
            $table->string('to_name')->comment('"to" name when sending narrative report');

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
        Schema::dropIfExists('narrative_report_recipients');
    }
}
