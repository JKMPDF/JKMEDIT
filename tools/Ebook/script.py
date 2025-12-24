import os, json

def scan(path, base_path=""):
    items = []
    if not os.path.exists(path): return items
    
    # Sort to keep folders A, B, C in order
    for entry in sorted(os.scandir(path), key=lambda e: e.name):
        if entry.name.startswith('.') or entry.name in ['script.py', 'library.json', 'index.html']:
            continue
            
        # Create a relative path for the website to find images
        rel_path = os.path.join(base_path, entry.name).replace("\\", "/")

        if entry.is_dir():
            items.append({
                "name": entry.name,
                "type": "folder",
                "image": f"{rel_path}/cover.jpg",
                "path": rel_path,
                "children": scan(entry.path, rel_path)
            })
        elif entry.name.endswith(".txt"):
            with open(entry.path, 'r', encoding='utf-8', errors='ignore') as f:
                items.append({
                    "name": entry.name.replace(".txt", ""),
                    "type": "file",
                    "content": f.read()
                })
    return items

# Start scanning from current directory
data = scan(".") 
with open("library.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
