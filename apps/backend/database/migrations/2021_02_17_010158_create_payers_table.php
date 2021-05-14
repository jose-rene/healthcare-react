<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();

            $table->foreignId('parent_id')->nullable()->comment('The records optional parent payer');

            $table->string('name')->comment('The company name.');
            $table->string('abbreviation')->nullable()->comment('official abbreviation. limit ability to change after initial setup');
            $table->string('assessment_label')->nullable()->comment('label when displaying authorization numbers/assessment ids');
            $table->string('billing_document_type')->nullable()->comment('pdf/excel');
            $table->string('billing_frequency_id')->nullable()->comment('id for billing frequency');
            $table->string('coupa_business_name')->nullable()->comment('business name for submitting to Coupa');
            $table->string('coupa_cxml_template')->nullable()->comment('cxml template for Coupa invoices');
            $table->string('coupa_identity')->nullable()->comment('identity for submitting to Coupa');
            $table->string('coupa_shared_secret')->nullable()->comment('shared secret for submitting to Coupa');
            $table->string('coupa_url')->nullable()->comment('url for submitting to Coupa');
            $table->string('criteria')->nullable()->comment('criteria (can be inserted in narrative report)');
            $table->string('email_security_option_id')->nullable()->comment('id of email security options when sending invoices');
            $table->boolean('is_test')->nullable()->default(false)->comment('flag to indicate a test payer account');
            $table->string('payer_type_id')->nullable()->comment('id of payer type');
            $table->string('per_request_average_high')->nullable()->comment('high-end limit of average cost of requested items (for use with outcome reports)');
            $table->string('per_request_average_low')->nullable()->comment('low-end limit of average cost of requested items (for use with outcome reports)');
            $table->string('tat_default_time')->nullable()->comment('default time of day for specifying turnaround times');
            $table->string('tat_lead_red')->nullable()->comment('number of days before turnaround time to turn request display red');
            $table->string('tat_lead_yellow')->nullable()->comment('number of days before turnaround time to turn request display yellow');

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
        Schema::dropIfExists('payers');
    }
}
