<?php

use App\Models\EmailSecurityOption;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailSecurityOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_security_options', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('name');
            $table->string('slug')->nullable()->comment('regular/encrypted/office365');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = [
            'regular',
            'encrypted',
            'office365',
        ];

        array_walk($types, fn($name) => EmailSecurityOption::create(compact('name')));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('email_security_options');
    }
}
