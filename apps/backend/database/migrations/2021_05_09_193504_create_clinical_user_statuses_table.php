<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClinicalUserStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clinical_user_statuses', function (Blueprint $table) {
            $table->id();

            $table->boolean('is_active')->default(1)->comment('flag for active status (can log in)');
            $table->string('name')->comment('display name');
            $table->string('slug')->comment('available/unavailable/probation/vacation/illness/etc');
            $table->string('description')->default('')->comment('description');

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
        Schema::dropIfExists('clinical_user_statuses');
    }
}
