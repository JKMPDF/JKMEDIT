$root = 'd:\Github\JKMEDIT\JKMEDIT\tools'

$replacements = @(
    @{file='web\index.html'; old='<p>JKM Edit provides simple browser tools for previewing websites, editing code, and checking sitemaps. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Write and test HTML, CSS, and JavaScript with our live code editor and preview tool. Generate XML sitemaps to help search engines discover and index all your pages.</p>'},
    @{file='utilities\index.html'; old='<p>JKM Edit provides simple browser tools for chat, screen recording, color tools, and media helpers. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Chat in real time, record your screen, pick colors from anywhere on screen, type in Hindi using English letters, write and format song lyrics, view WhatsApp chat backups, and extract audio from YouTube videos.</p>'},
    @{file='unit-convertors\index.html'; old='<p>JKM Edit provides simple browser tools for converting lengths, weights, volumes, and time values. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Convert meters to feet, kilograms to pounds, Celsius to Fahrenheit, square meters to acres, liters to gallons, km/h to mph, and much more. Also includes a scientific calculator, simple interest calculator, and HEX-RGB-HSL color converter.</p>'},
    @{file='time-date\index.html'; old='<p>JKM Edit provides simple browser tools for calculating dates, timezones, countdowns, and age conversions. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Convert Unix timestamps to readable dates, find the exact difference between two dates, set countdown timers, use a stopwatch, convert time zones, check leap years, calculate your age, and generate calendars - all free and instant.</p>'},
    @{file='image-tools\index.html'; old='<p>JKM Edit provides simple browser tools for cropping, resizing, converting, and editing images. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Whether you need to crop a photo, resize it for social media, convert between JPG and PNG, remove a background, or adjust brightness and contrast, our image tools get it done in seconds. No downloads, no accounts, no cost.</p>'},
    @{file='finance\index.html'; old='<p>JKM Edit provides simple browser tools for making invoices, calculating EMIs, and tracking money. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>From calculating loan EMIs and generating professional invoices to tracking daily credit/debit transactions with our Udhar Khata ledger, these tools help you stay on top of your finances without expensive software.</p>'},
    @{file='code-generators\index.html'; old='<p>JKM Edit provides simple browser tools for creating QR codes, passwords, color palettes, and quick web assets. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Quickly generate QR codes for URLs or text, create barcodes for products, build strong random passwords, generate UUIDs for your database, design CSS box shadows and gradients visually, and convert HTML entities - all from one place.</p>'},
    @{file='file-tools\index.html'; old='<p>JKM Edit provides simple browser tools for formatting text, converting files, and cleaning data. These utilities are made to help you complete everyday tasks without extra software.</p>'; new='<p>Our file tools handle the repetitive data tasks that eat up your time. Convert between formats, beautify messy JSON, encode and decode Base64, find and replace text, calculate hashes, and split large files into manageable chunks.</p>'}
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
