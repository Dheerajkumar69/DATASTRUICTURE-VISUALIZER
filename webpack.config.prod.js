const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.tsx',
    // Split vendor libs for better caching
    vendor: [
      'react',
      'react-dom',
      'styled-components',
      'framer-motion'
    ]
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    publicPath: '/',
    clean: true, // Clean dist folder before each build
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                ['babel-plugin-styled-components', { 
                  displayName: false, 
                  pure: true 
                }],
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  ['cssnano', { preset: 'default' }]
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]'
        }
      }
    ]
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.logs in production
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.debug', 'console.info'],
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    
    // Code splitting configuration
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk for core React libraries
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 20,
        },
        
        // UI libraries chunk
        ui: {
          test: /[\\/]node_modules[\\/](styled-components|framer-motion|react-icons)[\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 15,
        },
        
        // Syntax highlighting chunk (large library)
        syntaxHighlighter: {
          test: /[\\/]node_modules[\\/]react-syntax-highlighter[\\/]/,
          name: 'syntax-highlighter',
          chunks: 'all',
          priority: 10,
        },
        
        // Algorithm components (lazy loaded)
        algorithms: {
          test: /[\\/]src[\\/](pages[\\/]algorithms|components[\\/]algorithms)[\\/]/,
          name: 'algorithms',
          chunks: 'async',
          priority: 5,
        },
        
        // Visualization components (lazy loaded)
        visualizations: {
          test: /[\\/]src[\\/]components[\\/]visualization[\\/]/,
          name: 'visualizations',
          chunks: 'async',
          priority: 5,
        },
        
        // Common chunk for shared utilities
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 0,
          enforce: true,
        },
      },
    },
    
    // Runtime chunk for webpack runtime
    runtimeChunk: {
      name: 'runtime',
    },
    
    // Module concatenation for better tree shaking
    concatenateModules: true,
    
    // Better tree shaking
    usedExports: true,
    sideEffects: false,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),

    // Gzip compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),

    // Environment variables
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.REACT_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    }),

    // Analyze bundle size (only when ANALYZE=true)
    ...(process.env.ANALYZE ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html',
      })
    ] : []),

    // Progress plugin for build feedback
    new webpack.ProgressPlugin(),
  ],

  // Production performance hints
  performance: {
    maxAssetSize: 250000, // 250kb
    maxEntrypointSize: 400000, // 400kb
    hints: 'warning',
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    },
  },

  // No source maps in production for smaller bundles
  devtool: false,

  // Stats configuration
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false,
    excludeAssets: /\.(map|txt|html|jpg|png|svg)$/,
  },
};