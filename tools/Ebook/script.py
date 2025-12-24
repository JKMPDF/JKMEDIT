import os, json

def scan(path):
    items = []
    if not os.path.exists(path): return items
    
    for entry in os.scandir(path):
        # Skip system files and the code files themselves
        if entry.name.startswith('.') or entry.name in ['script.py', 'library.json', 'index.html']:
            continue
            
        if entry.is_dir():
            items.append({
                "name": entry.name,
                "type": "folder",
                # This ensures the website looks for the image inside the folder
                "image": f"{entry.name}/cover.jpg", 
                "children": scan(entry.path)
            })
        elif entry.name.endswith(".txt"):
            with open(entry.path, 'r', encoding='utf-8', errors='ignore') as f:
                items.append({
                    "name": entry.name.replace(".txt", ""),
                    "type": "file",
                    "content": f.read()
                })
    return items

# '.' means "Scan the folder I am currently in"
data = scan(".") 
with open("library.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
