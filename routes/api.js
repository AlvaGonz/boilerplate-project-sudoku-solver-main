'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  /**
   * Validates puzzle string and returns appropriate error message
   * @param {string} puzzle - Puzzle string to validate
   * @returns {{valid: boolean, error?: string}} - Validation result
   * @private
   */
  function validatePuzzle(puzzle) {
    if (typeof puzzle !== 'string') {
      return { valid: false, error: 'Puzzle must be a string' };
    }
    
    if (puzzle.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    
    if (!solver.validate(puzzle)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    
    return { valid: true };
  }

  /**
   * Validates value parameter (must be string or number between 1-9)
   * @param {any} value - Value to validate
   * @returns {{valid: boolean, error?: string, value?: string}} - Validation result
   * @private
   */
  function validateValue(value) {
    if (value === null || value === undefined) {
      return { valid: false, error: 'Value is required' };
    }
    
    // Convert to string first for consistent handling
    const valueStr = String(value);
    
    // Check if it's a valid integer string
    if (!/^\d+$/.test(valueStr)) {
      return { valid: false, error: 'Invalid value' };
    }
    
    const valueNum = parseInt(valueStr, 10);
    if (isNaN(valueNum) || valueNum < 1 || valueNum > 9) {
      return { valid: false, error: 'Invalid value' };
    }
    
    return { valid: true, value: valueStr };
  }

  /**
   * Gets placement conflicts for a given puzzle, coordinate, and value
   * @param {string} puzzle - Puzzle string
   * @param {string} row - Row letter A-I
   * @param {number} column - Column number 1-9
   * @param {string} valueStr - Value as string (1-9)
   * @returns {string[]} - Array of conflict types ('row', 'column', 'region')
   * @private
   */
  function getConflicts(puzzle, row, column, valueStr) {
    const conflicts = [];
    
    if (!solver.checkRowPlacement(puzzle, row, column, valueStr)) {
      conflicts.push('row');
    }
    if (!solver.checkColPlacement(puzzle, row, column, valueStr)) {
      conflicts.push('column');
    }
    if (!solver.checkRegionPlacement(puzzle, row, column, valueStr)) {
      conflicts.push('region');
    }
    
    return conflicts;
  }

  app.route('/api/check')
    .post((req, res) => {
      try {
        const { puzzle, coordinate, value } = req.body;
        
        // Check for missing required fields
        if (!puzzle || !coordinate || value === null || value === undefined) {
          return res.json({ error: 'Required field(s) missing' });
        }
        
        // Validate puzzle string
        const puzzleValidation = validatePuzzle(puzzle);
        if (!puzzleValidation.valid) {
          return res.json({ error: puzzleValidation.error });
        }
        
        // Validate coordinate format (A-I followed by 1-9)
        if (typeof coordinate !== 'string' || coordinate.length !== 2) {
          return res.json({ error: 'Invalid coordinate' });
        }
        
        const coordinateRegex = /^[A-I][1-9]$/;
        if (!coordinateRegex.test(coordinate)) {
          return res.json({ error: 'Invalid coordinate' });
        }
        
        // Validate value (1-9) with strict type checking
        const valueValidation = validateValue(value);
        if (!valueValidation.valid) {
          return res.json({ error: valueValidation.error });
        }
        
        const valueStr = valueValidation.value;
        
        // Extract row and column from coordinate
        const row = coordinate[0];
        const column = parseInt(coordinate[1], 10);
        
        // Check if the value is already placed at this coordinate
        const currentValue = solver.getValue(puzzle, row, column);
        if (currentValue === valueStr) {
          // Temporarily remove the value to check for conflicts
          const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
          const colIndex = column - 1;
          const index = rowIndex * 9 + colIndex;
          const tempPuzzle = puzzle.substring(0, index) + '.' + puzzle.substring(index + 1);
          
          // Get conflicts using helper function
          const conflicts = getConflicts(tempPuzzle, row, column, valueStr);
          
          if (conflicts.length === 0) {
            return res.json({ valid: true });
          } else {
            return res.json({ valid: false, conflict: conflicts });
          }
        }
        
        // Check placement validity using helper function
        const conflicts = getConflicts(puzzle, row, column, valueStr);
        
        if (conflicts.length === 0) {
          return res.json({ valid: true });
        } else {
          return res.json({ valid: false, conflict: conflicts });
        }
      } catch (error) {
        console.error('Error in /api/check:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      try {
        const { puzzle } = req.body;
        
        // Check for missing puzzle field
        if (!puzzle) {
          return res.json({ error: 'Required field missing' });
        }
        
        // Validate puzzle string using helper function
        const puzzleValidation = validatePuzzle(puzzle);
        if (!puzzleValidation.valid) {
          return res.json({ error: puzzleValidation.error });
        }
        
        // Attempt to solve the puzzle (with 5 second timeout by default)
        const solution = solver.solve(puzzle, 5000);
        
        if (solution === false) {
          return res.json({ error: 'Puzzle cannot be solved' });
        }
        
        return res.json({ solution: solution });
      } catch (error) {
        console.error('Error in /api/solve:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
};
