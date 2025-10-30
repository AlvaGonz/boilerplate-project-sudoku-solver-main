const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error-msg");
const checkErrorMsg = document.getElementById("error");
const solveButton = document.getElementById("solve-button");
const checkButton = document.getElementById("check-button");

// Initialize with default puzzle
document.addEventListener("DOMContentLoaded", () => {
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillpuzzle(textArea.value);
});

textArea.addEventListener("input", () => {
  fillpuzzle(textArea.value);
  clearError(errorMsg);
});

function clearError(errorElement) {
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.className = "error-message";
  }
}

function showError(errorElement, message) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.className = "error-message";
    errorElement.style.display = "block";
  }
}

function showSuccess(messageElement, message) {
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = "error-message success";
    messageElement.style.display = "block";
  }
}

function fillpuzzle(data) {
  let len = data.length < 81 ? data.length : 81;
  for (let i = 0; i < len; i++) {
    let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
    let col = (i % 9) + 1; 
    const cell = document.getElementsByClassName(rowLetter + col)[0];
    if (cell) {
      if (!data[i] || data[i] === ".") {
        cell.innerText = " ";
        cell.className = `${rowLetter}${col} sudoku-input`;
      } else {
        cell.innerText = data[i];
        cell.className = `${rowLetter}${col} sudoku-input`;
      }
    }
  }
  return;
}

async function getSolved() {
  clearError(errorMsg);
  
  const puzzle = textArea.value.trim();
  if (!puzzle) {
    showError(errorMsg, "Please enter a puzzle string.");
    return;
  }

  // Disable button and show loading
  solveButton.disabled = true;
  const originalText = solveButton.querySelector("span").textContent;
  solveButton.querySelector("span").textContent = "Solving...";
  solveButton.classList.add("loading");

  try {
    const stuff = {"puzzle": puzzle};
    const response = await fetch("/api/solve", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify(stuff)
    });

    const parsed = await response.json();
    
    if (parsed.error) {
      showError(errorMsg, `Error: ${parsed.error}`);
    } else if (parsed.solution) {
      fillpuzzle(parsed.solution);
      showSuccess(errorMsg, "Puzzle solved successfully!");
      setTimeout(() => clearError(errorMsg), 3000);
    }
  } catch (error) {
    showError(errorMsg, `Network error: ${error.message}`);
  } finally {
    // Re-enable button
    solveButton.disabled = false;
    solveButton.querySelector("span").textContent = originalText;
    solveButton.classList.remove("loading");
  }
}

async function getChecked() {
  clearError(checkErrorMsg);
  
  const puzzle = textArea.value.trim();
  const coordinate = coordInput.value.trim();
  const value = valInput.value.trim();

  if (!puzzle) {
    showError(checkErrorMsg, "Please enter a puzzle string first.");
    return;
  }

  if (!coordinate) {
    showError(checkErrorMsg, "Please enter a coordinate (e.g., A1).");
    return;
  }

  if (!value) {
    showError(checkErrorMsg, "Please enter a value (1-9).");
    return;
  }

  // Disable button and show loading
  checkButton.disabled = true;
  const originalText = checkButton.querySelector("span").textContent;
  checkButton.querySelector("span").textContent = "Checking...";
  checkButton.classList.add("loading");

  try {
    const stuff = {
      "puzzle": puzzle, 
      "coordinate": coordinate, 
      "value": value
    };
    
    const response = await fetch("/api/check", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify(stuff)
    });

    const parsed = await response.json();
    
    if (parsed.error) {
      showError(checkErrorMsg, `Error: ${parsed.error}`);
    } else if (parsed.valid) {
      showSuccess(checkErrorMsg, "✓ Valid placement! No conflicts.");
      setTimeout(() => clearError(checkErrorMsg), 3000);
    } else if (parsed.conflict) {
      const conflicts = parsed.conflict.join(", ");
      showError(checkErrorMsg, `✗ Invalid placement. Conflicts in: ${conflicts}`);
    } else {
      showError(checkErrorMsg, `Result: ${JSON.stringify(parsed)}`);
    }
  } catch (error) {
    showError(checkErrorMsg, `Network error: ${error.message}`);
  } finally {
    // Re-enable button
    checkButton.disabled = false;
    checkButton.querySelector("span").textContent = originalText;
    checkButton.classList.remove("loading");
  }
}

solveButton.addEventListener("click", getSolved);
checkButton.addEventListener("click", getChecked);

// Allow Enter key to submit
textArea.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    getSolved();
  }
});

coordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getChecked();
  }
});

valInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getChecked();
  }
});