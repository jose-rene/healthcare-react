<?php

use App\Models\AddressType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('address_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('name');
            $table->string('slug')->nullable()->comment('home/work/billing/claims/etc');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = collect([
            'Home',
            'Work',
            'Billing',
            'Claims',
        ]);

        $types->each(fn($name) => AddressType::create(compact('name')));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('address_types');
    }
}
