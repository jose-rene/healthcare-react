<?php

use App\Models\RequestFeeType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestFeeTypesTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_fee_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('display name');
            $table->string('slug')->nullable()->comment('base_fee/no_show/etc');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = ['base_fee', 'no_show'];

        array_walk($types, fn ($name) => RequestFeeType::create(compact('name')));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('request_fee_types');
    }
}
