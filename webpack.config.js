const path = require('path');

module.exports = {
  entry: './index.js', 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist') // Output directory
  },
  mode: 'development', // or 'production' for production builds
};
