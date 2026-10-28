#!/usr/bin/env bash
# Restores database/dump/ into the local `visiontag` database
set -e
cd "$(dirname "$0")"
mongorestore --uri="${MONGO_URI:-mongodb://127.0.0.1:27017}" --drop ./dump
echo "Done. Database restored."
