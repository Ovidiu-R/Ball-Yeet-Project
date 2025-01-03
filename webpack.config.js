const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	mode: 'production',
	entry: './src/index.js',
	plugins: [
	new HtmlWebpackPlugin({
		title: '',
		template: './src/index.html'
	}),
	],
	output: {
	filename: 'main.js',
	path: path.resolve(__dirname, 'dist'),
	clean: true,
	},
	module: {
		rules: [
		  {
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		  },
		  {
			test: /\.(png|svg|jpg|jpeg|gif)$/i,
			type: 'asset/resource',
		  },
		  {
			test: /\.(woff|woff2|eot|ttf|otf)$/i,
			type: 'asset/resource',
		  },
		  {
			test: /\.(mp3|wav|ogg)$/i,
			type: 'asset/resource',
		  },
		]
	  },
	  devServer: {
        static: './dist', // Directory to serve
        port: 8080,
      },
	};