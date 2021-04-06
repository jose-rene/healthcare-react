<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Member;
use App\Models\Request;
use App\Models\User;
use Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Passport;
use Storage;
use Tests\TestCase;

/**
 * Class
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#group
 * @link https://phpunit.readthedocs.io/en/9.5/annotations.html#testwith
 */
class RequestDocumentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var User
     */
    private $user;
    private $member;

    /**
     * A basic feature test example.
     *
     * @group document
     * @return void
     */
    public function testUploadingADocument()
    {
        $this->withoutExceptionHandling();
        Storage::fake('document');
        $documentFile  = UploadedFile::fake()->create('somePdfThing.pdf', 1000, 'application/pdf');
        $documentFile1 = UploadedFile::fake()->create('somePdfThing1.pdf', 1001, 'application/pdf');

        Request::factory()->hasRequestItems(1)->create();

        // Make sure I can upload the file
        $response = $this->post(route('api.document.store'), [
            'request_item_id'  => '1',
            'document_type_id' => '1',
            'name'             => 'somePdfThing.pdf',
            'mime_type'        => 'application/pdf',
            'file'             => $documentFile,
        ]);
        $response->assertSuccessful();
        $documentFromResponse = $response->json();

        Storage::disk('document')->assertExists($documentFromResponse['id']);

        // Make sure I can request the file
        $response = $this->get($documentFromResponse['url']);
        $response
            ->assertOk()
            ->assertHeader('Content-Type', $documentFromResponse['mime_type']);

        // When I update the file I expect 2 entries in the datbase and 2 files on disk
        $response = $this->put(route('api.document.update', [
            'document' => $documentFromResponse['id'],
            'name'     => 'somePdfThing1.pdf',
        ]), [
            'request_item_id'  => '1',
            'document_type_id' => '1',
            'name'             => 'somePdfThing1.pdf',
            'mime_type'        => 'application/pdf',
            'file'             => $documentFile1,
        ]);
        $response->assertSuccessful();
        $updatedDocumentFromResponse = $response->json();

        self::assertNotEquals($updatedDocumentFromResponse['id'], $documentFromResponse['id']);
        self::assertCount(2, Document::all());
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('passport:install');
        // this will store a new user with random attributes in the database.
        /* @var User $user */
        $this->user   = User::factory(['password' => Hash::make('password')])->create();
        $this->member = Member::factory()->hasAddresses(1, ['is_primary' => true])->create();

        Passport::actingAs(
            $this->user
        );
    }
}
