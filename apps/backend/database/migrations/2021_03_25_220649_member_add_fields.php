<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MemberAddFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('language', 64)->after('member_number')->nullable()->comment('The member\'s primary language.');
            $table->string('line_of_business')->after('member_number')->nullable()->comment('The line of business associated with the member.');
            $table->string('member_number_type')->after('member_number')->nullable()->comment('The member ID type for the plan specifiec member id number.');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('language');
            $table->dropColumn('line_of_business');
            $table->dropColumn('member_number_id');
        });
    }
}
