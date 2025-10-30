/**
 * Sudoku Solver Class
 * Handles validation, placement checking, and solving of Sudoku puzzles
 */
class SudokuSolver {

  /**
   * Validates a puzzle string
   * @param {string} puzzleString - 81-character string with digits 1-9 and periods (.)
   * @returns {boolean} - True if valid, false otherwise
   */
  validate(puzzleString) {
    if (!puzzleString || typeof puzzleString !== 'string') {
      return false;
    }
    
    if (puzzleString.length !== 81) {
      return false;
    }
    
    const validChars = /^[1-9.]+$/;
    if (!validChars.test(puzzleString)) {
      return false;
    }
    
    return true;
  }

  /**
   * Converts row letter (A-I) to index (0-8)
   * @param {string} row - Single letter A through I
   * @returns {number} - Index 0-8, or -1 if invalid
   * @private
   */
  rowLetterToIndex(row) {
    if (!row || typeof row !== 'string' || row.length !== 1) {
      return -1;
    }
    const index = row.charCodeAt(0) - 'A'.charCodeAt(0);
    return (index >= 0 && index <= 8) ? index : -1;
  }

  /**
   * Converts column number (1-9) to index (0-8)
   * @param {number} column - Column number 1-9
   * @returns {number} - Index 0-8, or -1 if invalid
   * @private
   */
  colNumberToIndex(column) {
    if (typeof column !== 'number' || column < 1 || column > 9) {
      return -1;
    }
    return column - 1;
  }

  /**
   * Gets index in puzzle string from row and column
   * @param {string|number} row - Row letter (A-I) or index (0-8)
   * @param {number} column - Column number (1-9)
   * @returns {number} - Index in puzzle string, or -1 if invalid
   * @private
   */
  getIndex(row, column) {
    const rowIndex = typeof row === 'string' ? this.rowLetterToIndex(row) : row;
    const colIndex = this.colNumberToIndex(column);
    
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) {
      return -1;
    }
    
