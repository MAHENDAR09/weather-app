/**
 * Quiz game logic
 * Demonstrates: Classes, async/await, array methods, destructuring
 */

import * as colors from './colors.js';
import { select, pressEnter } from './input.js';

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
function shuffle(array) {
  const result = [...array]; // Create a copy
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // Swap using destructuring
  }
  return result;
}

/**
 * Quiz game class
 */
export class Quiz {
  constructor(questions, categoryName) {
    this.questions = shuffle(questions);
    this.categoryName = categoryName;
    this.currentIndex = 0;
    this.score = 0;
    this.answers = [];
  }

  /**
   * Gets the current question
   * @returns {Object|null}
   */
  get currentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  /**
   * Gets the total number of questions
   * @returns {number}
   */
  get totalQuestions() {
    return this.questions.length;
  }

  /**
   * Checks if quiz is complete
   * @returns {boolean}
   */
  get isComplete() {
    return this.currentIndex >= this.questions.length;
  }

  /**
   * Gets the current progress as a percentage
   * @returns {number}
   */
  get progress() {
    return Math.round((this.currentIndex / this.questions.length) * 100);
  }

  /**
   * Displays the current question and gets user answer
   * @param {readline.Interface} rl - Readline interface
   * @returns {Promise<boolean>} Whether answer was correct
   */
  async askQuestion(rl) {
    const q = this.currentQuestion;
    if (!q) return false;

    // Display progress bar
    const progressBar = this.renderProgressBar();
    console.log(`\n${colors.dim(progressBar)}`);
    console.log(colors.dim(`Question ${this.currentIndex + 1} of ${this.totalQuestions}`));
    
    // Ask the question
    const { index } = await select(
      rl,
      colors.bold(q.question),
      q.options
    );

    const isCorrect = index === q.answer;
    
    // Record the answer
    this.answers.push({
      question: q.question,
      userAnswer: index,
      correctAnswer: q.answer,
      isCorrect,
    });

    // Show result
    if (isCorrect) {
      this.score++;
      console.log(`\n${colors.success('✓ Correct!')}`);
    } else {
      console.log(`\n${colors.error('✗ Incorrect!')}`);
      console.log(`${colors.info('The correct answer was:')} ${q.options[q.answer]}`);
    }

    // Show explanation
    if (q.explanation) {
      console.log(`${colors.dim('💡')} ${colors.dim(q.explanation)}`);
    }

    this.currentIndex++;
    return isCorrect;
  }

  /**
   * Renders a visual progress bar
   * @returns {string}
   */
  renderProgressBar() {
    const width = 30;
    const filled = Math.round((this.currentIndex / this.totalQuestions) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${this.progress}%`;
  }

  /**
   * Displays final results
   */
  showResults() {
    console.log('\n' + '═'.repeat(50));
    console.log(colors.highlight('  📊 QUIZ RESULTS'));
    console.log('═'.repeat(50));

    const percentage = Math.round((this.score / this.totalQuestions) * 100);
    
    console.log(`\n  Category: ${colors.cyan(this.categoryName)}`);
    console.log(`  Score: ${colors.bold(`${this.score}/${this.totalQuestions}`)} (${percentage}%)`);
    
    // Performance message
    let message;
    let emoji;
    if (percentage === 100) {
      message = 'Perfect score! Amazing!';
      emoji = '🏆';
    } else if (percentage >= 80) {
      message = 'Great job! Well done!';
      emoji = '🌟';
    } else if (percentage >= 60) {
      message = 'Good effort! Keep learning!';
      emoji = '👍';
    } else if (percentage >= 40) {
      message = 'Not bad! Room for improvement.';
      emoji = '📚';
    } else {
      message = 'Keep practicing! You\'ll get better!';
      emoji = '💪';
    }
    
    console.log(`\n  ${emoji} ${colors.yellow(message)}`);
    console.log('\n' + '═'.repeat(50));
    
    // Show incorrect answers for review
    const incorrect = this.answers.filter(a => !a.isCorrect);
    if (incorrect.length > 0) {
      console.log(`\n${colors.warning('📝 Review these questions:')}\n`);
      incorrect.forEach((a, i) => {
        const q = this.questions.find(q => q.question === a.question);
        console.log(`${i + 1}. ${a.question}`);
        console.log(`   ${colors.red('Your answer:')} ${q.options[a.userAnswer]}`);
        console.log(`   ${colors.green('Correct:')} ${q.options[a.correctAnswer]}\n`);
      });
    }
  }
}
