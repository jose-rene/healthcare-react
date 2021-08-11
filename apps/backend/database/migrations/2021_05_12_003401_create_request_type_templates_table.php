<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestTypeTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_type_templates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hcpcs_id')->nullable()->comment('id of related hcpcs');
            $table->foreignId('payer_id')->nullable();
            $table->foreignId('classification_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable()->comment('The id of the parent request type');
            $table->foreign('parent_id')->references('id')->on('request_types')->onDelete('set null');
            $table->string('name')->comment('The name of the request type');
            $table->boolean('is_requestable')->default(1)->comment('Flag can be requested');
            $table->boolean('is_consideration')->default(1)->comment('Flag can be added to considerations');
            $table->boolean('is_inherit_children')->default(1)->comment('boolean flag of whether child records should be automatically added for this payer when they are added to the template');

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
        Schema::dropIfExists('request_type_templates');
    }
}
