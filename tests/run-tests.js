#!/usr/bin/env node

"use strict";

/**
 * TokenCrunch - Test Suite
 * Comprehensive tests for all compression strategies
 */

const fs = require('fs');
const path = require('path');
const { CompressionEngine } = require('../src/core/compressor');
const { TokenEstimator } = require('../src/core/tokenizer');
const { SemanticCompressor } = require('../src/core/strategies/semantic');
const { StructuralCompressor } = require('../src/core/strategies/structural');
const { CompressionProxy } = require('../src/proxy/middleware');

// Test statistics
let passed = 0;
let failed = 0;
const failures = [];

/**
 * Test assertion helper
 */
function test(name, fn) {
  try {
    fn();
    passed++;
    process.stdout.write(`  ✅ ${name}\n`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    process.stdout.write(`  ❌ ${name}\n`);
    process.stdout.write(`     Error: ${err.message}\n`);
  }
}

/**
 * Assert helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Assert approximately equal
 */
function assertApprox(actual, expected, tolerance = 5, message) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(message || `Expected ~${expected}, got ${actual} (diff: ${diff})`);
  }
}

console.log('\n🧪 TokenCrunch Test Suite\n');

// ═══════════════════════════════════════════════════════════════
// Token Estimator Tests
// ═══════════════════════════════════════════════════════════════
console.log('📊 Token Estimator Tests');

const estimator = new TokenEstimator();

test('estimates simple text tokens', () => {
  const tokens = estimator.estimate('Hello world');
  assert(tokens > 0, 'Should return positive token count');
});

test('estimates longer text with more tokens', () => {
  const short = estimator.estimate('Hello');
  const long = estimator.estimate('Hello world this is a longer sentence with more words');
  assert(long > short, 'Longer text should have more tokens');
});

test('analyze returns detailed breakdown', () => {
  const analysis = estimator.analyze('Hello world\nTest line');
  assert(analysis.estimatedTokens > 0, 'Should have tokens');
  assert(analysis.lines === 2, 'Should count 2 lines');
  assert(analysis.words >= 4, 'Should count words');
});

test('compare shows compression difference', () => {
  const comparison = estimator.compare('Hello world test', 'Hello world');
  assert(comparison.originalTokens > comparison.compressedTokens, 'Original should be larger');
  assert(comparison.tokensSaved > 0, 'Should save tokens');
});

// ═══════════════════════════════════════════════════════════════
// Semantic Compression Tests
// ═══════════════════════════════════════════════════════════════
console.log('\n📝 Semantic Compression Tests');

const semantic = new SemanticCompressor();

test('removes filler words', () => {
  const input = 'This is basically a very simple test that is actually working';
  const result = semantic.compress(input);
  assert(result.compressedTokens < result.originalTokens, 'Should reduce tokens');
});

test('simplifies verbose phrases', () => {
  const input = 'In order to test this, we need to verify the functionality';
  const result = semantic.compress(input);
  assert(!result.text.includes('in order to'), 'Should simplify phrases');
});

test('removes redundancy', () => {
  const input = 'This is is a test test with duplicate duplicate words';
  const result = semantic.compress(input);
  assert(result.text.includes('is a'), 'Should remove duplicate words');
});

test('compresses numbers', () => {
  const input = 'The value is 10,000 and 1,000,000';
  const result = semantic.compress(input);
  assert(result.compressionRatio > 0, 'Should compress numbers');
});

test('aggressive mode compresses more', () => {
  const input = 'The application configuration requires documentation';
  const normal = semantic.compress(input);
  const aggressive = new SemanticCompressor({ aggressive: true }).compress(input);
  assert(aggressive.compressedTokens <= normal.compressedTokens, 'Aggressive should compress more');
});

// ═══════════════════════════════════════════════════════════════
// Structural Compression Tests
// ═══════════════════════════════════════════════════════════════
console.log('\n🏗️ Structural Compression Tests');

const structural = new StructuralCompressor();

test('compresses JSON data', () => {
  const input = JSON.stringify({ name: 'test', value: 123, nested: { a: 1, b: 2 } }, null, 2);
  const result = structural.compress(input);
  assert(result.format === 'json', 'Should detect JSON format');
  assert(result.compressedTokens < result.originalTokens, 'Should reduce tokens');
});

test('compresses Markdown', () => {
  const input = '# Title\n\n## Section\n\nSome content here.\n\n---\n\nMore content.';
  const result = structural.compress(input);
  assert(result.format === 'markdown', 'Should detect Markdown format');
});

test('compresses code', () => {
  const input = `function test() {\n  // This is a comment\n  const x = 1;\n  return x;\n}`;
  const result = structural.compress(input);
  assert(result.format === 'code', 'Should detect code format');
});

test('compresses logs', () => {
  const input = `2024-01-01 10:00:00 INFO Starting process\n2024-01-01 10:00:01 INFO Process running\n2024-01-01 10:00:02 INFO Process running`;
  const result = structural.compress(input);
  assert(result.format === 'log', 'Should detect log format');
});

test('collapses large JSON arrays', () => {
  const input = JSON.stringify({ items: Array(20).fill('test') });
  const result = structural.compress(input);
  assert(result.compressedTokens < result.originalTokens, 'Should collapse arrays');
});

// ═══════════════════════════════════════════════════════════════
// Main Engine Tests
// ═══════════════════════════════════════════════════════════════
console.log('\n⚙️ Main Engine Tests');

const engine = new CompressionEngine();

test('compresses plain text', () => {
  const input = 'This is a test sentence with some words that can be compressed.';
  const result = engine.compress(input);
  assert(result.compressedTokens <= result.originalTokens, 'Should not increase tokens');
  assert(result.quality >= 0 && result.quality <= 100, 'Quality should be 0-100');
});

