class SudokuSolver {

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

  // Convert row letter (A-I) to index (0-8)
  rowLetterToIndex(row) {
    return row.charCodeAt(0) - 'A'.charCodeAt(0);
  }

  // Convert column number (1-9) to index (0-8)
  colNumberToIndex(column) {
    return column - 1;
  }

  // Get index in puzzle string from row and column
  getIndex(row, column) {
    const rowIndex = typeof row === 'string' ? this.rowLetterToIndex(row) : row;
    const colIndex = this.colNumberToIndex(column);
    return rowIndex * 9 + colIndex;
  }

  // Get current value at position (row, column)
  getValue(puzzleString, row, column) {
    const index = this.getIndex(row, column);
    return puzzleString[index];
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = this.rowLetterToIndex(row);
    const colIndex = this.colNumberToIndex(column);
    
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

  checkColPlacement(puzzleString, row, column, value) {
    const rowIndex = this.rowLetterToIndex(row);
    const colIndex = this.colNumberToIndex(column);
    
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

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = this.rowLetterToIndex(row);
    const colIndex = this.colNumberToIndex(column);
    
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

  // Check if a value can be placed at a position
  canPlace(puzzleString, rowIndex, colIndex, value) {
    const rowLetter = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
    const column = colIndex + 1;
    
    return this.checkRowPlacement(puzzleString, rowLetter, column, value) &&
           this.checkColPlacement(puzzleString, rowLetter, column, value) &&
           this.checkRegionPlacement(puzzleString, rowLetter, column, value);
  }

  // Convert puzzle string to 2D array
  stringToBoard(puzzleString) {
    const board = [];
    for (let i = 0; i < 9; i++) {
      board[i] = [];
      for (let j = 0; j < 9; j++) {
        const char = puzzleString[i * 9 + j];
        board[i][j] = char === '.' ? 0 : parseInt(char);
      }
    }
    return board;
  }

  // Convert 2D array to puzzle string
  boardToString(board) {
    let result = '';
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        result += board[i][j] === 0 ? '.' : board[i][j].toString();
      }
    }
    return result;
  }

  // Solve using backtracking
  solve(puzzleString) {
    // Validate puzzle
    if (!this.validate(puzzleString)) {
      return false;
    }
    
    const board = this.stringToBoard(puzzleString);
    
    // Check if initial puzzle is valid (no conflicts)
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0) {
          const value = board[i][j].toString();
          const rowLetter = String.fromCharCode('A'.charCodeAt(0) + i);
          const column = j + 1;
          
          // Temporarily remove value to check if it's valid
          const originalValue = puzzleString[i * 9 + j];
          const tempPuzzle = puzzleString.substring(0, i * 9 + j) + '.' + puzzleString.substring(i * 9 + j + 1);
          
          if (!this.canPlace(tempPuzzle, i, j, value)) {
            return false;
          }
        }
      }
    }
    
    // Solve using backtracking
    const solveHelper = (board) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              const numStr = num.toString();
              if (this.canPlace(this.boardToString(board), row, col, numStr)) {
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
    
    return false; // No solution found
  }
}

module.exports = SudokuSolver;

