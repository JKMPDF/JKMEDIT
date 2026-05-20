$root = 'd:\Github\JKMEDIT\JKMEDIT'
$files = Get-ChildItem -Path $root -Recurse -Filter '*.html'
$count = 0

foreach ($file in $files) {
    $c = [System.IO.File]::ReadAllText($file.FullName)
    $orig = $c
    
    $c = $c.Replace('Combine multiple files easily with this Merge PDF tool.', 'Combine multiple PDFs into a single document in seconds.')
    $c = $c.Replace('Separate pages or files quickly with our Split PDF.', 'Extract or split pages from any PDF with ease.')
    $c = $c.Replace('Reduce file size and dimensions using Compress PDF.', 'Shrink PDF file size without losing quality.')
    $c = $c.Replace('Protect your files by adding a custom watermark.', 'Add text or image watermarks to protect your documents.')
    $c = $c.Replace('Read and inspect your files using View PDF.', 'Open and read PDFs directly in your browser.')
    $c = $c.Replace('Convert and edit image formats with PDF to JPG.', 'Convert PDF pages into high-quality JPG images.')
    $c = $c.Replace('Convert and edit image formats with JPG to PDF.', 'Turn your JPG images into a clean PDF file.')
    $c = $c.Replace('Toggle dark mode for comfortable reading.', 'Switch to a dark theme for easier reading at night.')
    $c = $c.Replace('Use our free online PDF auto scroll utility tool.', 'Auto-scroll through PDFs hands-free while reading.')
    $c = $c.Replace('Advanced text and document manipulation with PDF note Pad.', 'Annotate and add notes directly on your PDF pages.')
    $c = $c.Replace('Easily add page numbers to your files.', 'Insert page numbers into your PDF with custom positioning.')
    $c = $c.Replace('Change the orientation of your files with Rotate PDF.', 'Rotate individual or all pages in your PDF instantly.')
    $c = $c.Replace('Convert and edit image formats with Image Cropper.', 'Crop images to any size or aspect ratio with precision.')
    $c = $c.Replace('Reduce file size and dimensions using Image Resizer.', 'Resize images by dimensions or percentage instantly.')
    $c = $c.Replace('Convert and edit image formats with JPG/PNG convertor.', 'Convert between JPG and PNG formats in one click.')
    $c = $c.Replace('Remove or change backgrounds instantly.', 'Remove image backgrounds automatically, no manual work.')
    $c = $c.Replace('Change the orientation of your files with Rotate & Flip.', 'Rotate or mirror-flip images in any direction.')
    $c = $c.Replace('Advanced text and document manipulation with Add text Overlay.', 'Place custom text on top of your images with style control.')
    $c = $c.Replace('Read and inspect your files using Exif Data Viewer.', 'View hidden metadata like camera settings and location from photos.')
    $c = $c.Replace('Manage your finances with Accounting Software.', 'Full-featured accounting tool for tracking income and expenses.')
    $c = $c.Replace('Manage your finances with Invoice maker.', 'Create professional invoices with your branding and send them out.')
    $c = $c.Replace('Perform precise calculations with EMI Calculator.', 'Calculate monthly EMI payments for any loan amount and tenure.')
    $c = $c.Replace('Manage your finances with Bank Analysis.', 'Analyze bank statements and reconcile transactions easily.')
    $c = $c.Replace('Build a professional CV/Resume.', 'Build a polished CV or resume with ready-to-use templates.')
    $c = $c.Replace('Manage your day to day transaction', 'Track daily credit and debit transactions with a digital ledger.')
    $c = $c.Replace('Advanced text and document manipulation with Text Case Convertor.', 'Switch text between uppercase, lowercase, title case, and more.')
    $c = $c.Replace('Use our free online Remove duplicates lines utility tool.', 'Strip out repeated lines from any text list instantly.')
    $c = $c.Replace('Advanced text and document manipulation with Find/Replace Text.', 'Search and replace words or phrases across large blocks of text.')
    $c = $c.Replace('Advanced text and document manipulation with Calculate text hash.', 'Generate MD5, SHA-1, SHA-256 hashes for any text input.')
    $c = $c.Replace('Read and inspect your files using Find Reader/viewer.', 'Open and preview text files, code, and documents in-browser.')
    $c = $c.Replace('Reduce file size and dimensions using Line shorter.', 'Sort lines alphabetically, numerically, or by length.')
    $c = $c.Replace('Separate pages or files quickly with our File Splitter.', 'Break large text or data files into smaller, manageable chunks.')
    $c = $c.Replace('Advanced text and document manipulation with Password Generators.', 'Create strong, random passwords with customizable length and rules.')
    $c = $c.Replace('Use our free online UUID/GUID Generators utility tool.', 'Generate unique identifiers for databases, APIs, and development.')
    $c = $c.Replace('Read and inspect your files using Favicon Preview/ Gen.', 'Generate and preview favicon icons for your website tabs.')
    $c = $c.Replace('Generate and scan QR/Bar codes easily.', 'Scan QR codes and export the data directly into an Excel sheet.')
    $c = $c.Replace('Use our free online Leap Year Checker utility tool.', 'Check whether any given year is a leap year or not.')
    $c = $c.Replace('Perform precise calculations with Day of week calculator.', 'Find out which day of the week any date falls on.')
    $c = $c.Replace('Perform precise calculations with Age Calculator.', 'Calculate your exact age in years, months, and days.')
    $c = $c.Replace('Use our free online Calender Generator utility tool.', 'Generate a printable monthly or yearly calendar for any year.')
    $c = $c.Replace('Use our free online Length Convertor utility tool.', 'Convert between meters, feet, inches, kilometers, miles, and more.')
    $c = $c.Replace('Use our free online Mass/Weight Convertor utility tool.', 'Switch between kilograms, pounds, ounces, grams, and tons.')
    $c = $c.Replace('Use our free online Tempture convertor utility tool.', 'Convert between Celsius, Fahrenheit, and Kelvin instantly.')
    $c = $c.Replace('Use our free online Area Convertor utility tool.', 'Convert square meters, acres, hectares, square feet, and more.')
    $c = $c.Replace('Use our free online Volume Convertor utility tool.', 'Convert liters, gallons, milliliters, cubic meters, and fluid ounces.')
    $c = $c.Replace('Use our free online Speed convertor utility tool.', 'Convert between km/h, mph, knots, and meters per second.')
    $c = $c.Replace('Use our free online Base Convertor utility tool.', 'Convert numbers between binary, octal, decimal, and hexadecimal.')
    $c = $c.Replace('Pick and convert colors for your UI designs.', 'Create harmonious color schemes for your design projects.')
    $c = $c.Replace('Perform precise calculations with Scientific Calculator.', 'Perform advanced math with trigonometric, logarithmic, and exponential functions.')
    $c = $c.Replace('Perform precise calculations with Simple Interest calculator.', 'Calculate simple interest based on principal, rate, and time period.')
    $c = $c.Replace('Read and inspect your files using Web Code Preview.', 'Preview HTML, CSS, and JavaScript code output live in your browser.')
    $c = $c.Replace('Generate XML sitemaps for SEO.', 'Generate XML sitemaps to help search engines index your site.')
    $c = $c.Replace('Engage and manage conversations.', 'Real-time messaging tool for quick conversations and collaboration.')
    $c = $c.Replace('Use our free online Hindi to Hinglish utility tool.', 'Type in Hindi using English letters - converts as you type.')
    $c = $c.Replace('Record and manipulate video content.', 'Record your screen, tab, or window with audio - no install needed.')
    $c = $c.Replace('Format, convert, and generate developer code.', 'Format, convert, and generate developer code.')
    
    if ($c -ne $orig) {
        [System.IO.File]::WriteAllText($file.FullName, $c)
        $count++
    }
}

Write-Host "Updated $count files"
