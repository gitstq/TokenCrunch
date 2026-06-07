#!/usr/bin/env node

"use strict";

/**
 * TokenCrunch CLI
 * Command-line interface for intelligent LLM input compression
 */

const fs = require('fs');
const path = require('path');
const { CompressionEngine } = require('../src/core/compressor');
const { 
  generateReport, 
  generateBatchReport, 
  generateJSONReport,
  generateMarkdownReport 
} = require('../src/utils/reporter');

const VERSION = '1.0.0';

// CLI argument parsing
function parseArgs(args) {
  const options = {
    mode: 'balanced',
    output: null,
    format: 'text',
    silent: false,
    help: false,
    version: false,
    files: [],
    text: null,
    stats: false,
    aggressive: false,
    conservative: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-v':
      case '--version':
        options.version = true;
        break;
      case '-m':
      case '--mode':
        options.mode = args[++i] || 'balanced';
        break;
      case '-o':
      case '--output':
        options.output = args[++i] || null;
        break;
      case '-f':
      case '--format':
        options.format = args[++i] || 'text';
        break;
      case '-s':
      case '--silent':
        options.silent = true;
        break;
      case '--stats':
        options.stats = true;
        break;
      case '--aggressive':
        options.aggressive = true;
        options.mode = 'aggressive';
        break;
      case '--conservative':
        options.conservative = true;
        options.mode = 'conservative';
        break;
      case '-t':
      case '--text':
        options.text = args[++i] || '';
        break;
      default:
        if (!arg.startsWith('-') && (arg.endsWith('.txt') || arg.endsWith('.md') || 
            arg.endsWith('.json') || arg.endsWith('.log') || arg.endsWith('.js') ||
            arg.endsWith('.ts') || arg.endsWith('.py') || fs.existsSync(arg))) {
          options.files.push(arg);
        } else if (!arg.startsWith('-')) {
          options.text = arg;
        }
        break;
    }
  }

  return options;
}

// Show help
function showHelp() {
  console.log(`
🚀 TokenCrunch v${VERSION} - Intelligent LLM Input Compression

Usage: tokensqueeze [options] <file|text>
       tsq [options] <file|text>

Options:
  -h, --help              Show this help message
  -v, --version           Show version
  -m, --mode <mode>       Compression mode: conservative|balanced|aggressive (default: balanced)
  -o, --output <file>     Write compressed output to file
  -f, --format <format>   Output format: text|json|markdown (default: text)
  -s, --silent            Suppress report output
  --stats                 Show detailed statistics
  --aggressive            Use aggressive compression mode
  --conservative          Use conservative compression mode
  -t, --text <text>       Compress text directly

Examples:
  tokensqueeze input.txt                    Compress a text file
  tokensqueeze -m aggressive logfile.log    Aggressively compress logs
  tokensqueeze -o output.md input.md        Compress and save to file
  tokensqueeze -f json input.json           Output JSON report
  tokensqueeze --stats document.txt         Show detailed statistics
  tsq -t "Your long text here..."           Compress inline text
  echo "text" | tokensqueeze                Compress from stdin

Modes:
  conservative    Preserve maximum quality, ~20-40% compression
  balanced        Good balance, ~40-70% compression (default)
  aggressive      Maximum compression, ~60-95% compression
`);
}

// Show version
function showVersion() {
  console.log(`TokenCrunch v${VERSION}`);
}

// Read stdin
function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data));
    
    // Handle case where stdin is not piped
    setTimeout(() => {
      if (!data && process.stdin.isTTY) {
        resolve('');
      }
    }, 100);
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.version) {
    showVersion();
    process.exit(0);
  }

  // Determine input source
  let input = '';
  let filename = '';

  if (options.text) {
    input = options.text;
  } else if (options.files.length > 0) {
    filename = options.files[0];
    try {
      input = fs.readFileSync(filename, 'utf8');
    } catch (err) {
      console.error(`❌ Error reading file: ${err.message}`);
      process.exit(1);
    }
  } else {
    // Try stdin
    input = await readStdin();
    if (!input.trim()) {
      console.error('❌ No input provided. Use --help for usage information.');
      process.exit(1);
    }
  }

  // Create engine and compress
  const engine = new CompressionEngine({ mode: options.mode });
  const result = engine.compressFile(input, filename, { mode: options.mode });

  // Output compressed text
  if (options.output) {
    try {
      fs.writeFileSync(options.output, result.text);
      if (!options.silent) {
        console.log(`✅ Compressed output written to: ${options.output}`);
      }
    } catch (err) {
      console.error(`❌ Error writing file: ${err.message}`);
      process.exit(1);
    }
  } else if (!options.silent) {
    // Print report
    switch (options.format) {
      case 'json':
        console.log(generateJSONReport(result));
        break;
      case 'markdown':
        console.log(generateMarkdownReport(result));
        break;
      default:
        console.log(generateReport(result));
        if (options.stats) {
          console.log('\n📋 Compressed Output:');
          console.log('─'.repeat(60));
          console.log(result.text);
          console.log('─'.repeat(60));
        }
        break;
    }
  } else {
    // Silent mode - just output the compressed text
    console.log(result.text);
  }

  // Exit with success
  process.exit(0);
}

// Handle errors
process.on('uncaughtException', (err) => {
  console.error(`❌ Unexpected error: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(`❌ Unexpected error: ${err.message}`);
  process.exit(1);
});

// Run main
main();
