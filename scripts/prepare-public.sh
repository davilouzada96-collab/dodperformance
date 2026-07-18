#!/bin/sh

set -eu

rm -rf public
mkdir -p public

cp index.html app.js scientific-library-data.js paper-contract.js clinical-taxonomy.js styles.css favicon.svg public/
cp -R dodperoformance.main public/
cp -R clinico public/

# /clinico is the canonical academic route. Do not publish the historical copy.
rm -rf public/dodperoformance.main/clinico
