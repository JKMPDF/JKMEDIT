# Start with a standard Python 3.9 image (which uses Debian)
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# --- START FONT INSTALLATION ---
# 1. Enable the 'contrib' and 'non-free' repositories where the font installer is located.
#    The sources format changed in recent Debian versions. This command is the modern way.
RUN sed -i 's/main/main contrib non-free/g' /etc/apt/sources.list.d/debian.sources

# 2. Automatically accept the Microsoft EULA to prevent the build from stalling.
#    This must be done BEFORE trying to install the package.
RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections

# 3. Now, update the package list and install everything in one go.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libreoffice-writer \
    fonts-liberation \
    ttf-mscorefonts-installer \
    && \
    rm -rf /var/lib/apt/lists/*
# --- END FONT INSTALLATION ---

# Copy the requirements file and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port and start the server
EXPOSE 10000
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
