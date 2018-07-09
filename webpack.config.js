const path = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.join(path.resolve('.'), 'public/dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.d.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: { loader: 'ts-loader' },
      },
      {
        test: /\.glsl$/,
        use: { loader: 'raw-loader' },
      },
      {
        test: /\.glsl$/,
        use: { loader: 'glslify-loader' },
      },
    ],
  },
};
