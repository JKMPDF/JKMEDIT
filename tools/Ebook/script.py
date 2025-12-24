import os, json

def scan(path):
    items = []
    # Check if path exists to avoid errors
    if not os.path.exists(path): return items
    
    for entry in os.scandir(path):
        # Skip hidden files and the script/json itself
        if entry.name.startswith('.') or entry.name in ['script.py', 'library.json', 'index.html']:
            continue
            
        if entry.is_dir():
            items.append({
                "name": entry.name,
                "type": "folder",
                "image": f"{entry.name}/cover.jpg", # Path relative to the folder
                "children": scan(entry.path)
            })
        elif entry.name.endswith(".txt"):
            with open(entry.path, 'r', encoding='utf-8') as f:
                items.append({
                    "name": entry.name.replace(".txt", ""),
                    "type": "file",
                    "content": f.read()
                })
    return items

# '.' tells Python to scan the folder where this script is located
data = scan(".") 
with open("library.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
