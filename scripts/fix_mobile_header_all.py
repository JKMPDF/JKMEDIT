from pathlib import Path
import re

root = Path('.')

toggle_pattern = re.compile(
    r"const m = document\.getElementById\('mobileToggle'\), n = document\.getElementById\('navMenu'\);\s*"
    r"if\(m && n\)\s*m\.onclick = \(\) => \{.*?\};",
    re.DOTALL
)

navitem_pattern = re.compile(
    r"navItems\.forEach\(item => \{\s*const link = item\.querySelector\('\.nav-link'\);\s*"
    r"if \(link\) \{\s*link\.addEventListener\('click', \(e\) => \{\s*"
    r"if \(window\.innerWidth <= 1024\) \{\s*e\.preventDefault\(\);\s*"
    r"navItems\.forEach\(otherItem => \{\s*if \(otherItem !== item && otherItem\.classList\.contains\('active'\)\) \{\s*"
    r"otherItem\.classList\.remove\('active'\);\s*\}\s*\}\);\s*item\.classList\.toggle\('active'\);\s*\}\s*\}\);\s*\}\);",
    re.DOTALL
)

replacement_toggle = (
    "const m = document.getElementById('mobileToggle'), n = document.getElementById('navMenu');\n"
    "                if (m && n) {\n"
    "                    m.onclick = () => {\n"
    "                        n.classList.toggle('active');\n"
    "                        m.innerHTML = n.classList.contains('active') ? '&#10005;' : '&#9776;';\n"
    "                    };\n"
    "                }\n"
    "                const navItems = document.querySelectorAll('.nav-item');\n"
    "                navItems.forEach(item => {\n"
    "                    const link = item.querySelector('.nav-link');\n"
    "                    const hasDropdown = item.querySelector('.mega-menu');\n"
    "                    if (link && hasDropdown) {\n"
    "                        link.addEventListener('click', (e) => {\n"
    "                            if (window.innerWidth <= 1024) {\n"
    "                                e.preventDefault();\n"
    "                                e.stopPropagation();\n"
    "                                navItems.forEach(otherItem => {\n"
    "                                    if (otherItem !== item && otherItem.classList.contains('active')) {\n"
    "                                        otherItem.classList.remove('active');\n"
    "                                    }\n"
    "                                });\n"
    "                                item.classList.toggle('active');\n"
    "                            }\n"
    "                        });\n"
    "                    }\n"
    "                });"
)

replacement_navitem = (
    "navItems.forEach(item => {\n"
    "                const link = item.querySelector('.nav-link');\n"
    "                const hasDropdown = item.querySelector('.mega-menu');\n"
    "                if (link && hasDropdown) {\n"
    "                    link.addEventListener('click', (e) => {\n"
    "                        if (window.innerWidth <= 1024) {\n"
    "                            e.preventDefault();\n"
    "                            e.stopPropagation();\n"
    "                            navItems.forEach(otherItem => {\n"
    "                                if (otherItem !== item && otherItem.classList.contains('active')) {\n"
    "                                    otherItem.classList.remove('active');\n"
    "                                }\n"
    "                            });\n"
    "                            item.classList.toggle('active');\n"
    "                        }\n"
    "                    });\n"
    "                }\n"
    "            });"
)

count = 0
for path in root.rglob('*.html'):
    text = path.read_text(encoding='utf-8', errors='ignore')
    if "fetch('https://jkmedit.in/header.html')" not in text:
        continue
    new_text = text
    new_text = toggle_pattern.sub(replacement_toggle, new_text)
    new_text = navitem_pattern.sub(replacement_navitem, new_text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        count += 1
        print('patched', path)
print('total patched', count)
