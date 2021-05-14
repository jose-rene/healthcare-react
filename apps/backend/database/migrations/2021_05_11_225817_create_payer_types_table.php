<?php

use App\Models\PayerType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayerTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payer_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('Health Plan, Health Plan Manager, IPA, IPA Manager, Medical Group, Medical Group Manager');
            $table->string('slug')->nullable()->comment('hp, hp_manager, ipa, ipa_manager, mg, mg_manager');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = [
            'hp',
            'hp manager',
            'ipa',
            'ipa manager',
            'mg',
            'mg manager',
        ];

        array_walk($types, fn ($name) => PayerType::create(compact('name')));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payer_types');
    }
}
