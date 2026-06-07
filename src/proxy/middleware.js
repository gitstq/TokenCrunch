/**
 * TokenCrunch - Proxy Middleware Mode
 * Provides middleware for intercepting and compressing LLM API requests
 */

const { CompressionEngine } = require('../core/compressor');
const { estimateTokens } = require('../utils/helpers');

/**
 * Proxy middleware for API request compression
 */
class CompressionProxy {
  constructor(options = {}) {
    this.engine = new CompressionEngine(options);
    this.stats = {
      totalRequests: 0,
      totalOriginalTokens: 0,
      totalCompressedTokens: 0,
      totalSaved: 0
    };
  }

  /**
   * Compress an OpenAI-compatible chat request
   * @param {object} request - OpenAI chat completion request
   * @returns {object} Compressed request
   */
  compressOpenAIRequest(request) {
    if (!request || !request.messages) return request;
    
    const compressed = { ...request };
    compressed.messages = request.messages.map(msg => {
      if (typeof msg.content === 'string') {
        const result = this.engine.compress(msg.content, { mode: 'balanced' });
        return {
          ...msg,
          content: result.text,
          _compression: {
            originalTokens: result.originalTokens,
            compressedTokens: result.compressedTokens,
            saved: result.tokensSaved,
            ratio: result.compressionRatio
          }
        };
      }
      return msg;
    });
    
    this._updateStats(compressed.messages);
    return compressed;
  }

  /**
   * Compress an Anthropic-compatible message request
   * @param {object} request - Anthropic messages request
   * @returns {object} Compressed request
   */
  compressAnthropicRequest(request) {
    if (!request || !request.messages) return request;
    
    const compressed = { ...request };
    compressed.messages = request.messages.map(msg => {
      if (typeof msg.content === 'string') {
        const result = this.engine.compress(msg.content, { mode: 'balanced' });
        return {
          ...msg,
          content: result.text,
          _compression: {
            originalTokens: result.originalTokens,
            compressedTokens: result.compressedTokens,
            saved: result.tokensSaved,
            ratio: result.compressionRatio
          }
        };
      }
      return msg;
    });
    
    this._updateStats(compressed.messages);
    return compressed;
  }

  /**
   * Compress generic text content
   * @param {string} text - Input text
   * @param {object} options - Compression options
   * @returns {object} Compression result with metadata
   */
  compressText(text, options = {}) {
    const result = this.engine.compress(text, options);
    
    this.stats.totalRequests++;
    this.stats.totalOriginalTokens += result.originalTokens;
    this.stats.totalCompressedTokens += result.compressedTokens;
    this.stats.totalSaved += result.tokensSaved;
    
    return result;
  }

  /**
   * Get compression statistics
   * @returns {object} Statistics
   */
  getStats() {
    const avgRatio = this.stats.totalOriginalTokens > 0
      ? ((this.stats.totalSaved / this.stats.totalOriginalTokens) * 100).toFixed(1)
      : '0.0';
    
    return {
      ...this.stats,
      averageCompressionRatio: parseFloat(avgRatio),
      estimatedCostSavings: this._estimateCostSavings(this.stats.totalSaved)
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      totalOriginalTokens: 0,
      totalCompressedTokens: 0,
      totalSaved: 0
    };
  }

  /**
   * Update internal statistics
   */
  _updateStats(messages) {
    for (const msg of messages) {
      if (msg._compression) {
        this.stats.totalRequests++;
        this.stats.totalOriginalTokens += msg._compression.originalTokens;
        this.stats.totalCompressedTokens += msg._compression.compressedTokens;
        this.stats.totalSaved += msg._compression.saved;
      }
    }
  }

  /**
   * Estimate cost savings based on tokens saved
   */
  _estimateCostSavings(tokensSaved) {
    // Approximate pricing: $0.01 per 1K tokens (average across providers)
    const costPer1K = 0.01;
    return {
      usd: ((tokensSaved / 1000) * costPer1K).toFixed(4),
      tokens: tokensSaved
    };
  }

  /**
   * Create Express/Connect middleware
   * @param {object} options - Middleware options
   * @returns {function} Middleware function
   */
  createMiddleware(options = {}) {
    const proxy = this;
    
    return function(req, res, next) {
      if (req.body && req.body.messages) {
        const provider = options.provider || 'auto';
        
        if (provider === 'openai' || (provider === 'auto' && req.body.model)) {
          req.body = proxy.compressOpenAIRequest(req.body);
        } else if (provider === 'anthropic' || (provider === 'auto' && req.body.anthropic_version)) {
          req.body = proxy.compressAnthropicRequest(req.body);
        }
      }
      
      if (next) next();
    };
  }

  /**
   * Create a simple fetch interceptor
   * @returns {function} Interceptor function
   */
  createFetchInterceptor() {
    const proxy = this;
    
    return function(url, options = {}) {
      if (options.body && typeof options.body === 'string') {
        try {
          const body = JSON.parse(options.body);
          if (body.messages) {
            const compressed = proxy.compressOpenAIRequest(body);
            options.body = JSON.stringify(compressed);
          }
        } catch {
          // Not JSON, skip
        }
      }
      
      return fetch(url, options);
    };
  }
}

module.exports = { CompressionProxy };
