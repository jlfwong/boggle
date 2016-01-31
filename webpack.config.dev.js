var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.txt$/,
      loaders: ['raw'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.tsx?$/,
      loaders: ['regenerator', 'ts'],
      include: path.join(__dirname, 'src')
    }]
  }
};
