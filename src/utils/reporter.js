"use strict";

/**
 * TokenCrunch - Compression Reporter
 * Generates beautiful compression reports
 */

/**
 * Generate a visual compression report
 * @param {object} result - Compression result
 * @returns {string} Formatted report
 */
function generateReport(result) {
  const { 
    originalTokens, 
    compressedTokens, 
    tokensSaved, 
    compressionRatio, 
    reductionFactor,
    format,
    mode,
    quality
  } = result;

  const barWidth = 40;
  const savedPercent = compressionRatio;
  const keptPercent = 100 - savedPercent;
  
  const savedBars = Math.round((savedPercent / 100) * barWidth);
  const keptBars = barWidth - savedBars;
  
  const bar = '█'.repeat(savedBars) + '░'.repeat(keptBars);
  
  return `
╔══════════════════════════════════════════════════════════════╗
║                 🚀 TokenCrunch Report                       ║
╠══════════════════════════════════════════════════════════════╣
║  Mode: ${pad(mode, 10)}  Format: ${pad(format || 'auto', 12)}          ║
╠══════════════════════════════════════════════════════════════╣
║  📊 Token Statistics                                         ║
║                                                              ║
║  Original:    ${pad(originalTokens.toLocaleString(), 8)} tokens                    ║
║  Compressed:  ${pad(compressedTokens.toLocaleString(), 8)} tokens                    ║
║  Saved:       ${pad(tokensSaved.toLocaleString(), 8)} tokens  (${pad(compressionRatio + '%', 6)})        ║
║  Reduction:   ${pad(reductionFactor + 'x', 8)} smaller                         ║
║                                                              ║
║  ${bar}  ║
║  ${pad(savedPercent.toFixed(1) + '% saved', 20)}${pad(keptPercent.toFixed(1) + '% kept', 20)}  ║
╠══════════════════════════════════════════════════════════════╣
║  💡 Quality Score: ${pad((quality || 'N/A') + '/100', 6)}                              ║
╚══════════════════════════════════════════════════════════════╝
`;
}

/**
 * Generate batch report
 * @param {object[]} results - Array of compression results
 * @returns {string} Formatted batch report
 */
function generateBatchReport(results) {
  const totalOriginal = results.reduce((sum, r) => sum + r.originalTokens, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedTokens, 0);
  const totalSaved = totalOriginal - totalCompressed;
  const avgRatio = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : '0.0';
  
  let report = `
╔══════════════════════════════════════════════════════════════╗
║              📦 TokenCrunch Batch Report                    ║
╠══════════════════════════════════════════════════════════════╣
║  Items processed: ${pad(results.length.toString(), 4)}                                    ║
╠══════════════════════════════════════════════════════════════╣
║  📊 Total Statistics                                         ║
║                                                              ║
║  Original:    ${pad(totalOriginal.toLocaleString(), 10)} tokens                  ║
║  Compressed:  ${pad(totalCompressed.toLocaleString(), 10)} tokens                  ║
║  Saved:       ${pad(totalSaved.toLocaleString(), 10)} tokens  (${pad(avgRatio + '%', 6)})      ║
╠══════════════════════════════════════════════════════════════╣
║  📋 Per-Item Breakdown                                       ║
╠════════════════════╦════════════╦════════════╦═══════════════╣
║  Item              ║ Original   ║ Compressed ║ Saved         ║
╠════════════════════╬════════════╬════════════╬═══════════════╣
`;

  results.forEach((r, i) => {
    const name = pad(`#${i + 1}`, 18);
    const orig = pad(r.originalTokens.toLocaleString(), 10);
    const comp = pad(r.compressedTokens.toLocaleString(), 10);
    const saved = pad(r.tokensSaved.toLocaleString() + ` (${r.compressionRatio}%)`, 13);
    report += `║ ${name}║ ${orig} ║ ${comp} ║ ${saved} ║\n`;
  });

  report += `╚════════════════════╩════════════╩════════════╩═══════════════╝\n`;
  
  return report;
}

/**
 * Generate JSON report
 * @param {object|object[]} result - Compression result(s)
 * @returns {string} JSON string
 */
function generateJSONReport(result) {
  const isArray = Array.isArray(result);
  const data = isArray ? {
    type: 'batch',
    count: result.length,
    summary: {
      totalOriginal: result.reduce((s, r) => s + r.originalTokens, 0),
      totalCompressed: result.reduce((s, r) => s + r.compressedTokens, 0),
      totalSaved: result.reduce((s, r) => s + r.tokensSaved, 0),
      averageRatio: result.length > 0 
        ? (result.reduce((s, r) => s + r.compressionRatio, 0) / result.length).toFixed(1)
        : '0.0'
    },
    items: result.map(r => ({
      originalTokens: r.originalTokens,
      compressedTokens: r.compressedTokens,
      tokensSaved: r.tokensSaved,
      compressionRatio: r.compressionRatio,
      format: r.format,
      mode: r.mode
    }))
  } : {
    type: 'single',
    originalTokens: result.originalTokens,
    compressedTokens: result.compressedTokens,
    tokensSaved: result.tokensSaved,
    compressionRatio: result.compressionRatio,
    reductionFactor: result.reductionFactor,
    format: result.format,
    mode: result.mode,
    quality: result.quality
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Generate markdown report
 * @param {object} result - Compression result
 * @returns {string} Markdown report
 */
function generateMarkdownReport(result) {
  return `## 🚀 TokenCrunch Compression Report

### Summary

| Metric | Value |
|--------|-------|
| **Original Tokens** | ${result.originalTokens.toLocaleString()} |
| **Compressed Tokens** | ${result.compressedTokens.toLocaleString()} |
| **Tokens Saved** | ${result.tokensSaved.toLocaleString()} (${result.compressionRatio}%) |
| **Reduction Factor** | ${result.reductionFactor}x |
| **Format** | ${result.format || 'auto-detected'} |
| **Mode** | ${result.mode} |
| **Quality Score** | ${result.quality || 'N/A'}/100 |

### Compression Visualization

\`\`\`
Original:  ${'█'.repeat(40)}
Compressed: ${'█'.repeat(Math.round((result.compressedTokens / result.originalTokens) * 40))}${'░'.repeat(40 - Math.round((result.compressedTokens / result.originalTokens) * 40))}
\`\`\`

---
*Generated by TokenCrunch v1.0.0*
`;
}

/**
 * Pad string to fixed width
 */
function pad(str, width) {
  const s = String(str);
  return s.length >= width ? s.substring(0, width) : s + ' '.repeat(width - s.length);
}

module.exports = {
  generateReport,
  generateBatchReport,
  generateJSONReport,
  generateMarkdownReport
};
