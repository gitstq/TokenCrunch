/"use strict";

/**
 * TokenCrunch - Main Entry Point
 * Programmatic API for TokenCrunch
 */

const { CompressionEngine } = require('./core/compressor');
const { CompressionProxy } = require('./proxy/middleware');
const { TokenEstimator } = require('./core/tokenizer');
const { 
  generateReport, 
  generateBatchReport, 
  generateJSONReport,
  generateMarkdownReport 
} = require('./utils/reporter');

/**
 * Quick compress function
 * @param {string} text - Text to compress
 * @param {object} options - Compression options
 * @returns {object} Compression result
 */
function compress(text, options = {}) {
  const engine = new CompressionEngine(options);
  return engine.compress(text);
}

/**
 * Quick compress file
 * @param {string} content - File content
 * @param {string} filename - Filename for format detection
 * @param {object} options - Compression options
 * @returns {object} Compression result
 */
function compressFile(content, filename, options = {}) {
  const engine = new CompressionEngine(options);
  return engine.compressFile(content, filename, options);
}

/**
 * Create compression engine instance
 * @param {object} options - Engine options
 * @returns {CompressionEngine} Engine instance
 */
function createEngine(options = {}) {
  return new CompressionEngine(options);
}

/**
 * Create proxy instance
 * @param {object} options - Proxy options
 * @returns {CompressionProxy} Proxy instance
 */
function createProxy(options = {}) {
  return new CompressionProxy(options);
}

/**
 * Estimate tokens in text
 * @param {string} text - Text to analyze
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  const estimator = new TokenEstimator();
  return estimator.estimate(text);
}

/**
 * Analyze text tokens in detail
 * @param {string} text - Text to analyze
 * @returns {object} Detailed analysis
 */
function analyze(text) {
  const estimator = new TokenEstimator();
  return estimator.analyze(text);
}

module.exports = {
  // Core functions
  compress,
  compressFile,
  createEngine,
  createProxy,
  estimateTokens,
  analyze,
  
  // Classes
  CompressionEngine,
  CompressionProxy,
  TokenEstimator,
  
  // Reporters
  generateReport,
  generateBatchReport,
  generateJSONReport,
  generateMarkdownReport,
  
  // Version
  version: require('../package.json').version
};
