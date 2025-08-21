# Start with a standard Python 3.9 image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Update package lists and install LibreOffice
RUN apt-get update && apt-get install -y libreoffice-writer --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port that Gunicorn will run on
EXPOSE 10000

# The command to start the web server when the container launches
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "--workers", "1", "--timeout", "120", "app:app"]
