<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            $table->string('email');
            $table->foreignId('email_type_id')->nullable()->comment('id of related email type');
            $table->boolean('is_primary')->default(0)->comment('Flag for primary contact method');
            $table->string('contact_type', 48)->default('')->comment('The contact type for the email.');
            $table->morphs('emailable');

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
        Schema::dropIfExists('emails');
    }
}
