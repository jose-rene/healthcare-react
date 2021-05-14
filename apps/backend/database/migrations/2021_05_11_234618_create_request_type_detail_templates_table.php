<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestTypeDetailTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_type_detail_templates', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('request type name');
            $table->boolean('is_inherit_children')->comment('boolean flag of whether child records should be automatically added for for payers when they are added to the template. Overrideable at the payer level.');
            $table->boolean('is_requestable')->comment('flag to include in request_types menu');

            $table->foreignId('hcpcs_id')->comment('id of associated hcpcs code');
            $table->foreignId('parent_id')->comment('id of parent request_type');

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
        Schema::dropIfExists('request_type_detail_templates');
    }
}
