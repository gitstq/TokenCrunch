/**
 * TokenCrunch - Semantic Compression Strategy
 * Preserves meaning while reducing token count through intelligent text transformation
 */

const { estimateTokens } = require('../../utils/helpers');

/**
 * Semantic compression - reduces tokens while keeping meaning intact
 */
class SemanticCompressor {
  constructor(options = {}) {
    this.options = {
      removeFillerWords: options.removeFillerWords !== false,
      simplifyPhrases: options.simplifyPhrases !== false,
      removeRedundancy: options.removeRedundancy !== false,
      compressNumbers: options.compressNumbers !== false,
      aggressive: options.aggressive || false
    };
    
    // Filler words that can often be removed
    this.fillerWords = new Set([
      'basically', 'actually', 'literally', 'honestly',
      'really', 'very', 'quite', 'rather', 'pretty',
      'simply', 'just', 'obviously', 'clearly',
      'definitely', 'certainly', 'probably', 'maybe',
      'somewhat', 'kind of', 'sort of', 'more or less'
    ]);
    
    // Common phrase simplifications
    this.phraseMap = {
      'in order to': 'to',
      'due to the fact that': 'because',
      'in spite of the fact that': 'although',
      'at this point in time': 'now',
      'in the event that': 'if',
      'for the purpose of': 'for',
      'with regard to': 'about',
      'in relation to': 'about',
      'it is important to note that': '',
      'it should be noted that': '',
      'please note that': '',
      'as a matter of fact': '',
      'in my opinion': '',
      'i believe that': '',
      'i think that': '',
      'the way in which': 'how',
      'a large number of': 'many',
      'a significant number of': 'many',
      'the majority of': 'most',
      'a small number of': 'few',
      'at the present time': 'now',
      'in the near future': 'soon',
      'in the past': 'before',
      'on a daily basis': 'daily',
      'on a regular basis': 'regularly',
      'with the exception of': 'except',
      'for the reason that': 'because',
      'in close proximity to': 'near',
      'in the vicinity of': 'near'
    };
    
    // Redundant patterns
    this.redundantPatterns = [
      { pattern: /\b(\w+)\s+\1\b/gi, replacement: '$1' },  // repeated words
      { pattern: /\.{3,}/g, replacement: '...' },  // multiple dots
      { pattern: /!{2,}/g, replacement: '!' },  // multiple exclamation
      { pattern: /\?{2,}/g, replacement: '?' },  // multiple question
      { pattern: /-{2,}/g, replacement: '-' },  // multiple dashes
      { pattern: /\s{2,}/g, replacement: ' ' },  // multiple spaces
    ];
  }

  /**
   * Compress text using semantic strategies
   * @param {string} text - Input text
   * @returns {object} Compression result
   */
  compress(text) {
    const originalTokens = estimateTokens(text);
    let compressed = text;
    
    // Apply compression steps
    if (this.options.removeRedundancy) {
      compressed = this._removeRedundancy(compressed);
    }
    
    if (this.options.simplifyPhrases) {
      compressed = this._simplifyPhrases(compressed);
    }
    
    if (this.options.removeFillerWords) {
      compressed = this._removeFillerWords(compressed);
    }
    
    if (this.options.compressNumbers) {
      compressed = this._compressNumbers(compressed);
    }
    
    if (this.options.aggressive) {
      compressed = this._aggressiveCompress(compressed);
    }
    
    // Clean up whitespace
    compressed = compressed.replace(/\n{3,}/g, '\n\n').trim();
    
    const compressedTokens = estimateTokens(compressed);
    const saved = originalTokens - compressedTokens;
    
    return {
      text: compressed,
      originalTokens,
      compressedTokens,
      tokensSaved: saved,
      compressionRatio: originalTokens > 0 ? ((saved / originalTokens) * 100).toFixed(1) : '0.0'
    };
  }

  /**
   * Remove redundant patterns
   */
  _removeRedundancy(text) {
    let result = text;
    for (const { pattern, replacement } of this.redundantPatterns) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  /**
   * Simplify verbose phrases
   */
  _simplifyPhrases(text) {
    let result = text;
    for (const [phrase, replacement] of Object.entries(this.phraseMap)) {
      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      result = result.replace(regex, replacement);
    }
    return result;
  }

  /**
   * Remove filler words
   */
  _removeFillerWords(text) {
    let result = text;
    for (const word of this.fillerWords) {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      result = result.replace(regex, '');
    }
    // Clean up extra spaces from removed words
    result = result.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?;])/g, '$1');
    return result;
  }

  /**
   * Compress number representations
   */
  _compressNumbers(text) {
    return text
      // Large numbers: 1,000,000 -> 1M
      .replace(/\b(\d{1,3}),(\d{3}),(\d{3})\b/g, '$1.$2M')
      // Thousands: 10,000 -> 10k
      .replace(/\b(\d{1,3}),(\d{3})\b/g, (match, p1, p2) => {
        const num = parseInt(p1 + p2);
        if (num >= 10000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return match;
      })
      // Decimal precision: 3.14159265 -> 3.14
      .replace(/(\d+)\.(\d{3,})/g, (match, p1, p2) => {
        return p1 + '.' + p2.substring(0, 2);
      })
      // Percentages: 95.00% -> 95%
      .replace(/(\d+)\.00%/g, '$1%');
  }

  /**
   * Aggressive compression for maximum token reduction
   */
  _aggressiveCompress(text) {
    return text
      // Remove articles where possible
      .replace(/\b(a|an|the)\s+/gi, ' ')
      // Remove helping verbs
      .replace(/\b(is|are|was|were|be|been|being)\s+/gi, ' ')
      // Shorten common words
      .replace(/\bbecause\b/gi, 'bc')
      .replace(/\bwithout\b/gi, 'w/o')
      .replace(/\bwith\b/gi, 'w/')
      .replace(/\binformation\b/gi, 'info')
      .replace(/\bapplication\b/gi, 'app')
      .replace(/\bconfiguration\b/gi, 'config')
      .replace(/\bdocumentation\b/gi, 'docs')
      .replace(/\blibrary\b/gi, 'lib')
      .replace(/\bfunction\b/gi, 'fn')
      .replace(/\bvariable\b/gi, 'var')
      .replace(/\bargument\b/gi, 'arg')
      .replace(/\bparameter\b/gi, 'param')
      .replace(/\breturn\b/gi, 'ret')
      .replace(/\berror\b/gi, 'err')
      .replace(/\bmessage\b/gi, 'msg')
      .replace(/\bobject\b/gi, 'obj')
      .replace(/\bstring\b/gi, 'str')
      .replace(/\bnumber\b/gi, 'num')
      .replace(/\bboolean\b/gi, 'bool')
      .replace(/\barray\b/gi, 'arr')
      // Clean up
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
}

module.exports = { SemanticCompressor };
