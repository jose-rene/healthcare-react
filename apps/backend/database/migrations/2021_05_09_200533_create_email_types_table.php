<?php

use App\Models\EmailType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('name');
            $table->string('slug')->nullable()->comment('billing_to, billing_cc, etc.');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = [
            'billing_to',
            'billing_cc',
        ];
        array_walk($types, fn ($name) => EmailType::create(compact('name')));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('email_types');
    }
}
