const path = require('path');

module.exports = {
  entry: './index.js',  // Adjust to your entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "C:/Users/USER/Desktop/nodeapp_test-master/JenkinsKubernetes/node_modules",
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    fallback: {
      "buffer": false,
      "fs": false, // 'fs' cannot be polyfilled in the browser
      "path":false,
      "stream": false,
      //"querystring": require.resolve("querystring-es3"),
      "http": false,
      "querystring": false,
      "crypto": false,
      "zlib": false,
      "net":false,
      "async_hooks":false,
      
    }
  },
  
  mode: 'development',
};
