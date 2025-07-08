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
