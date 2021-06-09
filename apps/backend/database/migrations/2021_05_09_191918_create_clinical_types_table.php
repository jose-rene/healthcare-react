<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClinicalTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clinical_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('name (PT/OT/Nurse/Speech/Prosthetist/etc)');
            $table->string('slug')->nullable()->comment('slug of the name (pt)');

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
        Schema::dropIfExists('clinical_types');
    }
}
