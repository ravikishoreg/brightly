import"./style-CfUSZSYk.js";import{t as w,s as z,q as Q}from"./quiz-storage-BXD1QFHU.js";function E(h){let t=h.correctAnswer;return Array.isArray(t)&&(t=t.join(",")),t=String(t),`${h.question.toLowerCase().trim()}_${t.toLowerCase().trim()}`.replace(/[^a-z0-9_]/g,"")}function R(h,t){return h.filter(e=>!t.has(E(e)))}const k="your-github-client-id",x=window.location.origin+"/auth-callback.html",M="repo",I={questionCount:[{value:"2",label:"2 Questions"},{value:"5",label:"5 Questions"},{value:"10",label:"10 Questions",selected:!0},{value:"15",label:"15 Questions"},{value:"20",label:"20 Questions"},{value:"30",label:"30 Questions"}],timeLimit:[{value:"0",label:"No Limit",selected:!0},{value:"1",label:"1 Minute"},{value:"2",label:"2 Minutes"},{value:"3",label:"3 Minutes"},{value:"4",label:"4 Minutes"},{value:"5",label:"5 Minutes"},{value:"10",label:"10 Minutes"},{value:"15",label:"15 Minutes"},{value:"20",label:"20 Minutes"}]};function N(){return`
    <div class="config-item">
      <label for="questionCount">Number of Questions:</label>
      <select id="questionCount">
        ${I.questionCount.map(h=>`<option value="${h.value}"${h.selected?" selected":""}>${h.label}</option>`).join("")}
      </select>
    </div>
    
    <div class="config-item">
      <label for="timeLimit">Time Limit (minutes):</label>
      <select id="timeLimit">
        ${I.timeLimit.map(h=>`<option value="${h.value}"${h.selected?" selected":""}>${h.label}</option>`).join("")}
      </select>
    </div>
    

  `}let f=null,v=null;class ${constructor(t,e,i){this.duration=t,this.onTick=e,this.onComplete=i,this.timeLeft=t,this.interval=null,this.isRunning=!1}start(){this.isRunning=!0,this.interval=setInterval(()=>{this.timeLeft--,this.onTick&&this.onTick(this.timeLeft),this.timeLeft<=0&&(this.stop(),this.onComplete&&this.onComplete())},1e3)}stop(){this.isRunning=!1,this.interval&&(clearInterval(this.interval),this.interval=null)}getTimeLeft(){return this.timeLeft}formatTime(t){const e=Math.floor(t/60),i=t%60;return`${e.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}`}}class A{static async login(){const t=`https://github.com/login/oauth/authorize?client_id=${k}&redirect_uri=${encodeURIComponent(x)}&scope=${M}`;window.location.href=t}static async logout(){f=null,v=null,localStorage.removeItem("github_token"),localStorage.removeItem("github_user"),this.updateUI()}static async handleCallback(t){try{const e=await fetch("/api/github/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:t})});if(e.ok){const i=await e.json();v=i.access_token,f=i.user,localStorage.setItem("github_token",v),localStorage.setItem("github_user",JSON.stringify(f)),this.updateUI()}}catch(e){console.error("Auth error:",e)}}static async loadUser(){const t=localStorage.getItem("github_token"),e=localStorage.getItem("github_user");t&&e&&(v=t,f=JSON.parse(e),this.updateUI())}static updateUI(){const t=document.getElementById("auth-section");t&&(f?t.innerHTML=`
        <span>Welcome, ${f.login}!</span>
        <button onclick="GitHubAuth.logout()" class="auth-btn logout-btn">Logout</button>
      `:t.innerHTML=`
        <button onclick="GitHubAuth.login()" class="auth-btn login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Login with GitHub
        </button>
      `)}static async submitToGitHub(t){if(!f||!v)return alert("Please login with GitHub first"),!1;try{if((await fetch(`https://api.github.com/repos/${f.login}/brightly-responses/contents/quiz-${Date.now()}.json`,{method:"PUT",headers:{Authorization:`token ${v}`,"Content-Type":"application/json"},body:JSON.stringify({message:`Quiz submission: ${t.title}`,content:btoa(JSON.stringify(t,null,2))})})).ok)return alert("Quiz results submitted to GitHub successfully!"),!0;throw new Error("Failed to submit to GitHub")}catch(e){return console.error("GitHub submission error:",e),alert("Failed to submit to GitHub. Please try again."),!1}}}class T{constructor(){this.questions=[],this.answers=[],this.startTime=null,this.endTime=null,this.timer=null}startQuiz(){this.startTime=new Date}endQuiz(){this.endTime=new Date,this.timer&&this.timer.stop()}addQuestion(t,e,i=null){this.questions.push({question:t,correctAnswer:e,userAnswer:null,isCorrect:!1,timeSpent:null,status:"not_attempted",fullQuestion:i})}submitAnswer(t,e,i){if(t<this.questions.length){const r=this.questions[t];r.userAnswer=e,r.timeSpent=i,r.isCorrect=e===r.correctAnswer,r.status=r.isCorrect?"correct":"incorrect"}}markTimeout(t){t<this.questions.length&&(this.questions[t].status="timeout")}getResults(){const t=this.questions.length,e=this.questions.filter(c=>c.status==="correct").length,i=this.questions.filter(c=>c.status==="incorrect").length,r=this.questions.filter(c=>c.status==="timeout").length,l=this.questions.filter(c=>c.status==="not_attempted").length;return{total:t,correct:e,incorrect:i,timeout:r,notAttempted:l,percentage:Math.round(e/t*100),duration:this.endTime?this.endTime-this.startTime:0}}exportData(t){return{title:t,user:f?f.login:"anonymous",timestamp:new Date().toISOString(),results:this.getResults(),questions:this.questions.map((e,i)=>{const r={questionNumber:i+1,question:e.question,correctAnswer:e.correctAnswer,userAnswer:e.userAnswer,isCorrect:e.isCorrect,timeSpent:e.timeSpent,status:e.status};if(e.fullQuestion&&e.fullQuestion.options){const l={...e.fullQuestion};l.correctAnswer=l.correctAnswer,r.fullQuestion=l}return r}),startTime:this.startTime,endTime:this.endTime}}}class L{constructor(){this.questions=[],this.currentQuestionIndex=0,this.quizResults=new T,this.timer=null,this.questionStartTime=null,this.quizStartTime=null,this.elapsedTimeInterval=null,this.questionGenerator=null,this.usedQuestions=new Set,this.initializeElements(),this.bindEvents()}initializeElements(){this.configSection=document.getElementById("config-section"),this.quizSection=document.getElementById("quiz-section"),this.resultsSection=document.getElementById("results-section"),this.generateBtn=document.getElementById("generate-quiz"),this.prevBtn=document.getElementById("prev-question"),this.nextBtn=document.getElementById("next-question"),this.finishBtn=document.getElementById("finish-quiz"),this.submitBtn=document.getElementById("submit-to-github"),this.newQuizBtn=document.getElementById("new-quiz"),this.debugBtn=document.getElementById("submit-debug"),this.questionContainer=document.getElementById("question-container"),this.questionCounter=document.getElementById("question-counter"),this.timerDisplay=document.getElementById("timer-display"),this.resultsSummary=document.getElementById("results-summary"),this.resultsDetails=document.getElementById("results-details"),this.questionCounter&&(this.questionCounter.style.display="none"),this.setupLearnModeButton()}bindEvents(){this.generateBtn.addEventListener("click",()=>this.generateQuiz()),this.prevBtn.addEventListener("click",()=>this.previousQuestion()),this.nextBtn.addEventListener("click",()=>this.nextQuestion()),this.finishBtn.addEventListener("click",()=>this.finishQuiz()),this.submitBtn.addEventListener("click",()=>this.submitToGitHub()),this.newQuizBtn.addEventListener("click",()=>this.resetQuiz()),this.debugBtn&&this.debugBtn.addEventListener("click",()=>this.showDebugData())}setQuestionGenerator(t){this.questionGenerator=t}generateQuiz(){if(!this.questionGenerator){console.error("Question generator not set");return}this.timer&&this.timer.stop(),this.stopElapsedTimeTracking();const t=parseInt(document.getElementById("questionCount").value),e=parseInt(document.getElementById("timeLimit").value);this.usedQuestions.clear(),this.questions=this.questionGenerator.generateQuestions(t,this.usedQuestions),this.currentQuestionIndex=0,this.quizResults=new T,this.questions.forEach(i=>{this.quizResults.addQuestion(i.question,i.correctAnswer,i)}),e>0?(this.timer=new $(e*60,i=>this.updateTimer(i),()=>this.timeUp()),this.timer.start()):(this.quizStartTime=Date.now(),this.startElapsedTimeTracking()),this.quizResults.startQuiz(),this.showQuiz(),this.displayQuestion()}showQuiz(){this.configSection.style.display="none",this.quizSection.style.display="block",this.resultsSection.style.display="none";const t=document.getElementById("question-counter");t&&(t.style.display="inline-block"),w(!1)}displayQuestion(){const t=this.questions[this.currentQuestionIndex];this.questionStartTime=Date.now();const e=document.getElementById("question-counter");e&&(e.textContent=`Question ${this.currentQuestionIndex+1} of ${this.questions.length}`);const i=this.getQuestionType(t),r=i==="multiple",l=i==="single",c=i==="number",a=i==="text",s=this.quizResults.questions[this.currentQuestionIndex],n=s&&s.userAnswer!==null&&s.userAnswer!==void 0;let o="";if(l)o=`
        <div class="options">
          ${(n?t.options:S(t.options)).map((d,p)=>{const y=n&&s.userAnswer===d;return`
          <label class="option ${n?"disabled":""}">
            <input type="radio" name="answer" value="${d}" ${y?"checked":""} ${n?"disabled":""}>
            <span class="option-text">${d}</span>
          </label>
        `}).join("")}
        </div>
      `;else if(r){const u=n&&Array.isArray(s.userAnswer)?s.userAnswer:[];o=`
        <div class="options">
          ${(n?t.options:S(t.options)).map((p,y)=>{const g=u.includes(p);return`
          <label class="option ${n?"disabled":""}">
            <input type="checkbox" name="answer" value="${p}" ${g?"checked":""} ${n?"disabled":""}>
            <span class="option-text">${p}</span>
          </label>
        `}).join("")}
        </div>
      `}else a?o=`
        <input type="text" id="answer-input" placeholder="" value="${n?s.userAnswer:""}" ${n?"disabled":""} autocomplete="off">
      `:o=`
        <input type="number" id="answer-input" placeholder="" value="${n?s.userAnswer:""}" ${n?"disabled":""} autocomplete="off">
      `;if(l||r?this.questionContainer.innerHTML=`
        <div class="question">
          <h3><span class="question-label">Q.</span> ${t.question}</h3>
          <div class="answer-input">
            <div class="mcq-row">
              <div class="answer-label">A.</div>
              ${o}
            </div>
            <button id="submit-answer" class="primary-btn mcq-submit" ${n?"disabled":""}>Submit</button>
          </div>
          <div id="answer-feedback"></div>
        </div>
      `:this.questionContainer.innerHTML=`
        <div class="question">
          <h3><span class="question-label">Q.</span> ${t.question}</h3>
          <div class="answer-input">
            <div class="answer-label">A.</div>
            ${o}
            <button id="submit-answer" class="primary-btn" ${n?"disabled":""}>Submit</button>
          </div>
          <div id="answer-feedback"></div>
        </div>
      `,n)this.showAnswerFeedback(t,s);else if(document.getElementById("submit-answer").addEventListener("click",()=>this.submitAnswer()),c||a){const m=document.getElementById("answer-input");m.addEventListener("keypress",d=>{d.key==="Enter"&&this.submitAnswer()}),m.focus()}this.prevBtn.disabled=this.currentQuestionIndex===0,this.nextBtn.style.display=this.currentQuestionIndex===this.questions.length-1?"none":"inline-block",this.finishBtn.style.display=this.currentQuestionIndex===this.questions.length-1?"inline-block":"none"}submitAnswer(){const t=this.questions[this.currentQuestionIndex],e=this.getQuestionType(t),i=e==="multiple",r=e==="single",l=e==="text",c=document.getElementById("answer-feedback");let a;if(r){const n=document.querySelector('input[name="answer"]:checked');if(!n){c.innerHTML='<span class="error">Please select an answer</span>';return}a=n.value}else if(i){const n=Array.from(document.querySelectorAll('input[name="answer"]:checked'));if(n.length===0){c.innerHTML='<span class="error">Please select at least one answer</span>';return}a=n.map(o=>o.value)}else if(l){if(a=document.getElementById("answer-input").value.trim(),!a){c.innerHTML='<span class="error">Please enter an answer</span>';return}}else{const n=document.getElementById("answer-input");if(a=parseFloat(n.value),isNaN(a)){c.innerHTML='<span class="error">Please enter a valid number</span>';return}}const s=Date.now()-this.questionStartTime;if(this.quizResults.submitAnswer(this.currentQuestionIndex,a,s),this.showAnswerFeedback(t,this.quizResults.questions[this.currentQuestionIndex]),r||i?document.querySelectorAll('input[name="answer"]').forEach(n=>{n.disabled=!0}):document.getElementById("answer-input").disabled=!0,document.getElementById("submit-answer").disabled=!0,this.currentQuestionIndex<this.questions.length-1){let n;if(i){const m=Array.isArray(t.correctAnswer)?t.correctAnswer:[];n=Array.isArray(a)&&a.length===m.length&&a.every(d=>m.includes(d))&&m.every(d=>a.includes(d))}else n=this.checkAnswerEquivalence(a,t.correctAnswer,t);const o=n?1e3:2500,u=document.getElementById("next-question");if(u){const m=u.querySelector(".next-btn-progress");m&&m.remove();const d=document.createElement("div");d.className="next-btn-progress",u.appendChild(d);const p=Date.now(),y=setInterval(()=>{const g=Date.now()-p,b=Math.min(g/o*100,100);d.style.width=`${b}%`,b>=100&&(clearInterval(y),d.parentNode&&d.remove(),this.nextQuestion())},50)}}}checkAnswerEquivalence(t,e,i){if(t===e)return!0;if(typeof e=="string"&&typeof t=="string"&&!e.includes("/"))return t.toLowerCase().trim()===e.toLowerCase().trim();if(typeof e=="string"&&e.includes("/")){const[r,l]=e.split("/").map(Number),c=r/l;if(typeof t=="number")return Math.abs(t-c)<.001;if(r===l&&t===1)return!0;if(typeof t=="string"&&t.includes("/")){const[a,s]=t.split("/").map(Number);return Math.abs(a/s-c)<.001}}if(typeof e=="number"&&typeof t=="string"){const r=parseFloat(t);if(!isNaN(r))return Math.abs(r-e)<.001}return!1}showAnswerFeedback(t,e){const i=document.getElementById("answer-feedback"),r=this.getQuestionType(t),l=r==="multiple",c=r==="single";let a;if(l){const n=Array.isArray(t.correctAnswer)?t.correctAnswer:[],o=Array.isArray(e.userAnswer)?e.userAnswer:[];a=o.length===n.length&&o.every(u=>n.includes(u))&&n.every(u=>o.includes(u))}else a=this.checkAnswerEquivalence(e.userAnswer,t.correctAnswer,t);let s=`
      <span class="${a?"correct":"incorrect"}">
        ${a?"✓ Correct!":`✗ Incorrect. The correct answer is: ${l?t.correctAnswer.join(", "):t.correctAnswer}`}
      </span>
    `;(c||l)&&t.explanation&&(s+=`<div class="explanation">${t.explanation}</div>`),i.innerHTML=s}previousQuestion(){this.currentQuestionIndex>0&&(this.currentQuestionIndex--,this.displayQuestion())}nextQuestion(){this.currentQuestionIndex<this.questions.length-1&&(this.currentQuestionIndex++,this.displayQuestion())}finishQuiz(){this.quizResults.endQuiz(),this.timer&&this.timer.stop(),this.stopElapsedTimeTracking(),this.showResults()}timeUp(){alert("Time is up! Quiz will be submitted automatically."),this.finishQuiz()}startElapsedTimeTracking(){this.elapsedTimeInterval=setInterval(()=>{const t=Date.now()-this.quizStartTime;this.updateElapsedTime(t)},1e3)}stopElapsedTimeTracking(){this.elapsedTimeInterval&&(clearInterval(this.elapsedTimeInterval),this.elapsedTimeInterval=null),this.timerDisplay&&(this.timerDisplay.textContent="")}updateElapsedTime(t){const e=Math.floor(t/1e3),i=Math.floor(e/60),r=e%60;this.timerDisplay.textContent=`Time: ${i}:${r.toString().padStart(2,"0")}`}updateTimer(t){this.timerDisplay.textContent=this.timer.formatTime(t),t<=60&&this.timerDisplay.classList.add("warning")}showResults(){this.configSection.style.display="none",this.quizSection.style.display="none",this.resultsSection.style.display="block";const t=this.quizResults.getResults();this.saveQuizResults(t);const e=this.quizResults.questions.filter(s=>s.timeSpent),i=e.reduce((s,n)=>s+n.timeSpent,0),r=e.length>0?i/e.length:0,l=e.length>0?Math.min(...e.map(s=>s.timeSpent)):0,c=e.length>0?Math.max(...e.map(s=>s.timeSpent)):0,a=s=>{const n=Math.round(s/1e3),o=Math.floor(n/60),u=n%60;return o>0?`${o}m ${u}s`:`${n}s`};this.resultsSummary.innerHTML=`
      <div class="results-stats">
        <div class="stat">
          <span class="stat-label">Total Questions:</span>
          <span class="stat-value">${t.total}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Correct:</span>
          <span class="stat-value correct">${t.correct}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Incorrect:</span>
          <span class="stat-value incorrect">${t.incorrect}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Not Attempted:</span>
          <span class="stat-value">${t.notAttempted}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Score:</span>
          <span class="stat-value">${t.percentage}%</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total Time:</span>
          <span class="stat-value">${a(t.duration)}</span>
        </div>
        ${e.length>0?`
        <div class="stat">
          <span class="stat-label">Avg Time/Question:</span>
          <span class="stat-value">${a(r)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Fastest Question:</span>
          <span class="stat-value">${a(l)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Slowest Question:</span>
          <span class="stat-value">${a(c)}</span>
        </div>
        `:""}
      </div>
    `,this.resultsDetails.innerHTML=`
      <h3>Question Details</h3>
      <div class="question-results">
        ${this.quizResults.questions.map((s,n)=>{const o=this.questions[n],u=this.getQuestionType(o),m=u==="multiple",d=u==="single",p=u==="number",y=u==="text";let g="Not answered",b=s.correctAnswer;m?(Array.isArray(s.userAnswer)&&s.userAnswer.length>0&&(g=s.userAnswer.join(", ")),b=Array.isArray(s.correctAnswer)?s.correctAnswer.join(", "):""):(d||p||y)&&(s.userAnswer!==null&&s.userAnswer!==void 0&&(g=s.userAnswer),b=s.correctAnswer),s.timeSpent&&Math.round(s.timeSpent/1e3);const q=s.timeSpent?a(s.timeSpent):"Not answered",C=s.status==="incorrect"?`<strong>${b}</strong>`:b;return`
            <div class="question-result ${s.status}">
              <div class="question-text">${o.question}</div>
              <div class="answer-details">
                <span>Your Answer: ${g}</span>
                <span>Correct Answer: ${C}</span>
                <span>Time: ${q}</span>
                <span class="status ${s.status}">${s.status.toUpperCase()}</span>
              </div>
            </div>
          `}).join("")}
      </div>
    `}async submitToGitHub(){const t=this.quizResults.exportData(this.quizTitle||"Quiz");await A.submitToGitHub(t)&&(this.submitBtn.textContent="Submitted ✓",this.submitBtn.disabled=!0)}showDebugData(){const t=this.quizResults.exportData(this.quizTitle||"Quiz"),e=window.open("","_blank","width=800,height=600");e.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quiz Debug Data</title>
          <style>
            body { font-family: monospace; padding: 20px; background: #f5f5f5; }
            pre { background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd; overflow-x: auto; }
            h1 { color: #333; }
            .copy-btn { 
              background: #007bff; color: white; border: none; padding: 10px 20px; 
              border-radius: 5px; cursor: pointer; margin-bottom: 15px;
            }
            .copy-btn:hover { background: #0056b3; }
          </style>
        </head>
        <body>
          <h1>Quiz Debug Data</h1>
          <button class="copy-btn" onclick="copyToClipboard()">Copy to Clipboard</button>
          <pre id="debug-data">${JSON.stringify(t,null,2)}</pre>
          <script>
            function copyToClipboard() {
              const data = document.getElementById('debug-data').textContent;
              navigator.clipboard.writeText(data).then(() => {
                alert('Data copied to clipboard!');
              });
            }
          <\/script>
        </body>
      </html>
    `),e.document.close()}resetQuiz(){this.configSection.style.display="block",this.quizSection.style.display="none",this.resultsSection.style.display="none";const t=document.getElementById("question-counter");t&&(t.style.display="none"),w(!0),this.timer&&this.timer.stop(),this.stopElapsedTimeTracking(),this.timerDisplay&&(this.timerDisplay.textContent=""),this.questions=[],this.currentQuestionIndex=0,this.quizResults=null,this.timer=null,this.quizStartTime=null}setQuizTitle(t){this.quizTitle=t}setupLearnModeButton(){z(()=>this.showLearnMode()),w(!0)}showLearnMode(){if(!this.questionGenerator||!this.questionGenerator.getAllStaticQuestions){alert("Learn Mode is not available for this quiz type.");return}const t=this.questionGenerator.getAllStaticQuestions();if(!t||Object.keys(t).length===0){alert("No static questions available for Learn Mode.");return}this.createLearnModeModal(t)}createLearnModeModal(t){const e=document.getElementById("learn-mode-modal");e&&e.remove();const i=document.createElement("div");i.id="learn-mode-modal",i.className="learn-mode-modal";const r=Object.keys(t),l=[];r.forEach(o=>{t[o].forEach(u=>{l.push({...u,category:o})})});const c=l.map((o,u)=>{const m=o.options?o.options.map(p=>`<div class="option ${(Array.isArray(o.correctAnswer)?o.correctAnswer.includes(p):p===o.correctAnswer)?"correct":""}">${p}</div>`).join(""):"",d=o.options?`<div class="options">${m}</div>`:`<div class="correct-answer">Answer: <strong>${Array.isArray(o.correctAnswer)?o.correctAnswer.join(", "):o.correctAnswer}</strong></div>`;return`
        <div class="learn-question" data-category="${o.category}">
          <p class="question-text">${o.question}</p>
          ${d}
        </div>
      `}).join(""),a=["All",...r].map(o=>`<option value="${o}">${o}</option>`).join("");i.innerHTML=`
      <div class="learn-mode-content">
        <div class="learn-mode-header">
          <h2>Learn Mode</h2>
          <div class="learn-mode-controls">
            <select id="category-filter" class="category-filter">
              ${a}
            </select>
            <button class="close-btn" onclick="this.closest('.learn-mode-modal').remove()">×</button>
          </div>
        </div>
        <div class="learn-mode-body">
          <div class="questions-container">
            ${c}
          </div>
        </div>
      </div>
    `,document.body.appendChild(i);const s=document.getElementById("category-filter"),n=i.querySelector(".questions-container");s.addEventListener("change",o=>{const u=o.target.value;n.querySelectorAll(".learn-question").forEach(d=>{const p=d.dataset.category;u==="All"||p===u?d.style.display="block":d.style.display="none"})})}saveQuizResults(t){try{const e={totalQuestions:t.total,correctAnswers:t.correct,incorrectAnswers:t.incorrect,score:t.percentage,timeSpent:t.duration,questions:this.quizResults.questions.map((l,c)=>({question:this.questions[c]?.question||"Unknown question",correctAnswer:l.correctAnswer,userAnswer:l.userAnswer,isCorrect:l.status==="correct",timeSpent:l.timeSpent||0})),configuration:{questionCount:this.questions.length,timeLimit:this.timeLimit||0}},i=Q.formatQuizResult(e,this.quizTitle||"Quiz");Q.saveResult(i)?console.log("Quiz results saved successfully"):console.warn("Failed to save quiz results - storage may be full")}catch(e){console.error("Error saving quiz results:",e)}}getQuestionType(t){return t.type?t.type:Array.isArray(t.correctAnswer)?"multiple":t.options&&typeof t.correctAnswer=="string"?"single":typeof t.correctAnswer=="string"&&isNaN(t.correctAnswer)?"text":"number"}}document.addEventListener("DOMContentLoaded",()=>{A.loadUser()});function S(h){const t=[...h];for(let e=t.length-1;e>0;e--){const i=Math.floor(Math.random()*(e+1));[t[e],t[i]]=[t[i],t[e]]}return t}window.GitHubAuth=A;window.QuizTimer=$;window.QuizResults=T;window.CommonQuizManager=L;export{E as a,R as b,N as g};
