#!/bin/sh

set -eu

stage_dir="dist.tmp"

rm -rf "$stage_dir"
trap 'rm -rf "$stage_dir"' EXIT HUP INT TERM

test -d public
test -f sites-worker.js

mkdir -p "$stage_dir/client" "$stage_dir/server"
cp -R public/. "$stage_dir/client/"
cp sites-worker.js "$stage_dir/server/index.js"

rm -rf dist
mv "$stage_dir" dist
trap - EXIT HUP INT TERM
