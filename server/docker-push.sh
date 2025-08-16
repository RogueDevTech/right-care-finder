#!/bin/bash

# Exit on any error
set -e

# Set your image name, Docker Hub username, and tag here
IMAGE_NAME="favina-backend"  
USERNAME="favinastore"        
TAG="latest"                 
DOCKERFILE_PATH="./"    

# Stop and remove existing containers
echo "Stopping and removing existing containers..."
if ! docker-compose down; then
    echo "❌ Error: Failed to stop containers"
    exit 1
fi

# Build the Docker image
echo "Building the Docker image..."
if ! docker build -t $IMAGE_NAME $DOCKERFILE_PATH; then
    echo "❌ Error: Failed to build Docker image"
    exit 1
fi

# Log in to Docker Hub
echo "Logging into Docker Hub..."
if ! docker login; then
    echo "❌ Error: Failed to login to Docker Hub"
    exit 1
fi

# Tag the image with Docker Hub username, repository name, and tag
echo "Tagging the image..."
if ! docker tag $IMAGE_NAME $USERNAME/$IMAGE_NAME:$TAG; then
    echo "❌ Error: Failed to tag Docker image"
    exit 1
fi

# Push the image to Docker Hub
echo "Pushing the image to Docker Hub..."
if ! docker push $USERNAME/$IMAGE_NAME:$TAG; then
    echo "❌ Error: Failed to push Docker image"
    exit 1
fi

echo "✅ Image built and pushed to Docker Hub successfully!"
