#!/bin/bash

export NODE_ENV="test"

scripts/clean.sh

echo "===> Runing Typescript Build..."
./node_modules/.bin/tsc

echo "===> Runing Tests..."
node_modules/.bin/jest --detectOpenHandles --forceExit