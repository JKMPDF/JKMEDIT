from pathlib import Path
import re

root = Path('.')
pattern = re.compile(r"const navItems = document\.querySelectorAll\('\.nav-item'\);\s*navItems\.forEach\(item => \{\s*const link = item\.querySelector\('\.nav-link'\);\s*link\.addEventListener\('click', \(e\) => \{\s*if \(window\.innerWidth <= 1024\) \{\s*e\.preventDefault\(\);\s*navItems\.forEach\(otherItem => \{\s*if \(otherItem !== item && otherItem\.classList\.contains\('active'\)\) \{\s*otherItem\.classList\.remove\('active'\);\s*\}\s*\}\);\s*item\.classList\.toggle\('active'\);\s*\}\s*\}\);\s*\}\);", re.MULTILINE)
replacement = "const navItems = document.querySelectorAll('.nav-item');\n            navItems.forEach(item => {\n                const link = item.querySelector('.nav-link');\n                const hasDropdown = item.querySelector('.mega-menu');\n                if (link && hasDropdown) {\n                    link.addEventListener('click', (e) => {\n                        if (window.innerWidth <= 1024) {\n                            e.preventDefault();\n                            e.stopPropagation();\n                            navItems.forEach(otherItem => {\n                                if (otherItem !== item && otherItem.classList.contains('active')) {\n                                    otherItem.classList.remove('active');\n                                }\n                            });\n                            item.classList.toggle('active');\n                        }\n                    });\n                }\n            });"

count = 0
for path in root.rglob('*.html'):
    text = path.read_text(encoding='utf-8')
    if pattern.search(text):
        text_new = pattern.sub(replacement, text)
        if text_new != text:
            path.write_text(text_new, encoding='utf-8')
            count += 1
            print('patched', path)
print('total patched', count)
