function a(){return`
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <a href="/" class="home-link">🏠 Home</a>
        </div>
        <div class="header-right">
          <div id="auth-section">
            <!-- Auth content will be populated by GitHubAuth.updateUI() -->
          </div>
        </div>
      </div>
    </header>
  `}function t(){const e=a();document.body.insertAdjacentHTML("afterbegin",e)}export{t as i};
