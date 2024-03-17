#!/bin/bash

npm run build
npm version major
npm publish
git push

exit 0