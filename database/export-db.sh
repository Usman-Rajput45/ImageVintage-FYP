#!/usr/bin/env bash
# Exports the local `visiontag` database to database/dump/
set -e
cd "$(dirname "$0")"
mongodump --uri="${MONGO_URI:-mongodb://127.0.0.1:27017/visiontag}" --out=./dump
echo "Done. Dump written to database/dump/"
