const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = env => {
	console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
	console.log('Watch Files: ', env.watchFiles); // true
	return {
		entry: ['webpack/hot/poll?100', './src/server/main.ts'],
		watch: env.watchFiles === 'true',
		target: 'node',
		externals: [
			nodeExternals({
				whitelist: ['webpack/hot/poll?100']
			})
		],
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				}
			]
		},
		mode: env.NODE_ENV,
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.json'],
			plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new CopyWebpackPlugin([
				{
					from: path.resolve(__dirname, '../src/server/package.json'),
					to: path.resolve(
						__dirname,
						'../docker/backend/prod/dist/package.json'
					)
				}
			])
		],
		output: {
			path: path.join(__dirname, '../docker/backend/prod/dist'),
			filename: 'server.js'
		}
	};
};
