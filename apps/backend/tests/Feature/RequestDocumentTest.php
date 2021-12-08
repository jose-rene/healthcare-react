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
use Image;
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


    public function testUploadingADocument()
    {
        Storage::fake('document');
        $documentFile  = UploadedFile::fake()->create('somePdfThing.pdf', 1000, 'application/pdf');
        $documentFile1 = UploadedFile::fake()->create('somePdfThing1.pdf', 1001, 'application/pdf');

        // Request::factory()->hasRequestItems(1)->create();

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
     * @group requestDocumentUpload
     */
    public function testUploadingADocumentToRequest()
    {
        Storage::fake('document');
        $documentFile = UploadedFile::fake()->create('somePdfThing.pdf', 1000, 'application/pdf');
        $request = Request::first();

        // Make sure I can upload the file
        $response = $this->post(route('api.request.document.store', $request), [
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
    }

    public function testMediaUpload()
    {
        Storage::fake('document');
        $imageFile = UploadedFile::fake()->image('image.png');
        $request = Request::first();

        // upload media
        $response = $this->post(route('api.request.document.store', $request), $params = [
            'document_type_id' => '2',
            'name'             => 'image.png',
            'mime_type'        => 'unknown',
            'position'         => 1,
            'file'             => $imageFile,
        ]);
        // check mime type was detected by Intervention
        $response
            ->assertSuccessful()
            ->assertJsonPath('mime_type', 'image/png')
            ->assertJsonPath('position', $params['position'])
            ->assertJsonPath('name', $params['name']);

        $documentFromResponse = $response->json();

        Storage::disk('document')->assertExists($documentFromResponse['id']);

        // Make sure I can request the file
        $response = $this->get($documentFromResponse['url']);
        $response
            ->assertOk()
            ->assertHeader('Content-Type', $documentFromResponse['mime_type']);
        
        // test media is attached to request
        $response = $this->get(route('api.request.show', $request));
        $response
            ->assertOk()
            ->assertJsonPath('media.0.mime_type', 'image/png')
            ->assertJsonPath('media.0.position', $params['position'])
            ->assertJsonPath('media.0.name', $params['name']);
    }

    public function testMediaTagsUpload()
    {
        $this->withoutExceptionHandling();
        Storage::fake('document');
        $imageFile = UploadedFile::fake()->image('image.png');
        $request = Request::first();

        // upload media
        $response = $this->post(route('api.request.document.store', $request), $params = [
            'document_type_id' => '2', // media
            'name'             => 'image.png',
            'mime_type'        => 'image/png',
            'position'         => 1,
            'file'             => $imageFile,
            'comments'         => 'This is a description.',
            'tag'              => 'Kitchen Entry',
        ]);
        $response->assertSuccessful();
        $document = Document::firstWhere('uuid', $response->json()['id']);

        Storage::disk('document')->assertExists($document->getFileNameAttribute());
        // check thumbnail
        Storage::disk('document')->assertExists($document->getThumbnailNameAttribute());

        // make sure thumbnail is resized
        $thumbnail = Image::make($document->thumbnail);
        $this->assertEquals(env('THUMBNAIL_SIZE', 300), $thumbnail->width());

        // Make sure I can request the thumbnail
        $response = $this->get($document->thumbnail_url);
        $response
            ->assertOk()
            ->assertHeader('Content-Type', $document->mime_type);

        // test media is there
        $response = $this->get(route('api.request.show', $request));

        $response
            ->assertOk()
            ->assertJsonStructure(['media' => [0 => ['mime_type', 'position', 'url', 'thumbnail', 'comments', 'tags']]])
            ->assertJsonPath('media.0.mime_type', 'image/png')
            ->assertJsonPath('media.0.position', $params['position'])
            ->assertJsonPath('media.0.name', $params['name'])
            ->assertJsonPath('media.0.comments', $params['comments'])
            ->assertJsonPath('media.0.tags.0', $params['tag']);
    }

    public function testMimeTypeDetection()
    {
        Storage::fake('document');
        // file with text/plain
        $imageFile = UploadedFile::fake()->create('text.txt', 1000, 'text/plain');
        $request = Request::first();

        // upload media
        $response = $this->post(route('api.request.document.store', $request), $params = [
            'document_type_id' => '2',
            'name'             => 'image.png',
            'mime_type'        => 'image/png', // send an image mime type
            'position'         => 1,
            'file'             => $imageFile,
        ]);
        // check mime type was detected by Intervention
        $response
            ->assertSuccessful()
            ->assertJsonPath('mime_type', 'text/plain')
            ->assertJsonPath('position', $params['position'])
            ->assertJsonPath('name', $params['name']);

        // make sure file exists
        $document = Document::firstWhere('uuid', $response->json()['id']);
        Storage::disk('document')->assertExists($document->file_name);

        // Make sure I can request the file
        $response = $this->get($document->url);
        $response
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8');

        // test media is attached to request
        $response = $this->get(route('api.request.show', $request));
        $response
            ->assertOk()
            ->assertJsonPath('media.0.position', $params['position'])
            ->assertJsonPath('media.0.name', $params['name']);

        // verify the mime type is text / plain, may append charset
        $data = $response->json();
        $this->assertStringStartsWith('text/plain', $data['media'][0]['mime_type']);
    }

    /**
     * Before running these tests install passport to make sure the tokens exists.
     */
    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('passport:install');
        Artisan::call('db:seed');
        // add a request
        Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\RequestSeeder',
        ]);
        // this will store a new user with random attributes in the database.
        /* @var User $user */
        $this->user   = User::factory(['password' => Hash::make('password')])->create();
        $this->member = Member::factory()->hasAddresses(1, ['is_primary' => true])->create();

        Passport::actingAs(
            $this->user
        );
    }
}
