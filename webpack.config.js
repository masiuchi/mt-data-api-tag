var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mt-data-api-tag.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: { type: 'none' }
      }
    ],
    loaders: [
      {
        test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /MTDataAPITag\.js$/,
        loader: 'expose-loader?DataAPITag'
      }
    ]
  },
  resolve: {
     extensions: ['', '.js', '.tag']
  },
  plugins: [
   new webpack.ProvidePlugin({
     riot: 'riot'
   })
  ],
  devServer: {
    contentBase: '.',
    port: 3000
  },
}
