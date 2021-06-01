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

            $table->foreignId('payer_id')->nullable()->comment('The associated payer for this member.');
            $table->foreignId('lob_id')->nullable()->comment('The lob associated with this member.');
            $table->foreignId('language_id')->nullable()->comment('The associated preferred language');
            $table->string('language', 50)->nullable()->comment('text of prefered language if other');
            $table->string('member_number')->comment('The plan specified member ID');
            $table->string('line_of_business')->nullable()->comment('The line of business associated with the member.');
            $table->string('member_number_type')->nullable()->comment('The member ID type for the plan specified member id number.');
            $table->string('gender', 6)->comment('The member\'s gender');
            $table->string('name_title', 6)->comment('The member\'s name saluation');
            $table->string('first_name', 64)->comment('The member\'s first name');
            $table->string('last_name', 64)->comment('The member\'s last name');
            $table->date('dob')->nullable()->comment('The member\'s date of birth');
            $table->boolean('is_test')->default(false)->comment('boolean flag for test record');
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
