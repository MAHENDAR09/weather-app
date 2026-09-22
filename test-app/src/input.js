/**
 * Input handling using Node.js built-in readline module
 * Demonstrates: Promises, async/await, event handling
 */

import * as readline from 'node:readline';

/**
 * Creates a readline interface for user input
 * @returns {readline.Interface}
 */
export function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompts the user for input and returns their response
 * @param {readline.Interface} rl - Readline interface
 * @param {string} question - The prompt to display
 * @returns {Promise<string>} User's input
 */
export function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Prompts user to select from a list of options
 * @param {readline.Interface} rl - Readline interface
 * @param {string} question - The question to ask
 * @param {string[]} options - Array of options
 * @returns {Promise<{index: number, value: string}>} Selected option
 */
export async function select(rl, question, options) {
  console.log(`\n${question}\n`);
  
  options.forEach((option, index) => {
    console.log(`  ${index + 1}. ${option}`);
  });
  
  while (true) {
    const answer = await prompt(rl, '\nYour choice (enter number): ');
    const index = parseInt(answer, 10) - 1;
    
    if (index >= 0 && index < options.length) {
      return { index, value: options[index] };
    }
    
    console.log(`Please enter a number between 1 and ${options.length}`);
  }
}

/**
 * Prompts for yes/no confirmation
 * @param {readline.Interface} rl - Readline interface
 * @param {string} question - The question to ask
 * @returns {Promise<boolean>}
 */
export async function confirm(rl, question) {
  const answer = await prompt(rl, `${question} (y/n): `);
  return answer.toLowerCase().startsWith('y');
}

/**
 * Waits for user to press Enter
 * @param {readline.Interface} rl - Readline interface
 * @param {string} message - Message to display
 */
export async function pressEnter(rl, message = 'Press Enter to continue...') {
  await prompt(rl, `\n${message}`);
}
