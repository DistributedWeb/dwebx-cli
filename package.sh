#!/usr/bin/env sh
# couldnt figure out undocumented 'output template' mode for pkg so wrote this
# also need to include .node files until pkg supports including them in binary

NODE_ABI="node-64"
VERSION=$(node -pe "require('./package.json').version")

rm -rf dist

mkdir dist
mkdir builds/dwebx-$VERSION-linux-x64
mkdir builds/dwebx-$VERSION-macos-x64
mkdir builds/dwebx-$VERSION-win-x64

mv builds/dwebx-linux builds/dwebx-$VERSION-linux-x64/dwebx
mv builds/dwebx-macos builds/dwebx-$VERSION-macos-x64/dwebx
mv builds/dwebx-win.exe builds/dwebx-$VERSION-win-x64/dwebx.exe

cp node_modules/utp-native/prebuilds/linux-x64/$NODE_ABI.node builds/dwebx-$VERSION-linux-x64/
cp node_modules/utp-native/prebuilds/darwin-x64/$NODE_ABI.node builds/dwebx-$VERSION-macos-x64/
cp node_modules/utp-native/prebuilds/win32-x64/$NODE_ABI.node builds/dwebx-$VERSION-win-x64/

cp LICENSE builds/dwebx-$VERSION-linux-x64/
cp LICENSE builds/dwebx-$VERSION-macos-x64/
cp LICENSE builds/dwebx-$VERSION-win-x64/

cp README.md builds/dwebx-$VERSION-linux-x64/README
cp README.md builds/dwebx-$VERSION-macos-x64/README
cp README.md builds/dwebx-$VERSION-win-x64/README

cd builds
../node_modules/.bin/cross-zip dwebx-$VERSION-linux-x64 ../dist/dwebx-$VERSION-linux-x64.zip
../node_modules/.bin/cross-zip dwebx-$VERSION-macos-x64 ../dist/dwebx-$VERSION-macos-x64.zip
../node_modules/.bin/cross-zip dwebx-$VERSION-win-x64 ../dist/dwebx-$VERSION-win-x64.zip

rm -rf builds

# now travis will upload the 3 zips in dist to the release