from pathlib import Path
import re
root = Path('.')
pattern = re.compile(r"const navItems = document\.querySelectorAll\('\.nav-item'\);.*?e\.preventDefault\(\);.*?item\.classList\.toggle\('active'\);", re.S)
remaining = []
for path in root.rglob('*.html'):
    text = path.read_text(encoding='utf-8', errors='ignore')
    if pattern.search(text):
        remaining.append(path)
print('remaining files', len(remaining))
for p in remaining[:100]:
    print(p)
