#!/bin/bash

# Deploy the API Gateway first
cd gateway
serverless deploy
sleep 5s

# Deploy the user-service
cd ../user-service
serverless deploy
sleep 5s

# Add additional services deployment as needed
# cd ../another-service
# serverless deploy
# sleep 5s

echo "Deployment complete. Press any key to exit."
read -n 1