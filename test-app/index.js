#!/usr/bin/env node

/**
 * Quiz CLI - An interactive command-line quiz game
 * 
 * This application demonstrates:
 * - ES Modules (import/export)
 * - Async/await and Promises
 * - File system operations
 * - User input handling
 * - Classes and OOP concepts
 * - Array methods (map, filter, forEach)
 * - Destructuring
 * - Template literals
 * - Error handling
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { createInterface, select, confirm, pressEnter } from './src/input.js';
import { Quiz } from './src/quiz.js';
import * as colors from './src/colors.js';

// Get the directory of the current module (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Loads questions from the JSON file
 * @returns {Promise<Object>} Questions data
 */
async function loadQuestions() {
  const filePath = join(__dirname, 'data', 'questions.json');
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Displays the welcome banner
 */
function showBanner() {
  console.clear();
  console.log(colors.cyan(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║   ${colors.highlight('📚 QUIZ CLI')}                           ║
  ║   ${colors.dim('Test your programming knowledge!')}        ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `));
}

/**
 * Main application loop
 */
async function main() {
  const rl = createInterface();

  try {
    // Load questions
    const data = await loadQuestions();
    const categoryIds = Object.keys(data.categories);

    let playing = true;

    while (playing) {
      showBanner();

      // Select category
      const categoryOptions = categoryIds.map(id => data.categories[id].name);
      const { index } = await select(rl, 'Choose a category:', categoryOptions);
      
      const categoryId = categoryIds[index];
      const category = data.categories[categoryId];

      // Select number of questions
      const maxQuestions = category.questions.length;
      const countOptions = ['All questions', '3 questions', '5 questions'].filter((_, i) => {
        if (i === 0) return true;
        if (i === 1) return maxQuestions >= 3;
        if (i === 2) return maxQuestions >= 5;
        return false;
      });

      const { value: countChoice } = await select(rl, 'How many questions?', countOptions);
      
      let questionCount = maxQuestions;
      if (countChoice.includes('3')) questionCount = 3;
      if (countChoice.includes('5')) questionCount = 5;

      // Create and run quiz
      const questions = category.questions.slice(0, questionCount);
      const quiz = new Quiz(questions, category.name);

      console.log(`\n${colors.info('Starting quiz...')}`);
      console.log(colors.dim('Select your answer by entering the number.\n'));
      
      await pressEnter(rl);

      // Ask all questions
      while (!quiz.isComplete) {
        await quiz.askQuestion(rl);
        
        if (!quiz.isComplete) {
          await pressEnter(rl);
        }
      }

      // Show results
      quiz.showResults();

      // Play again?
      console.log('');
      playing = await confirm(rl, 'Would you like to play again?');
    }

    console.log(`\n${colors.success('Thanks for playing! Keep learning! 🚀')}\n`);
  } catch (error) {
    console.error(colors.error(`\nError: ${error.message}`));
    console.error(colors.dim('Stack trace:'), error.stack);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the application
main();
