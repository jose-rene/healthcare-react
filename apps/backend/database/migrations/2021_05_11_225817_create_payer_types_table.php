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
     * @deprecated This will not be used.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payer_types', function (Blueprint $table) {
            $table->tinyIncrements('id');

            $table->string('name')->comment('Equipment Provider, Health Plan, Health Plan Manager, IPA, IPA Manager, Medical Group, Medical Group Manager');
            $table->string('slug')->nullable()->comment('hp, hp_manager, ipa, ipa_manager, mg, mg_manager');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = [
            'Equipment Provider',
            'Health Plan',
            'IPA',
            'Medical Group',
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
