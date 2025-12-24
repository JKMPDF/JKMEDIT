import os, json

def scan(path):
    # This function looks at every folder and file
    items = []
    for entry in os.scandir(path):
        if entry.is_dir():
            items.append({
                "name": entry.name,
                "type": "folder",
                "image": f"{path}/{entry.name}/cover.jpg", # Path to your cover
                "children": scan(entry.path) # Scan inside this folder too
            })
        elif entry.name.endswith(".txt"):
            with open(entry.path, 'r', encoding='utf-8') as f:
                items.append({
                    "name": entry.name.replace(".txt", ""),
                    "type": "file",
                    "content": f.read()
                })
    return items

# Start the scan and save to library.json
data = scan("Ebook")
with open("library.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
