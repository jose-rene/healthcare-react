<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->string('member_id')->comment('The plan specified member ID');
            $table->string('gender', 6)->comment('The member\'s gender');
            $table->string('name_title', 6)->comment('The member\'s name saluation');
            $table->string('first_name', 64)->comment('The member\'s first name');
            $table->string('last_name', 64)->comment('The member\'s last name');
            $table->date('dob')->nullable()->comment('The member\'s date of birth');
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
        Schema::dropIfExists('members');
    }
}
