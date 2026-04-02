#!/bin/bash

# Generate self-signed SSL certificates for development
mkdir -p nginx/ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=DevOps Demo/CN=localhost"

echo "SSL certificates generated in nginx/ssl/"
echo "Note: These are self-signed certificates for development only!"
echo "Browsers will show security warnings - this is expected."
