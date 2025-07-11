// Common header component
export function createHeader() {
  // Determine the path to index.html based on current location
  const pathToIndex = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
  
  return `
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <a href="${pathToIndex}" class="home-link">🏠 Home</a>
        </div>
        <div class="header-right">
          <button id="learn-mode-btn" class="secondary-btn learn-mode-btn" style="display: none;">📚 Learn Mode</button>
          <div id="auth-section">
            <!-- Auth content will be populated by GitHubAuth.updateUI() -->
          </div>
        </div>
      </div>
    </header>
  `;
}

export function insertHeader() {
  const header = createHeader();
  document.body.insertAdjacentHTML('afterbegin', header);
}

// Function to show/hide Learn Mode button
export function toggleLearnModeButton(show) {
  const learnModeBtn = document.getElementById('learn-mode-btn');
  if (learnModeBtn) {
    learnModeBtn.style.display = show ? 'inline-block' : 'none';
  }
}

// Function to set Learn Mode button click handler
export function setLearnModeButtonHandler(handler) {
  const learnModeBtn = document.getElementById('learn-mode-btn');
  if (learnModeBtn) {
    // Remove existing event listeners
    const newBtn = learnModeBtn.cloneNode(true);
    learnModeBtn.parentNode.replaceChild(newBtn, learnModeBtn);
    
    // Add new event listener
    newBtn.addEventListener('click', handler);
  }
}
