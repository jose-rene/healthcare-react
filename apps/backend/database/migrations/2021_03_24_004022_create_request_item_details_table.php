<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestItemDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_item_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('request_item_id')->comment('The related request item');
            $table->foreignId('request_type_detail_id')->comment('The related request type item');

            // is_default and name can be determined from the related request_type_detail, may not be needed
            $table->boolean('is_default')->default(0)->comment('flag to automatically create a request_item_detail record when the parent request type is selected for a request_item');
            $table->string('name')->nullable()->comment('name');

            $table->string('request_type_detail_template_id')->nullable()->comment('id of the related request_type_detail_template (if any)');

            // this is not necessary, can be determined from the request_type_detail relationship to request type
            $table->string('request_type_id')->nullable()->comment('id of the parent request_type');

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
        Schema::dropIfExists('request_item_details');
    }
}
