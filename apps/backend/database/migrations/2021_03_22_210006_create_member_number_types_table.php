<?php

use App\Models\MemberNumberType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMemberNumberTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('member_number_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('An entity or slug name.');
            $table->string('title')->comment('The title for ui display.');
            $table->timestamps();
            $table->softDeletes();
        });

        $types = [
            'memberID' => 'Member ID',
            'cin'      => 'CIN#',
        ];

        foreach ($types as $key => $value) {
            MemberNumberType::firstOrCreate(['name' => $key, 'title' => $value]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('member_number_types');
    }
}
