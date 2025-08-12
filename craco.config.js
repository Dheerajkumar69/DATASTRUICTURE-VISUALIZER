const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Enable code splitting optimizations
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // Separate vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Separate React and related libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              name: 'react-vendor',
              chunks: 'all',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Separate animations and UI libraries
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion|styled-components)[\\/]/,
              name: 'animations-vendor',
              chunks: 'all',
              priority: 12,
              reuseExistingChunk: true,
            },
            // Separate syntax highlighting
            syntax: {
              test: /[\\/]node_modules[\\/](react-syntax-highlighter|prismjs)[\\/]/,
              name: 'syntax-vendor',
              chunks: 'all',
              priority: 12,
              reuseExistingChunk: true,
            },
            // Group data structure pages
            dataStructures: {
              test: /[\\/]src[\\/]pages[\\/]dataStructures[\\/]/,
              name: 'data-structures',
              chunks: 'all',
              priority: 8,
              reuseExistingChunk: true,
            },
            // Group algorithm pages
            algorithms: {
              test: /[\\/]src[\\/]pages[\\/]algorithms[\\/]/,
              name: 'algorithms',
              chunks: 'all',
              priority: 8,
              reuseExistingChunk: true,
            },
            // Group sorting algorithms
            sorting: {
              test: /[\\/]src[\\/]pages[\\/]algorithms[\\/]sorting[\\/]/,
              name: 'sorting-algorithms',
              chunks: 'all',
              priority: 9,
              reuseExistingChunk: true,
            },
            // Group graph algorithms
            graphAlgorithms: {
              test: /[\\/]src[\\/]pages[\\/]algorithms[\\/]graph[\\/]/,
              name: 'graph-algorithms',
              chunks: 'all',
              priority: 9,
              reuseExistingChunk: true,
            },
            // Group problem pages
            problems: {
              test: /[\\/]src[\\/]pages[\\/]algorithms[\\/]problems[\\/]/,
              name: 'problem-algorithms',
              chunks: 'all',
              priority: 9,
              reuseExistingChunk: true,
            },
            // Common utilities
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
        runtimeChunk: {
          name: 'runtime',
        },
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      };

      // Add compression plugins for production
      if (env === 'production') {
        webpackConfig.plugins.push(
          // Gzip compression
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8,
          }),
          // Brotli compression
          new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
              level: 11,
            },
            threshold: 8192,
            minRatio: 0.8,
          })
        );
      }

      // Add bundle analyzer for analysis
      if (process.env.ANALYZE === 'true') {
        webpackConfig.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: true,
          })
        );
      }

      // Optimize resolve
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        alias: {
          ...webpackConfig.resolve.alias,
          '@': path.resolve(__dirname, 'src'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@pages': path.resolve(__dirname, 'src/pages'),
          '@utils': path.resolve(__dirname, 'src/utils'),
          '@hooks': path.resolve(__dirname, 'src/hooks'),
          '@types': path.resolve(__dirname, 'src/types'),
          '@themes': path.resolve(__dirname, 'src/themes'),
        },
        modules: ['node_modules', path.resolve(__dirname, 'src')],
      };

      // Add performance hints
      if (env === 'production') {
        webpackConfig.performance = {
          maxAssetSize: 500000,
          maxEntrypointSize: 500000,
          hints: 'warning',
        };
      }

      return webpackConfig;
    },
  },
  // Disable source maps in production for smaller builds
  devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
  // Add TypeScript path mapping
  typescript: {
    enableTypeChecking: true,
  },
};
