import"./style-DxF7o9N_.js";import{i as p,q as l}from"./quiz-storage-BXD1QFHU.js";p();class v{constructor(){this.currentView="list",this.currentResultId=null,this.init()}init(){this.createViewerHTML(),this.bindEvents(),this.showResultsList()}createViewerHTML(){const t=document.getElementById("quiz-results-viewer");t&&t.remove();const s=`
      <div id="quiz-results-viewer" class="quiz-results-viewer">
        <div class="viewer-header">
          <h2>Quiz Results History</h2>
          <div class="viewer-controls">
            <button id="back-to-list" class="secondary-btn" style="display: none;">← Back to List</button>
            <button id="clear-all-results" class="danger-btn">Clear All Results</button>
          </div>
        </div>
        
        <div class="storage-stats" id="storage-stats">
          <!-- Storage statistics will be shown here -->
        </div>

        <div class="results-list-container" id="results-list-container">
          <!-- Results list will be shown here -->
        </div>

        <div class="result-detail-container" id="result-detail-container" style="display: none;">
          <!-- Individual result detail will be shown here -->
        </div>
      </div>
    `,e=document.getElementById("app");e&&e.insertAdjacentHTML("beforeend",s)}bindEvents(){const t=document.getElementById("back-to-list");t&&t.addEventListener("click",()=>{this.showResultsList()});const s=document.getElementById("clear-all-results");s&&s.addEventListener("click",()=>{this.clearAllResults()})}showResultsList(){this.currentView="list",this.currentResultId=null;const t=document.getElementById("results-list-container"),s=document.getElementById("result-detail-container"),e=document.getElementById("back-to-list");t&&(t.style.display="block"),s&&(s.style.display="none"),e&&(e.style.display="none"),this.updateStorageStats(),this.renderResultsList()}showResultDetail(t){this.currentView="detail",this.currentResultId=t;const s=document.getElementById("results-list-container"),e=document.getElementById("result-detail-container"),i=document.getElementById("back-to-list");s&&(s.style.display="none"),e&&(e.style.display="block"),i&&(i.style.display="inline-block"),this.renderResultDetail(t)}updateStorageStats(){const t=document.getElementById("storage-stats");if(!t)return;const s=l.getStorageStats();if(!s)return;const e=s.storagePercentage>80?"#ff6b6b":s.storagePercentage>60?"#ffd93d":"#6bcf7f";t.innerHTML=`
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Total Results:</span>
          <span class="stat-value">${s.totalResults}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Storage Used:</span>
          <span class="stat-value">${this.formatBytes(s.storageUsed)} / ${this.formatBytes(s.storageLimit)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Storage Usage:</span>
          <span class="stat-value" style="color: ${e}">${s.storagePercentage}%</span>
        </div>
      </div>
    `}renderResultsList(){const t=document.getElementById("results-list-container");if(!t)return;const s=l.getAllResults();if(s.length===0){t.innerHTML=`
        <div class="no-results">
          <p>No quiz results found.</p>
          <p>Complete some quizzes to see your results here!</p>
        </div>
      `;return}const e=s.map(i=>{const a=Math.round(i.correctAnswers/i.totalQuestions*100),r=a>=80?"#6bcf7f":a>=60?"#ffd93d":"#ff6b6b";return`
        <div class="result-item" data-result-id="${i.id}">
          <div class="result-header">
            <h3 class="quiz-type">${i.quizType}</h3>
            <span class="result-date">${i.dateTime}</span>
          </div>
          <div class="result-summary">
            <div class="result-stats">
              <span class="stat">
                <strong>Questions:</strong> ${i.totalQuestions}
              </span>
              <span class="stat">
                <strong>Correct:</strong> ${i.correctAnswers}
              </span>
              <span class="stat">
                <strong>Incorrect:</strong> ${i.incorrectAnswers}
              </span>
              <span class="stat score" style="color: ${r}">
                <strong>Score:</strong> ${a}%
              </span>
            </div>
            <div class="result-time">
              <span>Time: ${this.formatTime(i.timeSpent)}</span>
            </div>
          </div>
          <div class="result-actions">
            <button class="view-result-btn primary-btn" onclick="quizResultsViewer.showResultDetail('${i.id}')">
              View Details
            </button>
            <button class="delete-result-btn danger-btn" onclick="quizResultsViewer.deleteResult('${i.id}')">
              Delete
            </button>
          </div>
        </div>
      `}).join("");t.innerHTML=`
      <div class="results-list">
        ${e}
      </div>
    `}renderResultDetail(t){const s=document.getElementById("result-detail-container");if(!s)return;const e=l.getResultById(t);if(!e){s.innerHTML="<p>Result not found.</p>";return}const i=Math.round(e.correctAnswers/e.totalQuestions*100),a=i>=80?"#6bcf7f":i>=60?"#ffd93d":"#ff6b6b",r=e.questions.map((n,u)=>{const o=n.isCorrect,d=o?"#6bcf7f":"#ff6b6b",m=o?"✓ Correct":"✗ Incorrect";return`
        <div class="question-detail ${o?"correct":"incorrect"}">
          <div class="question-header">
            <span class="question-number">Question ${u+1}</span>
            <span class="question-status" style="color: ${d}">${m}</span>
            <span class="question-time">${this.formatTime(n.timeSpent)}</span>
          </div>
          <div class="question-content">
            <p class="question-text">${n.question}</p>
            <div class="answer-details">
              <div class="answer-item">
                <strong>Your Answer:</strong> <span class="user-answer">${n.userAnswer||"No answer"}</span>
              </div>
              <div class="answer-item">
                <strong>Correct Answer:</strong> <span class="correct-answer">${n.correctAnswer}</span>
              </div>
            </div>
          </div>
        </div>
      `}).join("");s.innerHTML=`
      <div class="result-detail">
        <div class="detail-header">
          <h2>${e.quizType}</h2>
          <p class="detail-date">Completed on: ${e.dateTime}</p>
        </div>
        
        <div class="detail-summary">
          <div class="summary-stats">
            <div class="summary-item">
              <span class="summary-label">Total Questions:</span>
              <span class="summary-value">${e.totalQuestions}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Correct Answers:</span>
              <span class="summary-value correct">${e.correctAnswers}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Incorrect Answers:</span>
              <span class="summary-value incorrect">${e.incorrectAnswers}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Score:</span>
              <span class="summary-value score" style="color: ${a}">${i}%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Time Spent:</span>
              <span class="summary-value">${this.formatTime(e.timeSpent)}</span>
            </div>
          </div>
        </div>

        <div class="questions-detail">
          <h3>Question Details</h3>
          <div class="questions-list">
            ${r}
          </div>
        </div>
      </div>
    `}deleteResult(t){confirm("Are you sure you want to delete this quiz result?")&&(l.deleteResult(t)?(this.currentView==="detail"&&this.currentResultId===t?this.showResultsList():this.renderResultsList(),this.updateStorageStats()):alert("Failed to delete quiz result."))}clearAllResults(){confirm("Are you sure you want to delete ALL quiz results? This action cannot be undone.")&&(l.clearAllResults()?this.showResultsList():alert("Failed to clear quiz results."))}formatBytes(t){if(t===0)return"0 Bytes";const s=1024,e=["Bytes","KB","MB","GB"],i=Math.floor(Math.log(t)/Math.log(s));return parseFloat((t/Math.pow(s,i)).toFixed(2))+" "+e[i]}formatTime(t){if(!t)return"0s";const s=Math.floor(t/1e3),e=Math.floor(s/60),i=s%60;return e>0?`${e}m ${i}s`:`${s}s`}}const c=new v;window.quizResultsViewer=c;c.showResultsList();
