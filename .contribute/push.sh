#!/bin/bash

# Undoes live server changes so the repo can be pushed to GitHub.

mv ./production/index.js ../index.js
mv ./production/package.json ../client/package.json

git add .
