module.exports = (env = {}) => ({
	entry: './index.jsx',
	output: {
		path: __dirname,
		filename: 'index.js',
	},
	devtool: env.production ? 'source-map' : 'cheap-module-eval-source-map',
	module: {
		rules: [{
			test: /\.jsx$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						['env', {
							targets: [
								'last 2 Chrome versions',
							],
						}],
					],
					plugins: [
						['transform-react-jsx', {
							pragma: 'm',
						}],
					],
				},
			},
			exclude: /node_modules/,
		}],
	},
});
