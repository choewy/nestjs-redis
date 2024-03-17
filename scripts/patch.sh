#!/bin/bash

npm run build
npm version patch
npm publish
git push

exit 0