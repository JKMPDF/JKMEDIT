# Start with a standard Python 3.9 image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Update package lists and install necessary dependencies for Word conversion
# ttf-mscorefonts-installer provides fonts like Arial, Times New Roman, etc.
# fonts-liberation provides common open-source font alternatives.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libreoffice-writer \
    fonts-liberation \
    ttf-mscorefonts-installer \
    && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port and start the server
EXPOSE 10000
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
