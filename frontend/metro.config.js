const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Enable tree shaking and optimize bundle size
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_style: 3,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  warnings: false,
};

// Optimize resolver for smaller bundles
config.resolver.platforms = ['native', 'android', 'ios'];

// Enable asset optimization
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = withNativeWind(config, { input: './global.css' });