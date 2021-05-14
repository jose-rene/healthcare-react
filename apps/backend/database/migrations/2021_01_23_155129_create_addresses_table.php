<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->morphs('addressable');
            $table->boolean('is_primary')->comment('flag for primary address');
            $table->string('address_1')->comment('The street address.');
            $table->string('address_2')->default('')->comment('The suite, apt, unit, etc # portion of the address.');
            $table->string('city');
            $table->string('county')->comment('Country abbr like USA');
            $table->string('state', 2)->comment('State abbr like AZ or CA');
            $table->string('postal_code', 10);
            $table->foreignId('address_type_id')->nullable()->default(1)->comment('id of related address type');
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
        Schema::dropIfExists('addresses');
    }
}
