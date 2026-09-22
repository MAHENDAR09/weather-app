/**
 * Terminal colors using ANSI escape codes
 * No external dependencies needed!
 * 
 * Learn more: https://en.wikipedia.org/wiki/ANSI_escape_code
 */

const codes = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

/**
 * Creates a colorized string
 * @param {string} text - The text to colorize
 * @param {...string} styles - Style names to apply
 * @returns {string} Colorized text
 */
export function colorize(text, ...styles) {
  const prefix = styles.map(style => codes[style] || '').join('');
  return `${prefix}${text}${codes.reset}`;
}

// Convenience functions
export const red = (text) => colorize(text, 'red');
export const green = (text) => colorize(text, 'green');
export const yellow = (text) => colorize(text, 'yellow');
export const blue = (text) => colorize(text, 'blue');
export const cyan = (text) => colorize(text, 'cyan');
export const magenta = (text) => colorize(text, 'magenta');
export const bold = (text) => colorize(text, 'bold');
export const dim = (text) => colorize(text, 'dim');

// Combined styles
export const success = (text) => colorize(text, 'green', 'bold');
export const error = (text) => colorize(text, 'red', 'bold');
export const warning = (text) => colorize(text, 'yellow');
export const info = (text) => colorize(text, 'cyan');
export const highlight = (text) => colorize(text, 'magenta', 'bold');
