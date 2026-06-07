/**
 * TokenCrunch - Token Estimator
 * Provides accurate token count estimation without external dependencies
 */

const { estimateTokens } = require('../utils/helpers');

/**
 * Simple tokenizer for estimating token counts
 * Simulates behavior similar to GPT/claude tokenizers
 */
class TokenEstimator {
  constructor() {
    // Common token merge patterns (simulating BPE-like behavior)
    this.commonPrefixes = [
      'ing', 'tion', 'ment', 'ness', 'able', 'ible', 'ful', 'less',
      'est', 'er', 'or', 'ist', 'ism', 'ize', 'ise', 'ify',
      'un', 're', 'in', 'dis', 'over', 'under', 'out', 'up',
      'th', 'st', 'nd', 'rd', 'the', 'and', 'for', 'are',
      'http', 'https', 'www', 'com', 'org', 'json', 'api'
    ];
    
    // Special token patterns that typically count as single tokens
    this.specialTokens = [
      '\n\n', '\n', '    ', '   ', '  ',
      '===', '---', '```', '***',
      '=>', '->', '===', '!==', '>=', '<=', '++', '--',
      '//', '/*', '*/', '##', '**', '__'
    ];
  }

  /**
   * Estimate token count for text
   * @param {string} text - Input text
   * @returns {number} Estimated token count
   */
  estimate(text) {
    return estimateTokens(text);
  }

  /**
   * Get detailed token breakdown
   * @param {string} text - Input text
   * @returns {object} Detailed breakdown
   */
  analyze(text) {
    const total = this.estimate(text);
    const chars = text.length;
    const lines = text.split('\n').length;
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    
    return {
      estimatedTokens: total,
      characters: chars,
      lines,
      words,
      avgTokensPerWord: words > 0 ? (total / words).toFixed(2) : '0.00',
      avgTokensPerLine: lines > 0 ? (total / lines).toFixed(2) : '0.00'
    };
  }

  /**
   * Compare two texts' token counts
   * @param {string} original - Original text
   * @param {string} compressed - Compressed text
   * @returns {object} Comparison result
   */
  compare(original, compressed) {
    const origTokens = this.estimate(original);
    const compTokens = this.estimate(compressed);
    const saved = origTokens - compTokens;
    const ratio = origTokens > 0 ? ((saved / origTokens) * 100).toFixed(1) : '0.0';
    
    return {
      originalTokens: origTokens,
      compressedTokens: compTokens,
      tokensSaved: saved,
      compressionRatio: parseFloat(ratio),
      reductionFactor: compTokens > 0 ? (origTokens / compTokens).toFixed(1) : '1.0'
    };
  }
}

module.exports = { TokenEstimator };
