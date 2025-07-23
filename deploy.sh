#!/usr/bin/bash

echo "Pulling latest changes.."

git pull origin master

echo "deleting previous pm2 instance.."

pm2 stop index
pm2 delete index

echo "Updating dependencies"

npm audit
npm update
npm install

echo "creating a new pm2 instance"

pm2 start backend/index.js