#!/bin/bash
NODE_PATH=$(which node)
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
$NODE_PATH "$SCRIPT_DIR/dist/index.js" >> "$SCRIPT_DIR/logs/output.log" 2>&1
