#!/bin/bash

printAndLog () {
    # $1 color
    # $2 message
    date=$(date '+%Y-%m-%d %H:%M:%S')
    printf "$1[${date}] $2\n\n"
    echo "[${date}] $2" >> upgrade_log
}