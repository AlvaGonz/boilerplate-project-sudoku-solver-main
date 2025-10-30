'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      
      // Check for missing required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      
      // Validate puzzle string
      if (!solver.validate(puzzle)) {
        if (puzzle.length !== 81) {
          return res.json({ error: 'Expected puzzle to be 81 characters long' });
        }
        return res.json({ error: 'Invalid characters in puzzle' });
      }
      
      // Validate coordinate format (A-I followed by 1-9)
      const coordinateRegex = /^[A-I][1-9]$/;
      if (!coordinateRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      
      // Validate value (1-9)
      const valueNum = parseInt(value);
      if (isNaN(valueNum) || valueNum < 1 || valueNum > 9) {
        return res.json({ error: 'Invalid value' });
      }
      
      // Extract row and column from coordinate
      const row = coordinate[0];
      const column = parseInt(coordinate[1]);
      const valueStr = value.toString();
      
      // Check if the value is already placed at this coordinate
      const currentValue = solver.getValue(puzzle, row, column);
      if (currentValue === valueStr) {
        // Temporarily remove the value to check for conflicts
        const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
        const colIndex = column - 1;
        const index = rowIndex * 9 + colIndex;
        const tempPuzzle = puzzle.substring(0, index) + '.' + puzzle.substring(index + 1);
        
        // Check if the value can be placed without conflicts
        const conflicts = [];
        if (!solver.checkRowPlacement(tempPuzzle, row, column, valueStr)) {
          conflicts.push('row');
        }
        if (!solver.checkColPlacement(tempPuzzle, row, column, valueStr)) {
          conflicts.push('column');
        }
        if (!solver.checkRegionPlacement(tempPuzzle, row, column, valueStr)) {
          conflicts.push('region');
        }
        
        if (conflicts.length === 0) {
          return res.json({ valid: true });
        } else {
          return res.json({ valid: false, conflict: conflicts });
        }
      }
      
      // Check placement validity
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
      
      if (conflicts.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      
      // Check for missing puzzle field
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      
      // Validate puzzle string
      if (!solver.validate(puzzle)) {
        if (puzzle.length !== 81) {
          return res.json({ error: 'Expected puzzle to be 81 characters long' });
        }
        return res.json({ error: 'Invalid characters in puzzle' });
      }
      
      // Attempt to solve the puzzle
      const solution = solver.solve(puzzle);
      
      if (solution === false) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      
      return res.json({ solution: solution });
    });
};
