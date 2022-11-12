#!/bin/bash

red='\e[0;31m'
blue='\033[0;34m'

printAndLog "${blue}" "Starting Production Environment"

# Install dependencies with ci

printAndLog "${blue}" "Installing dependencies"

npm ci

# Start the server

printAndLog "${blue}" "Starting the server"

npm run start
