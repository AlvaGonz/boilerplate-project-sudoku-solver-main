const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  suiteSetup(() => {
    solver = new Solver();
  });

  // Test 1: Logic handles a valid puzzle string of 81 characters
  test('Valid puzzle string of 81 characters', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validate(puzzleString);
    assert.equal(result, true);
    done();
  });

  // Test 2: Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Puzzle string with invalid characters', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A';
    const result = solver.validate(puzzleString);
    assert.equal(result, false);
    done();
  });

  // Test 3: Logic handles a puzzle string that is not 81 characters in length
  test('Puzzle string that is not 81 characters in length', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    const result = solver.validate(puzzleString);
    assert.equal(result, false);
    done();
  });

  // Test 4: Logic handles a valid row placement
  test('Valid row placement', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const row = 'A';
    const column = 2;
    const value = '3';
    const result = solver.checkRowPlacement(puzzleString, row, column, value);
    assert.equal(result, true);
    done();
  });

  // Test 5: Logic handles an invalid row placement
  test('Invalid row placement', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const row = 'A';
    const column = 2;
    const value = '1';
    const result = solver.checkRowPlacement(puzzleString, row, column, value);
    assert.equal(result, false);
    done();
  });

  // Test 6: Logic handles a valid column placement
  test('Valid column placement', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const row = 'A';
    const column = 2;
    const value = '3';
    const result = solver.checkColPlacement(puzzleString, row, column, value);
    assert.equal(result, true);
    done();
  });

  // Test 7: Logic handles an invalid column placement
  test('Invalid column placement', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const row = 'B';
    const column = 1;
    const value = '1';
    const result = solver.checkColPlacement(puzzleString, row, column, value);
    assert.equal(result, false);
    done();
  });

  // Test 8: Logic handles a valid region (3x3 grid) placement
  test('Valid region placement', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const row = 'A';
    const column = 2;
    const value = '3';
    const result = solver.checkRegionPlacement(puzzleString, row, column, value);
    assert.equal(result, true);
    done();
  });

  // Test 9: Logic handles an invalid region (3x3 grid) placement
  test('Invalid region placement', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const row = 'A';
    const column = 2;
    const value = '2';
    const result = solver.checkRegionPlacement(puzzleString, row, column, value);
    assert.equal(result, false);
    done();
  });

  // Test 10: Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(puzzleString);
    assert.notEqual(result, false);
    assert.isString(result);
    assert.lengthOf(result, 81);
    done();
  });

  // Test 11: Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', (done) => {
    const puzzleString = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(puzzleString);
    assert.equal(result, false);
    done();
  });

  // Test 12: Solver returns the expected solution for an incomplete puzzle
  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    const puzzleString = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
    const expectedSolution = '218396745753284196496157832531672984649831257827549613962415378185763429374928561';
    const result = solver.solve(puzzleString);
    assert.equal(result, expectedSolution);
    done();
  });
});
