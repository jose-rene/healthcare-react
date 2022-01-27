# Periscope API/Backend

## PDF Generation

* PDF configs are in configs/service@pdf
* stationary template file is in resources/views/vendor/pdf
* fonts are resources/fonts

I used providers to control which lib is used to generate libs. In controllers or jobs or anywhere you need to generate
libs. Add `App\Interfaces\ToPDF $toPDF` as a param you can see the provider here "PdfProvider"

Using the provider singleton is nice because the whole application uses one instance of the PDFLib code and if we switch
away from pdf lib that is the only place to make the change.

Sample usage:

```injectablephp
$template = <<<TEMPLATE
<p>TEST PDF FILE</p>
TEMPLATE;


$pdf  = $toPDF
    ->setData([
       'author' => 'test author',
       'content' => $template,
       'template' => 'Periscope_Letterhead.pdf',
      'pwd' => '',
    ])
    ->toReport();
```

That will generate the pdf file, you can choose to do whatever you'd like with the contents.

To output the pdf file to the browser without downloading use this sample code:

```injectablephp
    return response()->make($pdf, 200, [
        'Content-Type'        => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $filename . '"',
    ]);
```

### Install PDFLib

**On LINUX**

Before you run `sudo pecl install pdflib` you need to download pdflib.h

//UPDATE_ME:: I stumbled a little to install pdflib.h but instructions start here
https://www.pdflib.com/download/pdflib-product-family/

### Docker

Laravel offers sail as a wrapper for docker.

#### Note:

If you set up the alias then to run application commands like `php artisan migrate:fresh --seed` you'd
run `sail migrate:fresh --seed`
If you want to run artisan commands or commands in the sail(docker) image then you run `sail` instead of `php artisan`

Links:

* [Setting up the alis](https://laravel.com/docs/8.x/sail#configuring-a-bash-alias)
* [Sail commands](https://laravel.com/docs/8.x/sail#executing-artisan-commands)
