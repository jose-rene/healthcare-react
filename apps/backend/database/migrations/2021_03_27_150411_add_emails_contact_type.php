<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmailsContactType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('emails', function (Blueprint $table) {
            $table->string('contact_type', 48)->after('email')->default('')->comment('The contact type for the email.');
            $table->boolean('is_primary')->after('email')->default(0)->comment('Flag for primary contact method');
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
        Schema::table('emails', function (Blueprint $table) {
            $table->dropColumn('contact_type');
            $table->dropColumn('is_primary');
            $table->dropSoftDeletes();
        });
    }
}
