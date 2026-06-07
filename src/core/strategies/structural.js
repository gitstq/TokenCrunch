/**
 * TokenCrunch - Structural Compression Strategy
 * Handles structured data formats: JSON, Markdown, Code, Logs
 */

const { estimateTokens, isJSON, isMarkdown, isCode, isLog } = require('../../utils/helpers');

/**
 * Structural compressor for format-aware compression
 */
class StructuralCompressor {
  constructor(options = {}) {
    this.options = {
      preserveKeys: options.preserveKeys !== false,
      collapseArrays: options.collapseArrays !== false,
      removeComments: options.removeComments !== false,
      minifyWhitespace: options.minifyWhitespace !== false,
      maxLineLength: options.maxLineLength || 0,
      aggressive: options.aggressive || false
    };
  }

  /**
   * Auto-detect format and compress accordingly
   * @param {string} text - Input text
   * @returns {object} Compression result
   */
  compress(text) {
    const originalTokens = estimateTokens(text);
    let compressed = text;
    let format = 'text';
    
    if (isJSON(text)) {
      format = 'json';
      compressed = this._compressJSON(text);
    } else if (isMarkdown(text)) {
      format = 'markdown';
      compressed = this._compressMarkdown(text);
    } else if (isCode(text)) {
      format = 'code';
      compressed = this._compressCode(text);
    } else if (isLog(text)) {
      format = 'log';
      compressed = this._compressLog(text);
    } else {
      compressed = this._compressGeneric(text);
    }
    
    const compressedTokens = estimateTokens(compressed);
    const saved = originalTokens - compressedTokens;
    
    return {
      text: compressed,
      format,
      originalTokens,
      compressedTokens,
      tokensSaved: saved,
      compressionRatio: originalTokens > 0 ? ((saved / originalTokens) * 100).toFixed(1) : '0.0'
    };
  }

  /**
   * Compress JSON data
   */
  _compressJSON(text) {
    try {
      const data = JSON.parse(text);
      return this._compressJSONValue(data, 0);
    } catch {
      return text;
    }
  }

  /**
   * Recursively compress JSON value
   */
  _compressJSONValue(value, depth) {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') {
      // Truncate long strings
      if (this.options.aggressive && value.length > 200) {
        return JSON.stringify(value.substring(0, 200) + '...');
      }
      return JSON.stringify(value);
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      
      // Collapse large arrays of primitives
      if (this.options.collapseArrays && value.length > 10) {
        const allPrimitives = value.every(v => 
          typeof v !== 'object' || v === null
        );
        if (allPrimitives) {
          const sample = value.slice(0, 3).map(v => this._compressJSONValue(v, depth + 1));
          return `[${sample.join(',')},...(${value.length - 3} more)]`;
        }
      }
      
      const items = value.map(v => this._compressJSONValue(v, depth + 1));
      return '[' + items.join(',') + ']';
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return '{}';
      
      const pairs = keys.map(key => {
        const compressedValue = this._compressJSONValue(value[key], depth + 1);
        return `"${key}":${compressedValue}`;
      });
      
      return '{' + pairs.join(',') + '}';
    }
    
    return JSON.stringify(value);
  }

  /**
   * Compress Markdown
   */
  _compressMarkdown(text) {
    return text
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Simplify headers: keep only h1-h3
      .replace(/^#{4,6}\s+/gm, '**')
      // Remove horizontal rules
      .replace(/^\s*[-*_]{3,}\s*$/gm, '')
      // Collapse multiple blank lines
      .replace(/\n{3,}/g, '\n\n')
      // Remove reference-style links (keep text only)
      .replace(/\[(.+?)\]\[.*?\]/g, '$1')
      // Simplify tables: remove alignment markers
      .replace(/\|[\s:-]+\|/g, '|')
      // Remove emoji (optional, saves tokens)
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      // Clean up
      .trim();
  }

  /**
   * Compress code
   */
  _compressCode(text) {
    let result = text;
    
    if (this.options.removeComments) {
      // Remove single-line comments
      result = result.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove Python/Ruby comments
      result = result.replace(/#.*$/gm, '');
      // Remove HTML comments
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    if (this.options.minifyWhitespace) {
      // Collapse multiple blank lines
      result = result.replace(/\n{3,}/g, '\n\n');
      // Remove trailing whitespace
      result = result.replace(/[ \t]+$/gm, '');
    }
    
    if (this.options.aggressive) {
      // Remove import/require statements (keep names)
      result = result.replace(/^(import|require|using|include)\s+.*?$/gm, '');
      // Shorten common patterns
      result = result.replace(/console\.log/g, 'log');
      result = result.replace(/function\s+/g, 'fn ');
      result = result.replace(/const\s+/g, 'let ');
    }
    
    return result.trim();
  }

  /**
   * Compress log output
   */
  _compressLog(text) {
    const lines = text.split('\n');
    const compressedLines = [];
    let lastTimestamp = '';
    let duplicateCount = 0;
    let lastLine = '';
    
    for (const line of lines) {
      // Extract timestamp
      const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2})/);
      const timestamp = timestampMatch ? timestampMatch[1] : '';
      
      // Remove timestamp if same as last
      let compressed = line;
      if (timestamp && timestamp === lastTimestamp) {
        compressed = line.replace(timestamp, ' '.repeat(timestamp.length));
      }
      lastTimestamp = timestamp;
      
      // Detect duplicate lines
      const normalized = line.replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}[\.,]?\d*\s*/, '').trim();
      if (normalized === lastLine && normalized) {
        duplicateCount++;
        continue;
      }
      
      if (duplicateCount > 0) {
        compressedLines.push(`... (${duplicateCount} similar lines)`);
        duplicateCount = 0;
      }
      
      lastLine = normalized;
      compressedLines.push(compressed);
    }
    
    if (duplicateCount > 0) {
      compressedLines.push(`... (${duplicateCount} similar lines)`);
    }
    
    return compressedLines.join('\n');
  }

  /**
   * Generic text compression
   */
  _compressGeneric(text) {
    return text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+$/gm, '')
      .trim();
  }
}

module.exports = { StructuralCompressor };
