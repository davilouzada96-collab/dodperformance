#!/bin/sh

set -eu

rm -rf public
mkdir -p public

cp index.html app.js scientific-library-data.js styles.css favicon.svg public/
cp -R dodperoformance.main public/
cp -R clinico public/
