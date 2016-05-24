
var path = require('path');
var webpack = require('webpack');

var out = path.resolve(__dirname);
var src = path.resolve(__dirname, 'src');
var nodeModules = path.resolve(__dirname, 'node_modules');
var production = process.env.NODE_ENV === 'production';
var plugins = [];
var loaders = [];

if (production) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: {
        comments: false
      }
    })
  );
}

loaders = [
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  }, {
    test: /\.styl$/,
    loader: 'style-loader!css-loader!stylus-loader?paths=node_modules'
  }, {
    test: /\.jade$/,
    loader: 'jade'
  }, {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader',
    query: {
      plugins: ['transform-runtime'],
      presets: ['es2015', 'stage-0']
    }
  }, {
    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=application/font-woff'
  }, {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=application/octet-stream'
  }, {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file'
  }, {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=image/svg+xml'
  }, {
    test: require.resolve('backbone'),
    loader: 'expose?Backbone'
  }, {
    test: require.resolve('jquery'),
    loader: 'expose?jQuery!expose?$'
  }, {
    test: require.resolve('lodash'),
    loader: 'expose?_'
  }
];

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    main: './index'
  },
  context: src,
  output: {
    path: path.resolve(out, 'built'),
    filename: 'bundle.js'
  },
  module: {
    loaders: loaders
  },
  resolve: {
    extentions: ['.js', '.styl', '.css', '.jade', ''],
    modulesDirectories: [
      src,
      nodeModules
    ],
    alias: {
      underscore: path.resolve(nodeModules, 'lodash')
    }
  },
  plugins: plugins,
  externals: {
    girder: 'girder'
  }
};
