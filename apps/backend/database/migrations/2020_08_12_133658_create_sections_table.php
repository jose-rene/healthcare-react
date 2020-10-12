<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('sections')->onDelete('set null');
            $table->foreignId('questionnaire_id')->nullable();
            // @note friendly name for json generation, may need to be indexed
            $table->string('name', 64)->default('')->nullable(false);
            $table->string('title')->default('')->nullable(false);
            $table->string('section_type', 16)->default('');
            $table->unsignedTinyInteger('position')->default(0)->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sections');
    }
}
