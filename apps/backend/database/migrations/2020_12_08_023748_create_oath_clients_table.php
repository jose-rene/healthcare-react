<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOathClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('oath_clients', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained();
            $table->string('provider', 30)->index();
            $table->string('service_token')->index();

            $table->boolean('is_default')->nullable()->default(false);

            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 100)->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('oath_clients');
    }
}