    return rowIndex * 9 + colIndex;
  }

  /**
   * Gets current value at position (row, column)
   * @param {string} puzzleString - Puzzle string
   * @param {string} row - Row letter A-I
   * @param {number} column - Column number 1-9
   * @returns {string|undefined} - Character at position or undefined if invalid
   */
  getValue(puzzleString, row, column) {
    if (!puzzleString || typeof puzzleString !== 'string') {
      return undefined;
    }
    
    const index = this.getIndex(row, column);
    if (index < 0 || index >= puzzleString.length) {
      return undefined;
    }
    
    return puzzleString[index];
  }

  /**
   * Checks if a value can be placed in a specific row
   * @param {string} puzzleString - Puzzle string
   * @param {string} row - Row letter A-I
   * @param {number} column - Column number 1-9
   * @param {string} value - Value to check (1-9)
   * @returns {boolean} - True if valid placement, false otherwise
   */
  checkRowPlacement(puzzleString, row, column, value) {
    if (!puzzleString || typeof puzzleString !== 'string' || puzzleString.length !== 81) {
      return false;
    }
    
    const rowIndex = this.rowLetterToIndex(row);
    const colIndex = this.colNumberToIndex(column);
    
    if (rowIndex < 0 || colIndex < 0 || !value || typeof value !== 'string') {
      return false;
    }
    
    // Check if the value is already placed at this position
    const currentValue = this.getValue(puzzleString, row, column);
    if (currentValue === value) {
      return true;
    }
    
    // Check if value already exists in the row
    const startIndex = rowIndex * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[startIndex + i] === value && i !== colIndex) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Checks if a value can be placed in a specific column
   * @param {string} puzzleString - Puzzle string
   * @param {string} row - Row letter A-I
   * @param {number} column - Column number 1-9
   * @param {string} value - Value to check (1-9)
   * @returns {boolean} - True if valid placement, false otherwise
   */
  checkColPlacement(puzzleString, row, column, value) {
    if (!puzzleString || typeof puzzleString !== 'string' || puzzleString.length !== 81) {
      return false;
    }
    
    const rowIndex = this.rowLetterToIndex(row);
    const colIndex = this.colNumberToIndex(column);
    
    if (rowIndex < 0 || colIndex < 0 || !value || typeof value !== 'string') {
      return false;
    }
    
    // Check if the value is already placed at this position
    const currentValue = this.getValue(puzzleString, row, column);
    if (currentValue === value) {
      return true;
    }
    
    // Check if value already exists in the column
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + colIndex;
      if (puzzleString[index] === value && i !== rowIndex) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Checks if a value can be placed in a specific 3x3 region
   * @param {string} puzzleString - Puzzle string
   * @param {string} row - Row letter A-I
   * @param {number} column - Column number 1-9
   * @param {string} value - Value to check (1-9)
   * @returns {boolean} - True if valid placement, false otherwise
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    if (!puzzleString || typeof puzzleString !== 'string' || puzzleString.length !== 81) {
      return false;
    }
    
    const rowIndex = this.rowLetterToIndex(row);
    const colIndex = this.colNumberToIndex(column);
    
    if (rowIndex < 0 || colIndex < 0 || !value || typeof value !== 'string') {
      return false;
    }
    
    // Check if the value is already placed at this position
    const currentValue = this.getValue(puzzleString, row, column);
    if (currentValue === value) {
      return true;
    }
    
    // Calculate region start indices (each region is 3x3)
    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;
    
    // Check if value already exists in the 3x3 region
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const checkRow = regionRowStart + i;
        const checkCol = regionColStart + j;
        const index = checkRow * 9 + checkCol;
        
        if (puzzleString[index] === value && !(checkRow === rowIndex && checkCol === colIndex)) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Checks if a value can be placed at a position (using string-based puzzle)
   * @param {string} puzzleString - Puzzle string
   * @param {number} rowIndex - Row index 0-8
   * @param {number} colIndex - Column index 0-8
   * @param {string} value - Value to check (1-9)
   * @returns {boolean} - True if valid placement, false otherwise
   * @private
   */
  canPlace(puzzleString, rowIndex, colIndex, value) {
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) {
      return false;
    }
    
    const rowLetter = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
    const column = colIndex + 1;
    
    return this.checkRowPlacement(puzzleString, rowLetter, column, value) &&
           this.checkColPlacement(puzzleString, rowLetter, column, value) &&
           this.checkRegionPlacement(puzzleString, rowLetter, column, value);
  }

  /**
   * Checks if a value can be placed at a position (using board array)
   * Optimized version that avoids string conversions
   * @param {number[][]} board - 2D array representing the board (0 = empty)
   * @param {number} rowIndex - Row index 0-8
   * @param {number} colIndex - Column index 0-8
   * @param {number} value - Value to check (1-9)
   * @returns {boolean} - True if valid placement, false otherwise
   * @private
   */
  canPlaceOnBoard(board, rowIndex, colIndex, value) {
    if (!board || rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8 || value < 1 || value > 9) {
      return false;
    }
    
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[rowIndex][i] === value && i !== colIndex) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][colIndex] === value && i !== rowIndex) {
        return false;
      }
    }
    
    // Check region
    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const checkRow = regionRowStart + i;
        const checkCol = regionColStart + j;
        if (board[checkRow][checkCol] === value && !(checkRow === rowIndex && checkCol === colIndex)) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Converts puzzle string to 2D array
   * @param {string} puzzleString - Puzzle string
   * @returns {number[][]} - 2D array (0 = empty, 1-9 = filled)
   * @private
   */
  stringToBoard(puzzleString) {
    if (!puzzleString || puzzleString.length !== 81) {
      return null;
    }
    
    const board = [];
    for (let i = 0; i < 9; i++) {
      board[i] = [];
      for (let j = 0; j < 9; j++) {
        const char = puzzleString[i * 9 + j];
        board[i][j] = char === '.' ? 0 : parseInt(char, 10);
      }
    }
    return board;
  }

  /**
   * Converts 2D array to puzzle string
   * @param {number[][]} board - 2D array representing the board
   * @returns {string} - Puzzle string
   * @private
   */
  boardToString(board) {
    if (!board || board.length !== 9) {
      return '';
    }
    
    let result = '';
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        result += board[i][j] === 0 ? '.' : board[i][j].toString();
      }
    }
    return result;
  }

  /**
   * Validates initial puzzle board for conflicts
   * Optimized version that checks conflicts directly without string conversions
   * @param {number[][]} board - 2D array representing the board
   * @returns {boolean} - True if no conflicts, false otherwise
   * @private
   */
  validateInitialBoard(board) {
    if (!board || board.length !== 9) {
      return false;
    }
    
    // Check each pre-filled cell for conflicts
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0) {
          const value = board[i][j];
          
          // Temporarily remove value to check for conflicts
          board[i][j] = 0;
          
          if (!this.canPlaceOnBoard(board, i, j, value)) {
            board[i][j] = value; // Restore value before returning
            return false;
          }
          
          board[i][j] = value; // Restore value
        }
      }
    }
    
    return true;
  }

  /**
   * Solves a Sudoku puzzle using backtracking with timeout protection
   * @param {string} puzzleString - Puzzle string to solve
   * @param {number} timeoutMs - Maximum time in milliseconds (default: 5000)
   * @returns {string|false} - Solution string or false if unsolvable/timed out
   */
  solve(puzzleString, timeoutMs = 5000) {
    // Validate puzzle
    if (!this.validate(puzzleString)) {
      return false;
    }
    
    const board = this.stringToBoard(puzzleString);
    if (!board) {
      return false;
    }
    
    // Check if initial puzzle is valid (no conflicts)
    if (!this.validateInitialBoard(board)) {
      return false;
    }
    
    // Track start time for timeout
    const startTime = Date.now();
    let iterationCount = 0;
    const maxIterations = 1000000; // Safety limit
    
    // Solve using backtracking
    const solveHelper = (board) => {
      iterationCount++;
      
      // Check timeout and iteration limit
      if (Date.now() - startTime > timeoutMs || iterationCount > maxIterations) {
        return false;
      }
      
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              // Use optimized canPlaceOnBoard instead of string conversion
              if (this.canPlaceOnBoard(board, row, col, num)) {
                board[row][col] = num;
                
                if (solveHelper(board)) {
                  return true;
                }
                
                board[row][col] = 0; // Backtrack
              }
            }
            return false; // No valid number found
          }
        }
      }
      return true; // Board is complete
    };
    
    if (solveHelper(board)) {
      return this.boardToString(board);
    }
    
    return false; // No solution found or timeout
  }
}

module.exports = SudokuSolver;

