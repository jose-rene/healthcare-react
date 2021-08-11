<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payer_id')->nullable();
            $table->foreignId('classification_template_id')->nullable()->comment('id of related request type template (optional)');
            $table->string('name')->comment('The name of the request type');
            $table->boolean('has_hcpc')->default(false)->comment('id of related hcpcs');
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
        Schema::dropIfExists('classifications');
    }
}