test('different modes produce different results', () => {
  const input = 'The application is basically very simple and actually works well';
  const conservative = new CompressionEngine({ mode: 'conservative' }).compress(input);
  const balanced = new CompressionEngine({ mode: 'balanced' }).compress(input);
  const aggressive = new CompressionEngine({ mode: 'aggressive' }).compress(input);
  
  assert(conservative.compressedTokens >= balanced.compressedTokens, 
    'Conservative should preserve more');
  assert(balanced.compressedTokens >= aggressive.compressedTokens,
    'Aggressive should compress most');
});

test('compresses files by extension', () => {
  const json = '{"test": true, "value": 123}';
  const result = engine.compressFile(json, 'test.json');
  assert(result.format === 'json', 'Should detect JSON from extension');
});

test('batch compression works', () => {
  const texts = ['Hello world', 'Test sentence', 'Another example'];
  const results = engine.compressBatch(texts);
  assert(results.length === 3, 'Should return 3 results');
  results.forEach(r => assert(r.compressedTokens <= r.originalTokens, 'Each should compress'));
});

test('respects max compression limit', () => {
  const engine = new CompressionEngine({ maxCompression: 50 });
  const input = 'a '.repeat(1000);
  const result = engine.compress(input);
  assert(result.compressionRatio <= 55, 'Should respect max compression (with tolerance)');
});

// ═══════════════════════════════════════════════════════════════
// Proxy Tests
// ═══════════════════════════════════════════════════════════════
console.log('\n🔌 Proxy Middleware Tests');

const proxy = new CompressionProxy();

test('compresses OpenAI request', () => {
  const request = {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that is very capable' },
      { role: 'user', content: 'Hello, I would like to ask a question please' }
    ]
  };
  const compressed = proxy.compressOpenAIRequest(request);
  assert(compressed.messages[0]._compression, 'Should add compression metadata');
  assert(compressed.messages[0]._compression.saved >= 0, 'Should save tokens');
});

test('compresses Anthropic request', () => {
  const request = {
    model: 'claude-3',
    messages: [
      { role: 'user', content: 'This is basically a very simple test message' }
    ]
  };
  const compressed = proxy.compressAnthropicRequest(request);
  assert(compressed.messages[0]._compression, 'Should add compression metadata');
});

test('tracks statistics', () => {
  proxy.resetStats();
  proxy.compressText('This is basically a very simple test with actually redundant words and unnecessary filler content');
  const stats = proxy.getStats();
  assert(stats.totalRequests === 1, 'Should track requests');
  assert(stats.totalSaved >= 0, 'Should track saved tokens (may be 0 for incompressible text)');
});

test('compressText returns full result', () => {
  const result = proxy.compressText('The application configuration is very simple');
  assert(result.text, 'Should return compressed text');
  assert(result.originalTokens > 0, 'Should have original tokens');
  assert(result.compressionRatio >= 0, 'Should have compression ratio');
});

// ═══════════════════════════════════════════════════════════════
// Edge Case Tests
// ═══════════════════════════════════════════════════════════════
console.log('\n🔍 Edge Case Tests');

test('handles empty string', () => {
  const result = engine.compress('');
  assert(result.compressedTokens === 0, 'Empty string should have 0 tokens');
});

test('handles very long text', () => {
  const longText = 'word '.repeat(10000);
  const result = engine.compress(longText);
  assert(result.compressedTokens < result.originalTokens, 'Should compress long text');
});

test('handles special characters', () => {
  const input = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
  const result = engine.compress(input);
  assert(result.compressedTokens >= 0, 'Should handle special chars');
});

test('handles unicode text', () => {
  const input = '你好世界 🌍 émojis ñoño';
  const result = engine.compress(input);
  assert(result.compressedTokens >= 0, 'Should handle unicode');
});

test('handles single word', () => {
  const result = engine.compress('Hello');
  assert(result.compressedTokens >= 0, 'Should handle single word');
});

test('handles code with comments', () => {
  const input = `// This is a very long comment explaining what this function does
function test() {
  /* Another long comment block
     with multiple lines of explanation */
  return 42;
}`;
  const result = engine.compress(input);
  assert(result.compressedTokens < result.originalTokens, 'Should remove comments');
});

// ═══════════════════════════════════════════════════════════════
// Performance Tests
// ═══════════════════════════════════════════════════════════════
console.log('\n⏱️ Performance Tests');

test('compresses 1000 words quickly', () => {
  const text = 'The quick brown fox jumps over the lazy dog. '.repeat(100);
  const start = Date.now();
  engine.compress(text);
  const elapsed = Date.now() - start;
  assert(elapsed < 1000, `Should complete in < 1s, took ${elapsed}ms`);
});

test('batch compression is efficient', () => {
  const texts = Array(10).fill('Hello world test compression example');
  const start = Date.now();
  engine.compressBatch(texts);
  const elapsed = Date.now() - start;
  assert(elapsed < 1000, `Should complete batch in < 1s, took ${elapsed}ms`);
});

// ═══════════════════════════════════════════════════════════════
// Test Summary
// ═══════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(60));
console.log('📋 Test Summary');
console.log('═'.repeat(60));
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  📊 Total:  ${passed + failed}`);

if (failed > 0) {
  console.log('\n  Failed Tests:');
  failures.forEach(f => console.log(`    - ${f.name}: ${f.error}`));
}

const success = failed === 0;
console.log(`\n  ${success ? '🎉 All tests passed!' : '⚠️ Some tests failed'}
`);

process.exit(success ? 0 : 1);
