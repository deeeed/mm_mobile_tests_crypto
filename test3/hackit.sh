#!/bin/bash
rm -rf node_modules/@metamask/sdk-communication-layer
rm -rf node_modules/@metamask/sdk
cp -rf /Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk-communication-layer node_modules/@metamask
cp -rf /Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk node_modules/@metamask
# yarn add file:/Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk-communication-layer 
# yarn add file:/Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk
# yarn wml add /Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk-communication-layer node_modules/@metamask/sdk-communication-layer
# yarn wml start
yarn rn-nodeify --hack --install --yarn   