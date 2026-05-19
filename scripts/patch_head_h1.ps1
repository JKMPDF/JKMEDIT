$files = Get-ChildItem -Recurse -Include *.html,*.htm | Where-Object { $_.Name -notin @('header.html','footer.html') }
foreach ($f in $files) {
    $path = $f.FullName
    $text = Get-Content -Raw -LiteralPath $path
    $orig = $text
    $modified = $false

    # Insert viewport meta if missing
    if ($text -notmatch '(?i)<meta[^>]*name\s*=\s*["\']viewport["\']') {
        if ($text -match '(?i)<meta[^>]*charset[^>]*>') {
            $text = $text -replace '(?i)(<meta[^>]*charset[^>]*>)', "$1`r`n    <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
            $modified = $true
        } elseif ($text -match '(?i)<head[^>]*>') {
            $text = $text -replace '(?i)(<head[^>]*>)', "$1`r`n    <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
            $modified = $true
        } else {
            # fallback: insert a head before body
            $text = $text -replace '(<body[^>]*>)', "<head>`r`n    <meta name='viewport' content='width=device-width, initial-scale=1.0'>`r`n</head>`r`n$1"
            $modified = $true
        }
    }

    # Add H1 from title if missing
    if ($text -notmatch '(?i)<h1\b') {
        if ($text -match '(?i)<title>([^<]+)</title>') { $title = $Matches[1].Trim() } else { $title = [IO.Path]::GetFileNameWithoutExtension($path) }
        if ($text -match '(<body[^>]*>)') {
            $text = $text -replace '(<body[^>]*>)', "$1`r`n    <h1>$title</h1>"
        } else {
            $text = "<h1>$title</h1>`r`n" + $text
        }
        $modified = $true
    }

    # Demote extra H1s to H2s (keep the first)
    $h1Regex = [regex] '(?is)<h1[^>]*>.*?</h1>'
    $m = $h1Regex.Matches($text)
    if ($m.Count -gt 1) {
        $first = $m[0].Value
        $firstIndex = $text.IndexOf($first)
        $firstLen = $first.Length
        $before = $text.Substring(0, $firstIndex + $firstLen)
        $after = $text.Substring($firstIndex + $firstLen)
        $after = [regex]::Replace($after, '(?is)<h1([^>]*)>(.*?)</h1>', '<h2$1>$2</h2>')
        $text = $before + $after
        $modified = $true
    }

    if ($modified -and $text -ne $orig) {
        Set-Content -LiteralPath $path -Value $text -Encoding UTF8
        Write-Host "Patched: $path"
    }
}
Write-Host 'Patch run complete.'
