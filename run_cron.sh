#!/bin/bash

NODE_PATH=$(which node)
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Debugging: Print Node.js version and working directory
echo "Node.js Path: $NODE_PATH" >> "$SCRIPT_DIR/logs/debug.log"
echo "Node.js Version:" >> "$SCRIPT_DIR/logs/debug.log"
$NODE_PATH -v >> "$SCRIPT_DIR/logs/debug.log"
echo "Working Directory: $(pwd)" >> "$SCRIPT_DIR/logs/debug.log"

# Load environment variables and run the script
export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
$NODE_PATH "$SCRIPT_DIR/dist/index.js" >> "$SCRIPT_DIR/logs/output.log" 2>&1
