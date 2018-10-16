const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const outputPath = path.join(__dirname, './static/');

module.exports = env => {
  const config = {
    entry: {
      index: ['@babel/polyfill', './src/index.tsx'],
      vendor: ['react', 'react-dom']
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@containers': path.resolve(__dirname, './src/containers'),
        '@styles': path.resolve(__dirname, './src/styles')
      }
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          enforce: 'pre'
        }
        // {
        //   test: /\.svg$/,
        //   include: path.join(__dirname, './src/ui/icons'),
        //   use: [
        //     {
        //       loader: 'svg-sprite-loader'
        //     }
        //   ]
        // }
      ]
    },
    plugins: []
  };

  if (env.NODE_ENV === 'production') {
    console.log('* Production Build');

    config.mode = 'production';

    // config.output.filename = '[name]-[hash].js';
    config.output = {
      path: path.join(__dirname, './static/'),
      filename: '[name]-[hash].js',
      publicPath: ''
    };

    config.devtool = 'source-map';
    config.optimization = {
      splitChunks: {
        name: 'vendor',
        filename: '[name]-[hash].js',
        minChunks: Infinity
      },
      minimizer: [new TerserWebpackPlugin()]
    };

    let htmlWebpackConfig;
    htmlWebpackConfig = {
      filename: path.join(__dirname, './static/index.html'),
      template: path.join(__dirname, './static/templates/index.html'),
      inject: false
    };

    config.plugins = [
      new CleanWebpackPlugin([
        './static/*.js',
        './static/*.js.map',
        './static/*.html'
      ]),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env.NODE_ENV),
          BABEL_ENV: JSON.stringify(env.NODE_ENV),
          HOST_ENV: env.HOST_ENV ? JSON.stringify(env.HOST_ENV) : ''
        }
      }),
      new HTMLWebpackPlugin(htmlWebpackConfig)
    ].concat(config.plugins);
  } else {
    config.mode = 'development';

    config.output = {
      path: outputPath,
      filename: 'bundle.js',
      publicPath: '/dist/'
    };

    config.devServer = {
      publicPath: config.output.publicPath,
      hot: true,
      stats: 'errors-only',
      historyApiFallback: true,
      disableHostCheck: true,
      host: '0.0.0.0',
      port: 9999,
      compress: true
    };

    config.entry = [
      'react-hot-loader/babel',
      'webpack-dev-server/client?http://0.0.0.0:9999', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './src/index.tsx' // Your appʼs entry point
    ];

    config.devtool = 'cheap-module-eval-source-map';
    config.plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      }),
      new webpack.HotModuleReplacementPlugin()
    ].concat(config.plugins);
  }

  return config;
};
