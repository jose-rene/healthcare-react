<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHcpcsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hcpcs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->comment('hcpcs code');
            $table->string('short_desc')->comment('short description');
            $table->string('long_desc')->comment('long description');
            $table->string('action_change')->comment('the most recent change for the record');

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
        Schema::dropIfExists('hcpcs');
    }
}
