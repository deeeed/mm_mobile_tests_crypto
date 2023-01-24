/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const commLayer =
  '/Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk-communication-layer/';
const sdk = '/Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk/';

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // watchFolders: [commLayer, sdk],
  resolver: {
    nodeModulesPaths: [
      // '/Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk-communication-layer/',
      // '/Users/arthurbreton/Projects/metamask/metamask-sdk/packages/sdk/',
    ],
    extraNodeModules: {
      ...require('node-libs-react-native'),
      // crypto: require.resolve('react-native-quick-crypto'),
      // url: require.resolve('whatwg-url'),
    },
    // resolveRequest: (context, moduleName, platform) => {
    // if (moduleName.indexOf('sdk-communication-layer') !== -1) {
    //   console.debug(`CUSTOM RESOLVER ${moduleName}`);
    //   // Logic to resolve the module name to a file path...
    //   // NOTE: Throw an error if there is no resolution.
    //   return {
    //     filePath:
    //       commLayer +
    //       'dist/react-native/es/metamask-sdk-communication-layer.js',
    //     type: 'sourceFile',
    //   };
    // } else if (moduleName.indexOf('@metamask/sdk') !== -1) {
    //   console.debug(`CUSTOM RESOLVER ${moduleName}`);
    //   return {
    //     filePath: sdk + 'dist/react-native/es/metamask-sdk.js',
    //     type: 'sourceFile',
    //   };
    // }
    // Optionally, chain to the standard Metro resolver.
    //   return context.resolveRequest(context, moduleName, platform);
    // },
  },
};
