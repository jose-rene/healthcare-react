<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassificationTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('The name of the request type');
            $table->boolean('has_hcpc')->default(false)->comment('id of related hcpcs');
            $table->boolean('is_default')->default(false)->comment('is a default classification');
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
        Schema::dropIfExists('classification_templates');
    }
}
