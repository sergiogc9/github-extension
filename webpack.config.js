const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { optimize } = require('webpack');
const path = require('path');

const prodPlugins = [];

if (process.env.NODE_ENV === 'production') {
	prodPlugins.push(new optimize.AggressiveMergingPlugin(), new optimize.OccurrenceOrderPlugin());
}

module.exports = {
	mode: process.env.NODE_ENV,
	devtool: 'inline-source-map',
	entry: {
		contentscript: path.join(__dirname, 'src/contentscript/contentscript.ts'),
		background: path.join(__dirname, 'src/background/background.ts')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.ts?$/,
				use: 'awesome-typescript-loader?{configFileName: "tsconfig.json"}'
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			}
		]
	},
	plugins: [
		new CheckerPlugin(),
		...prodPlugins,
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'src/contentscript/jquery/jquery.js', to: 'jquery.js' },
				{ from: 'src/contentscript/jquery/jquery-ui.js', to: 'jquery-ui.js' },
				{ from: 'src/contentscript/jquery/jquery-ui.css', to: 'jquery-ui.css' }
			]
		})
	],
	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [new TsConfigPathsPlugin()]
	}
};
