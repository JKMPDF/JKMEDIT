import os
import subprocess
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Path to LibreOffice on a Linux system (this is the standard path)
LIBREOFFICE_PATH = "/usr/bin/libreoffice"

# --- Main endpoint for PDF -> Word Conversion ---
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
        # --- THIS SECTION IS NOW CORRECTLY INDENTED ---
        # Define the command to run LibreOffice for conversion
        command = [
            LIBREOFFICE_PATH, 
            "--headless", 
            '--infilter=writer_pdf_import', # This is the standard filter
            "--convert-to", "docx",
            "--outdir", output_dir, 
            input_pdf
        ]
        
        # Execute the command
        result = subprocess.run(command, capture_output=True, text=True, timeout=30)

        # For debugging purposes, you can still print the output in your Render logs
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)

        # Check if the output file was created and send it back
        if os.path.exists(output_path):
            return send_file(output_path, as_attachment=True, download_name="converted.docx")
        else:
            # If conversion fails, send back the error details from LibreOffice
            error_details = result.stderr if result.stderr else "Conversion process failed without specific error."
            return jsonify({"error": "Conversion failed", "details": error_details}), 500

    except Exception as e:
        # Handle unexpected server errors (like a timeout)
        return jsonify({"error": "An unexpected server error occurred", "details": str(e)}), 500

# This part is for local testing only. Render uses Gunicorn to run the app.
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
