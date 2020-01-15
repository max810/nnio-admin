#!/usr/bin/env sh

echo $1
git checkout backend_dev
git add .
git s
git commit -m "$1"
git push github backend_dev
git checkout master
git merge backend_dev
npm run build
git add .
git s
git commit -m 'Updated deploy files'
git push github master