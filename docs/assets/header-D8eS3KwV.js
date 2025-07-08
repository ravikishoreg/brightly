function t(){return`
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <a href="${window.location.pathname.includes("/pages/")?"../index.html":"index.html"}" class="home-link">🏠 Home</a>
        </div>
        <div class="header-right">
          <div id="auth-section">
            <!-- Auth content will be populated by GitHubAuth.updateUI() -->
          </div>
        </div>
      </div>
    </header>
  `}function a(){const e=t();document.body.insertAdjacentHTML("afterbegin",e)}export{a as i};
