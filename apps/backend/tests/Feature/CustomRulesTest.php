<?php

namespace Tests\Feature;

use App\Models\User;
use App\Rules\PasswordContiguousRule;
use App\Rules\PasswordNonVisibleCharsCheck;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomRulesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic n.
     *
     * @return void
     */
    public function testNoHarmNonVisibleChars()
    {
        $rule = new PasswordNonVisibleCharsCheck();

        self::assertTrue($rule->passes('password', 'dme'));
    }

    public function testShouldVisibleVisibleChars()
    {
        $rule = new PasswordNonVisibleCharsCheck();

        self::assertFalse($rule->passes('password', "ab\r\ncd\tefg"));
        self::assertFalse($rule->passes('password', 'P@ssw0rd&'));
    }

    public function testContiguousNoHarm()
    {
        // User is for the account name checks when we're ready for that part.
        $user = User::factory()->create(
            [
                'first_name' => 'aaa',
                'last_name'  => 'bbb',
            ]
        );

        $test_password = 'dme';

        $rule = new PasswordContiguousRule($user);
        self::assertTrue($rule->passes('password', $test_password));
    }

    public function testContiguousFail()
    {
        // User is for the account name checks when we're ready for that part.
        $user = User::factory()->create(
            [
                'username'   => 'welcome',
                'email'      => 'admin@admin.com',
                'first_name' => 'This is a test first name for a user',
                'last_name'  => 'bbBye',
            ]
        );

        $rule = new PasswordContiguousRule($user);
        self::assertFalse($rule->passes('password', 'irst'));     // part of a word in the first name
        self::assertFalse($rule->passes('password', 'uSer'));     // Case should not matter
        self::assertFalse($rule->passes('password', 'bye'));      // first and last name checks
        self::assertFalse($rule->passes('password', 'r b'));      // first and last name checks
        self::assertFalse($rule->passes('password', 'welcome'));  // should catch username
        self::assertFalse($rule->passes('password', '@admin'));   // should catch email
    }
}
