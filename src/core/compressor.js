/**
 * TokenCrunch - Main Compression Engine
 * Orchestrates multiple compression strategies
 */

const { TokenEstimator } = require('./tokenizer');
const { SemanticCompressor } = require('./strategies/semantic');
const { StructuralCompressor } = require('./strategies/structural');
const { estimateTokens } = require('../utils/helpers');

/**
 * Main compression engine that combines all strategies
 */
class CompressionEngine {
  constructor(options = {}) {
    this.options = {
      mode: options.mode || 'balanced', // 'conservative', 'balanced', 'aggressive'
      preserveFormat: options.preserveFormat !== false,
      maxCompression: options.maxCompression || 95,
      minQuality: options.minQuality || 70,
      ...options
    };
    
    this.tokenizer = new TokenEstimator();
    this.semantic = new SemanticCompressor({
      aggressive: this.options.mode === 'aggressive'
    });
    this.structural = new StructuralCompressor({
      aggressive: this.options.mode === 'aggressive'
    });
  }

  /**
   * Compress text with optimal strategy selection
   * @param {string} text - Input text
   * @param {object} options - Override options
   * @returns {object} Compression result
   */
  compress(text, options = {}) {
    const opts = { ...this.options, ...options };
    const originalTokens = estimateTokens(text);
    
    // Step 1: Try structural compression first
    const structuralResult = this.structural.compress(text);
    
    // Step 2: Apply semantic compression
    const semanticResult = this.semantic.compress(structuralResult.text);
    
    // Step 3: Quality check - if compression is too aggressive, roll back
    let finalText = semanticResult.text;
    let finalTokens = estimateTokens(finalText);
    
    // Ensure we don't exceed max compression
    const actualCompression = originalTokens > 0 
      ? ((originalTokens - finalTokens) / originalTokens) * 100 
      : 0;
    
    if (actualCompression > opts.maxCompression) {
      // Roll back to structural only
      finalText = structuralResult.text;
      finalTokens = estimateTokens(finalText);
    }
    
    const saved = originalTokens - finalTokens;
    const ratio = originalTokens > 0 ? ((saved / originalTokens) * 100).toFixed(1) : '0.0';
    
    return {
      text: finalText,
      originalText: text,
      originalTokens,
      compressedTokens: finalTokens,
      tokensSaved: saved,
      compressionRatio: parseFloat(ratio),
      reductionFactor: finalTokens > 0 ? (originalTokens / finalTokens).toFixed(1) : '1.0',
      format: structuralResult.format,
      mode: opts.mode,
      quality: this._estimateQuality(text, finalText)
    };
  }

  /**
   * Batch compress multiple texts
   * @param {string[]} texts - Array of texts
   * @param {object} options - Compression options
   * @returns {object[]} Array of compression results
   */
  compressBatch(texts, options = {}) {
    return texts.map(text => this.compress(text, options));
  }

  /**
   * Compress file content with format detection
   * @param {string} content - File content
   * @param {string} filename - Filename for format hint
   * @param {object} options - Compression options
   * @returns {object} Compression result
   */
  compressFile(content, filename = '', options = {}) {
    const ext = filename.split('.').pop().toLowerCase();
    const formatHints = {
      'json': { format: 'json' },
      'md': { format: 'markdown' },
      'markdown': { format: 'markdown' },
      'js': { format: 'code' },
      'ts': { format: 'code' },
      'py': { format: 'code' },
      'java': { format: 'code' },
      'go': { format: 'code' },
      'rs': { format: 'code' },
      'log': { format: 'log' },
      'txt': { format: 'text' }
    };
    
    const hint = formatHints[ext] || {};
    return this.compress(content, { ...hint, ...options });
  }

  /**
   * Estimate quality of compressed text
   * @param {string} original - Original text
   * @param {string} compressed - Compressed text
   * @returns {number} Quality score (0-100)
   */
  _estimateQuality(original, compressed) {
    if (!original || !compressed) return 0;
    
    // Check for excessive removal
    const origLines = original.split('\n').length;
    const compLines = compressed.split('\n').length;
    const lineRetention = origLines > 0 ? (compLines / origLines) : 1;
    
    // Check character retention
    const charRetention = original.length > 0 ? (compressed.length / original.length) : 1;
    
    // Quality is based on retention - too much removal = low quality
    // But some removal is expected and good
    const expectedRetention = this.options.mode === 'aggressive' ? 0.3 : 
                              this.options.mode === 'conservative' ? 0.8 : 0.5;
    
    const lineScore = Math.min(100, (lineRetention / expectedRetention) * 100);
    const charScore = Math.min(100, (charRetention / expectedRetention) * 100);
    
    return Math.round((lineScore + charScore) / 2);
  }

  /**
   * Get engine statistics
   * @returns {object} Engine info
   */
  getInfo() {
    return {
      version: require('../../package.json').version,
      mode: this.options.mode,
      strategies: ['structural', 'semantic'],
      features: [
        'Auto format detection',
        'JSON compression',
        'Markdown compression',
        'Code compression',
        'Log compression',
        'Semantic simplification',
        'Redundancy removal',
        'Number compression'
      ]
    };
  }
}

module.exports = { CompressionEngine };
