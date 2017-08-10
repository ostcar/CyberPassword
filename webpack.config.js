const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    background_scripts: './src/background_script.js',
    password_input: './src/password_input.js',
    options: './src/options.js',
    browser_action: './src/browser_action.js',
  },
  output: {
    path: path.resolve(__dirname, 'addon'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['env', {
              'targets': {
                'firefox': 54,
              },
              'modules': false,
              'loose': false,
            }]],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'static'},
      {from: 'LICENSE'},
      {from: 'README.md'},
    ]),
  ],
}
