const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html'
      })
    ],
    configure: (webpackConfig) => {
      // Optimize chunks
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 200000, // 200kb max per chunk
            },
            algorithms: {
              test: /[\\/]src[\\/](pages|components)[\\/].*algorithms[\\/]/,
              name: 'algorithms',
              chunks: 'all',
              minChunks: 2,
            },
            datastructures: {
              test: /[\\/]src[\\/](pages|components)[\\/].*data[sS]tructures?[\\/]/,
              name: 'datastructures', 
              chunks: 'all',
              minChunks: 2,
            },
            visualization: {
              test: /[\\/]src[\\/]components[\\/]visualization[\\/]/,
              name: 'visualization',
              chunks: 'all',
              minChunks: 2,
            }
          }
        }
      };
      
      return webpackConfig;
    }
  }
};
