$files = Get-ChildItem -Recurse -Include *.html,*.htm | Where-Object { $_.Name -notin @('header.html','footer.html') }
foreach ($f in $files) {
    $text = Get-Content -Raw -LiteralPath $f.FullName
    $orig = $text
    $modified = $false

    if ($text -notmatch '(?i)<meta[^>]*name\s*=\s*["\'']viewport["\'']') {
        if ($text -match '(?i)<meta[^>]*charset[^>]*>') {
            $text = [regex]::Replace($text, '(?i)(<meta[^>]*charset[^>]*>)', '$1`r`n    <meta name=''viewport'' content=''width=device-width, initial-scale=1.0''>')
        } elseif ($text -match '(?i)<head[^>]*>') {
            $text = [regex]::Replace($text, '(?i)(<head[^>]*>)', '$1`r`n    <meta name=''viewport'' content=''width=device-width, initial-scale=1.0''>')
        } else {
            $text = [regex]::Replace($text, '(<body[^>]*>)', '<head>`r`n    <meta name=''viewport'' content=''width=device-width, initial-scale=1.0''>`r`n</head>`r`n$1')
        }
        $modified = $true
    }

    if ($text -notmatch '(?i)<h1\b') {
        if ($text -match '(?i)<title>([^<]+)</title>') {
            $title = $Matches[1].Trim()
        } else {
            $title = [IO.Path]::GetFileNameWithoutExtension($f.FullName)
        }
        if ($text -match '(?i)(<body[^>]*>)') {
            $text = [regex]::Replace($text, '(?i)(<body[^>]*>)', '$1`r`n    <h1>' + $title + '</h1>', 1)
        } else {
            $text = '<h1>' + $title + '</h1>`r`n' + $text
        }
        $modified = $true
    }

    $h1s = [regex]::Matches($text, '(?is)<h1\b[^>]*>.*?</h1>')
    if ($h1s.Count -gt 1) {
        $first = $h1s[0]
        $pos = $first.Index + $first.Length
        $before = $text.Substring(0, $pos)
        $after = $text.Substring($pos)
        $after = [regex]::Replace($after, '(?is)<h1([^>]*)>(.*?)</h1>', '<h2$1>$2</h2>')
        $text = $before + $after
        $modified = $true
    }

    if ($modified -and $text -ne $orig) {
        Set-Content -LiteralPath $f.FullName -Value $text -Encoding UTF8
        Write-Host "Patched: $($f.FullName)"
    }
}
Write-Host 'Patch run complete.'
