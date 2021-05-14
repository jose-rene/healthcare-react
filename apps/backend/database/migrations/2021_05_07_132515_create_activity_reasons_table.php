<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivityReasonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activity_reasons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('activity_reason_type_id')->comment('ID of related activity reason type');
            $table->string('name')->comment('reason name');
            $table->unsignedBigInteger('parent_id')->nullable()->comment('id of parent activity_reason_type (if any)');

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
        Schema::dropIfExists('activity_reasons');
    }
}
