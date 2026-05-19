from pathlib import Path
import re

root = Path('.')
files = list(root.rglob('*.html')) + list(root.rglob('*.htm'))
exclude = {'header.html','footer.html'}
patched = 0
for f in files:
    if f.name in exclude:
        continue
    text = f.read_text(encoding='utf-8')
    orig = text
    low = text.lower()
    # viewport
    if 'name="viewport' not in low and "name='viewport" not in low and 'viewport' not in low:
        if re.search(r'<meta[^>]*charset', text, re.I):
            text = re.sub(r'(<meta[^>]*charset[^>]*>)', r"\1\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">", text, flags=re.I)
        elif re.search(r'<head[^>]*>', text, re.I):
            text = re.sub(r'(<head[^>]*>)', r"\1\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">", text, flags=re.I)
        else:
            text = re.sub(r'(<body[^>]*>)', r"<head>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n</head>\n\1", text, flags=re.I)

    # add H1 if missing
    if not re.search(r'<h1\b', text, re.I):
        m = re.search(r'<title>([^<]+)</title>', text, re.I)
        title = m.group(1).strip() if m else f.stem
        if re.search(r'(<body[^>]*>)', text, re.I):
            text = re.sub(r'(<body[^>]*>)', r"\1\n    <h1>%s</h1>" % title, text, count=1, flags=re.I)
        else:
            text = f"<h1>{title}</h1>\n" + text

    # demote extra H1s to H2s (keep the first)
    h1s = list(re.finditer(r'<h1\b[^>]*>.*?</h1>', text, re.I | re.S))
    if len(h1s) > 1:
        first = h1s[0]
        pos = first.end()
        before = text[:pos]
        after = text[pos:]
        after = re.sub(r'<h1([^>]*)>(.*?)</h1>', r'<h2\1>\2</h2>', after, flags=re.I | re.S)
        text = before + after

    if text != orig:
        f.write_text(text, encoding='utf-8')
        print('Patched:', f)
        patched += 1

print('Patch run complete. Files patched:', patched)
