#!/bin/bash
NODE_PATH=$(which node)
export $(grep -v '^#' .env | xargs)

$NODE_PATH ./index.js >> ./logs/output.log 2>&1
