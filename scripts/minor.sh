#!/bin/bash

npm run build
npm version minor
npm publish
git push

exit 0