/**
 * TokenCrunch - Utility Helpers
 * Zero-dependency helper functions
 */

/**
 * Estimate token count using character-based heuristic
 * More accurate than simple char/4 for mixed content
 * @param {string} text - Input text
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0;
  
  // Count different character types
  const asciiChars = (text.match(/[\x00-\x7F]/g) || []).length;
  const multiByteChars = text.length - asciiChars;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const numbers = (text.match(/\d+/g) || []).length;
  const punctuation = (text.match(/[.,!?;:'"\-_()[\]{}]/g) || []).length;
  
  // Weighted estimation formula
  // ASCII chars: ~0.25 tokens/char
  // Multi-byte: ~1 token/char
  // Numbers: ~0.3 tokens/digit group
  // Punctuation: ~0.5 tokens each
  let estimate = asciiChars * 0.25 + 
                 multiByteChars * 1.0 + 
                 numbers * 0.3 + 
                 punctuation * 0.5;
  
  // Words adjustment: very short words (<3 chars) often share tokens
  const shortWords = text.split(/\s+/).filter(w => w.length > 0 && w.length <= 3).length;
  estimate -= shortWords * 0.1;
  
  return Math.max(1, Math.round(estimate));
}

/**
 * Calculate compression ratio
 * @param {number} original - Original token count
 * @param {number} compressed - Compressed token count
 * @returns {object} Compression statistics
 */
function calculateCompression(original, compressed) {
  const saved = original - compressed;
  const ratio = original > 0 ? ((saved / original) * 100).toFixed(1) : '0.0';
  const reduction = original > 0 ? (original / compressed).toFixed(1) : '1.0';
  
  return {
    original,
    compressed,
    saved,
    ratio: parseFloat(ratio),
    reductionFactor: parseFloat(reduction)
  };
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Byte count
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if text is likely code
 * @param {string} text - Input text
 * @returns {boolean} True if code-like
 */
function isCode(text) {
  const codeIndicators = [
    /^(const|let|var|function|class|import|export|def|if|for|while)\s/m,
    /[{;}]\s*\n/m,
    /\(\s*\)\s*=>/m,
    /^(\s{2,4}|\t).*[=:;]/m,
    /^(#include|using namespace|package|from)\s/m
  ];
  return codeIndicators.some(pattern => pattern.test(text));
}

/**
 * Check if text is JSON
 * @param {string} text - Input text
 * @returns {boolean} True if JSON
 */
function isJSON(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if text is Markdown
 * @param {string} text - Input text
 * @returns {boolean} True if Markdown
 */
function isMarkdown(text) {
  const mdIndicators = [
    /^#{1,6}\s/m,
    /^\[.+\]\(.+\)/m,
    /^\*\s/m,
    /^\-\s/m,
    /^\d+\.\s/m,
    /^```/m,
    /^\|.+\|/m
  ];
  return mdIndicators.some(pattern => pattern.test(text));
}

/**
 * Check if text is log output
 * @param {string} text - Input text
 * @returns {boolean} True if log
 */
function isLog(text) {
  const logPatterns = [
    /^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/m,
    /^\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\]/m,
    /^(INFO|WARN|ERROR|DEBUG|TRACE)\s/m,
    /^(\[INFO\]|\[WARN\]|\[ERROR\]|\[DEBUG\])/m
  ];
  return logPatterns.some(pattern => pattern.test(text));
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Remove duplicate lines while preserving order
 * @param {string} text - Input text
 * @returns {string} Deduplicated text
 */
function removeDuplicateLines(text) {
  const lines = text.split('\n');
  const seen = new Set();
  const result = [];
  
  for (const line of lines) {
    const normalized = line.trim();
    if (!normalized || !seen.has(normalized)) {
      if (normalized) seen.add(normalized);
      result.push(line);
    }
  }
  
  return result.join('\n');
}

module.exports = {
  estimateTokens,
  calculateCompression,
  formatBytes,
  deepClone,
  isCode,
  isJSON,
  isMarkdown,
  isLog,
  truncate,
  removeDuplicateLines
};
