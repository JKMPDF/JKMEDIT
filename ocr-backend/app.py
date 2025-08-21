import os
import subprocess
from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Path to LibreOffice on a Linux system (this is the standard path)
LIBREOFFICE_PATH = "/usr/bin/libreoffice"

# HTML Upload Page
HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
  <title>PDF to Word Converter</title>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f9; }
    .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; }
    h2 { color: #333; }
    input[type="file"] { border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
    button { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 1rem; }
    button:hover { background-color: #0056b3; }
    #message { margin-top: 1rem; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Upload PDF to Convert to Word</h2>
    <form id="uploadForm" enctype="multipart/form-data">
      <input type="file" name="file" id="file" required accept=".pdf">
      <br>
      <button type="submit">Convert</button>
    </form>
    <p id="message"></p>
  </div>
  <script>
    document.getElementById("uploadForm").onsubmit = async (e) => {
      e.preventDefault();
      const messageEl = document.getElementById("message");
      const fileInput = document.getElementById("file");
      
      messageEl.innerText = "Uploading and converting, please wait...";

      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      try {
        let res = await fetch("/convert", { method: "POST", body: formData });
        
        if (res.ok) {
          messageEl.innerText = "Conversion successful! Downloading...";
          let blob = await res.blob();
          let link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileInput.files[0].name.replace(".pdf", ".docx");
          link.click();
        } else {
          messageEl.innerText = "Error: Conversion failed on the server.";
        }
      } catch (error) {
        messageEl.innerText = "A network error occurred. Please try again.";
      }
    };
  </script>
</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(HTML_PAGE)

@app.route("/convert", methods=["POST"])
def convert():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    
    # Use a temporary directory which is standard on Linux servers
    temp_dir = "/tmp"
    input_pdf = os.path.join(temp_dir, "input.pdf")
    file.save(input_pdf)
    
    output_dir = temp_dir
    # LibreOffice creates an output file with the same name but different extension
    output_path = os.path.join(output_dir, "input.docx")

    # Clean up old output file if it exists
    if os.path.exists(output_path):
        os.remove(output_path)

    try:
     # The original command
command = [
    LIBREOFFICE_PATH, 
    "--headless", 
    '--infilter=writer_pdf_import', # This is the standard filter
    "--convert-to", "docx",
    "--outdir", output_dir, 
    input_pdf
]
        result = subprocess.run(command, capture_output=True, text=True, timeout=30)

        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)

        if os.path.exists(output_path):
            return send_file(output_path, as_attachment=True, download_name="converted.docx")
        else:
            return jsonify({"error": "Conversion failed", "details": result.stderr}), 500

    except Exception as e:
        return jsonify({"error": "An unexpected server error occurred", "details": str(e)}), 500

# This part is for local testing only. Render will use Gunicorn to run the app.
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
