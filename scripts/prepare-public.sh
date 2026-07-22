#!/bin/sh

set -eu

stage_dir="public.tmp"

rm -rf "$stage_dir"
trap 'rm -rf "$stage_dir"' EXIT HUP INT TERM

mkdir -p "$stage_dir/clinico" "$stage_dir/dodperoformance.main"

cp \
  index.html \
  app.js \
  scientific-library-data.js \
  paper-contract.js \
  clinical-taxonomy.js \
  styles.css \
  favicon.svg \
  _headers \
  "$stage_dir/"

cp \
  clinico/index.html \
  clinico/app.js \
  clinico/styles.css \
  clinico/bench.css \
  clinico/bench.js \
  clinico/gate.js \
  clinico/output_data_1779051008.json \
  "$stage_dir/clinico/"

# ECG is the only public module under the historical URL namespace.
cp -R dodperoformance.main/ECG "$stage_dir/dodperoformance.main/"

# Replace the package only after staging has completed successfully.
rm -rf public
mv "$stage_dir" public
trap - EXIT HUP INT TERM
