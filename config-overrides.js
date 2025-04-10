const webpack = require('webpack');

module.exports = {
  webpack: (config, env) => {
    // Adiciona o polyfill para o Buffer
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer')
    };

    // Define o Buffer global
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  }
};
