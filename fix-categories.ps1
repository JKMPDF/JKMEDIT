$root = 'd:\Github\JKMEDIT\JKMEDIT\tools'

$replacements = @(
    @{file='pdf-tools\index.html'; old='<h1>Free Online PDF Tools: Edit, Merge, Convert &amp; Compress</h1>'; new='<h1>Free PDF Tools - Merge, Split, Compress &amp; Convert Online</h1>'},
    @{file='pdf-tools\index.html'; old='<p>Easily edit, merge, split, compress, and convert PDF files online. Secure, fast, and free PDF utilities to manage your documents effortlessly.</p>'; new='<p>Work with PDFs directly in your browser. Merge, split, compress, convert, rotate, and annotate - all free, no sign-up needed.</p>'},
    @{file='pdf-tools\index.html'; old='<h2>PDF Tools - Complete Online PDF Management Suite</h2>'; new='<h2>Complete PDF Toolkit - Everything You Need in One Place</h2>'},
    @{file='pdf-tools\index.html'; old='<p>JKM Edit provides simple browser tools for merging, splitting, compressing, and editing PDFs. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Our PDF tools handle all the common tasks you run into daily. Merge multiple files into one, split large documents into smaller parts, compress files to save space, add watermarks for branding, insert page numbers, rotate pages, and convert between PDF and image formats.</p>'},
    @{file='pdf-tools\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>Every tool runs locally in your browser, so your documents never leave your device. No uploads, no waiting, no privacy concerns.</p>'},

    @{file='image-tools\index.html'; old='<h1>Online Image Tools: Resize, Compress &amp; Convert Photos</h1>'; new='<h1>Free Image Tools - Crop, Resize, Convert &amp; Edit Online</h1>'},
    @{file='image-tools\index.html'; old='<p>Optimize your photos with our free online image tools. Resize, compress, crop, and convert images to JPG, PNG, WebP, and SVG quickly without quality loss.</p>'; new='<p>Edit images right in your browser. Crop, resize, convert formats, remove backgrounds, apply filters, and more - completely free.</p>'},
    @{file='image-tools\index.html'; old='<h2>Image Tools - Complete Online Image Editing Suite</h2>'; new='<h2>Image Editing Made Simple - No Software Required</h2>'},
    @{file='image-tools\index.html'; old='<p>JKM Edit provides simple browser tools for resizing, compressing, cropping, and converting images. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Whether you need to crop a photo, resize it for social media, convert between JPG and PNG, remove a background, or adjust brightness and contrast, our image tools get it done in seconds. No downloads, no accounts, no cost.</p>'},
    @{file='image-tools\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>All processing happens locally in your browser. Your images stay private and never touch our servers.</p>'},

    @{file='finance\index.html'; old='<h1>Finance &amp; Accounting Calculators: ROI, EMI &amp; Tax Tools</h1>'; new='<h1>Free Finance &amp; Accounting Tools - Calculators, Invoices &amp; More</h1>'},
    @{file='finance\index.html'; old='<p>Manage your money with free finance and accounting tools. Calculate ROI, EMI, taxes, salary, compound interest, and business margins efficiently and accurately.</p>'; new='<p>Manage your money with free tools. Calculate EMIs, create invoices, track daily transactions, build your CV, and analyze bank statements.</p>'},
    @{file='finance\index.html'; old='<h2>Finance &amp; Accounting - Complete Online Financial Suite</h2>'; new='<h2>Financial Tools for Everyday Money Management</h2>'},
    @{file='finance\index.html'; old='<p>JKM Edit provides simple browser tools for calculating finances and managing accounting tasks. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>From calculating loan EMIs and generating professional invoices to tracking daily credit/debit transactions with our Udhar Khata ledger, these tools help you stay on top of your finances without expensive software.</p>'},
    @{file='finance\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>All calculations run in your browser. Your financial data is never stored or shared.</p>'},

    @{file='file-tools\index.html'; old='<h1>File Tools: Convert, Format &amp; Process Data Online</h1>'; new='<h1>Free File Tools - Convert, Format, Sort &amp; Process Data</h1>'},
    @{file='file-tools\index.html'; old='<p>Process your data files with free online tools. Convert CSV to JSON, format code, encode Base64, remove duplicates, sort lines, and more.</p>'; new='<p>Process text and data files online. Convert CSV to JSON, format code, encode Base64, remove duplicates, sort lines, and more.</p>'},
    @{file='file-tools\index.html'; old='<h2>File Tools - Complete Online Data Processing Suite</h2>'; new='<h2>Data Processing Tools for Developers and Power Users</h2>'},
    @{file='file-tools\index.html'; old='<p>JKM Edit provides simple browser tools for converting, formatting, and processing data files. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Our file tools handle the repetitive data tasks that eat up your time. Convert between formats, beautify messy JSON, encode and decode Base64, find and replace text, calculate hashes, and split large files into manageable chunks.</p>'},
    @{file='file-tools\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>Everything runs client-side in your browser. Your data is never uploaded or stored.</p>'},

    @{file='code-generators\index.html'; old='<h1>Code Generators: QR, Barcode, Password, UUID &amp; CSS Tools</h1>'; new='<h1>Free Code Generators - QR, Barcode, Password, UUID &amp; CSS Tools</h1>'},
    @{file='code-generators\index.html'; old='<p>Generate QR codes, barcodes, strong passwords, UUIDs, color palettes, CSS gradients, favicons, and more with our free online code generators.</p>'; new='<p>Generate QR codes, barcodes, strong passwords, UUIDs, color palettes, CSS gradients, favicons, and more - all free.</p>'},
    @{file='code-generators\index.html'; old='<h2>Code Generators - Complete Online Developer Utility Suite</h2>'; new='<h2>Developer Utilities - Generate, Convert, and Create Instantly</h2>'},
    @{file='code-generators\index.html'; old='<p>JKM Edit provides simple browser tools for generating developer code and assets. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Quickly generate QR codes for URLs or text, create barcodes for products, build strong random passwords, generate UUIDs for your database, design CSS box shadows and gradients visually, and convert HTML entities - all from one place.</p>'},
    @{file='code-generators\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>All generators run in your browser. Nothing is stored or tracked.</p>'},

    @{file='time-date\index.html'; old='<h1>Time &amp; Date Tools: Convert, Calculate &amp; Track</h1>'; new='<h1>Free Time &amp; Date Tools - Convert, Calculate &amp; Track</h1>'},
    @{file='time-date\index.html'; old='<p>Convert timestamps, calculate date differences, count down to events, track time with a stopwatch, and more with our free online time tools.</p>'; new='<p>Convert timestamps, calculate date differences, count down to events, track time with a stopwatch, and more.</p>'},
    @{file='time-date\index.html'; old='<h2>Time &amp; Date - Complete Online Time Management Suite</h2>'; new='<h2>Time and Date Utilities for Planning and Productivity</h2>'},
    @{file='time-date\index.html'; old='<p>JKM Edit provides simple browser tools for converting, calculating, and tracking time and dates. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Convert Unix timestamps to readable dates, find the exact difference between two dates, set countdown timers, use a stopwatch, convert time zones, check leap years, calculate your age, and generate calendars - all free and instant.</p>'},
    @{file='time-date\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>All tools run locally in your browser with no data collection.</p>'},

    @{file='unit-convertors\index.html'; old='<h1>Unit Converters: Length, Weight, Temperature &amp; More</h1>'; new='<h1>Free Unit Converters - Length, Weight, Temperature &amp; More</h1>'},
    @{file='unit-convertors\index.html'; old='<p>Convert between units instantly with our free online converters. Length, weight, temperature, area, volume, speed, number bases, colors, and scientific calculations.</p>'; new='<p>Convert between units instantly. Length, weight, temperature, area, volume, speed, number bases, colors, and scientific calculations.</p>'},
    @{file='unit-convertors\index.html'; old='<h2>Unit Converters - Complete Online Conversion Suite</h2>'; new='<h2>Universal Unit Conversion - Accurate and Instant</h2>'},
    @{file='unit-convertors\index.html'; old='<p>JKM Edit provides simple browser tools for converting units and performing calculations. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Convert meters to feet, kilograms to pounds, Celsius to Fahrenheit, square meters to acres, liters to gallons, km/h to mph, and much more. Also includes a scientific calculator, simple interest calculator, and HEX-RGB-HSL color converter.</p>'},
    @{file='unit-convertors\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>All conversions happen in your browser - fast, private, and free.</p>'},

    @{file='web\index.html'; old='<h1>Web &amp; UI Tools: Code Editor, Preview &amp; Sitemap Generator</h1>'; new='<h1>Free Web &amp; UI Tools - Code Editor, Preview &amp; Sitemap Generator</h1>'},
    @{file='web\index.html'; old='<p>Write and preview HTML, CSS, and JavaScript live with our free online web tools. Generate XML sitemaps for better SEO.</p>'; new='<p>Write and preview HTML, CSS, and JavaScript live. Generate XML sitemaps for better SEO.</p>'},
    @{file='web\index.html'; old='<h2>Web &amp; UI - Complete Online Development Suite</h2>'; new='<h2>Web Development Tools - Code, Preview, and Optimize</h2>'},
    @{file='web\index.html'; old='<p>JKM Edit provides simple browser tools for web development and UI design. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Write and test HTML, CSS, and JavaScript with our live code editor and preview tool. Generate XML sitemaps to help search engines discover and index all your pages.</p>'},
    @{file='web\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>All tools are browser-based with no sign-up required.</p>'},

    @{file='utilities\index.html'; old='<h1>Utilities: Chat, Screen Recorder, Color Picker &amp; More</h1>'; new='<h1>Free Utilities - Chat, Screen Recorder, Color Picker &amp; More</h1>'},
    @{file='utilities\index.html'; old='<h2>Utilities - Complete Online Everyday Tools Suite</h2>'; new='<h2>Everyday Utilities - Simple Tools for Common Tasks</h2>'},
    @{file='utilities\index.html'; old='<p>JKM Edit provides simple browser tools for everyday digital tasks. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Chat in real time, record your screen, pick colors from anywhere on screen, type in Hindi using English letters, write and format song lyrics, view WhatsApp chat backups, and extract audio from YouTube videos.</p>'},
    @{file='utilities\index.html'; old='<p>Use this section when you need a quick, reliable way to get work done from your browser, on desktop or mobile.</p>'; new='<p>All utilities are free and run in your browser with no data collection.</p>'}
)

$count = 0
foreach ($r in $replacements) {
    $file = Join-Path $root $r.file
    if (Test-Path $file) {
        $c = [System.IO.File]::ReadAllText($file)
        if ($c.Contains($r.old)) {
            $c = $c.Replace($r.old, $r.new)
            [System.IO.File]::WriteAllText($file, $c)
            $count++
        }
    }
}
Write-Host "Total replacements: $count"
