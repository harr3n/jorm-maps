#!/bin/bash

# Source nvm to load Node.js installed by nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the Node.js version specified in .nvmrc
nvm install > /dev/null 2>&1  # Ensures the version is installed
nvm use > /dev/null 2>&1     # Activates the version specified in .nvmrc

# Set the script directory
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Debugging: Confirm Node path and version
NODE_PATH=$(which node)
echo "Using Node: $NODE_PATH" >> "$SCRIPT_DIR/logs/debug.log"
$NODE_PATH -v >> "$SCRIPT_DIR/logs/debug.log"

# Load environment variables from .env
export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)

# Run the Node.js script
$NODE_PATH "$SCRIPT_DIR/dist/index.js" >> "$SCRIPT_DIR/logs/output.log" 2>&1
