import type { Configuration } from 'webpack';
import path from 'node:path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.less$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } }
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.less'],
    alias: {
      react: path.resolve(__dirname, '../renderer/node_modules/react'),
      'react-dom': path.resolve(__dirname, '../renderer/node_modules/react-dom'),
    },
  },
};
