import"./style-B7_g1lDc.js";import{q as T}from"./quiz-storage-DIh2LGXt.js";function z(c){let t=c.correctAnswer;return Array.isArray(t)&&(t=t.join(",")),t=String(t),`${c.question.toLowerCase().trim()}_${t.toLowerCase().trim()}`.replace(/[^a-z0-9_]/g,"")}function M(c,t){return c.filter(e=>!t.has(z(e)))}const $="your-github-client-id",C=window.location.origin+"/auth-callback.html",k="repo",A={questionCount:[{value:"2",label:"2 Questions"},{value:"5",label:"5 Questions",selected:!0},{value:"10",label:"10 Questions"},{value:"15",label:"15 Questions"},{value:"20",label:"20 Questions"}],timeLimit:[{value:"0",label:"No Limit",selected:!0},{value:"1",label:"1 Minute"},{value:"2",label:"2 Minutes"},{value:"3",label:"3 Minutes"},{value:"4",label:"4 Minutes"},{value:"5",label:"5 Minutes"},{value:"10",label:"10 Minutes"},{value:"15",label:"15 Minutes"},{value:"20",label:"20 Minutes"}]};function D(){return`
    <div class="config-item">
      <label for="questionCount">Number of Questions:</label>
      <select id="questionCount">
        ${A.questionCount.map(c=>`<option value="${c.value}"${c.selected?" selected":""}>${c.label}</option>`).join("")}
      </select>
    </div>
    
    <div class="config-item">
      <label for="timeLimit">Time Limit (minutes):</label>
      <select id="timeLimit">
        ${A.timeLimit.map(c=>`<option value="${c.value}"${c.selected?" selected":""}>${c.label}</option>`).join("")}
      </select>
    </div>
    

  `}let p=null,y=null;class I{constructor(t,e,i){this.duration=t,this.onTick=e,this.onComplete=i,this.timeLeft=t,this.interval=null,this.isRunning=!1}start(){this.isRunning=!0,this.interval=setInterval(()=>{this.timeLeft--,this.onTick&&this.onTick(this.timeLeft),this.timeLeft<=0&&(this.stop(),this.onComplete&&this.onComplete())},1e3)}stop(){this.isRunning=!1,this.interval&&(clearInterval(this.interval),this.interval=null)}getTimeLeft(){return this.timeLeft}formatTime(t){const e=Math.floor(t/60),i=t%60;return`${e.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}`}}class v{static async login(){const t=`https://github.com/login/oauth/authorize?client_id=${$}&redirect_uri=${encodeURIComponent(C)}&scope=${k}`;window.location.href=t}static async logout(){p=null,y=null,localStorage.removeItem("github_token"),localStorage.removeItem("github_user"),this.updateUI()}static async handleCallback(t){try{const e=await fetch("/api/github/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:t})});if(e.ok){const i=await e.json();y=i.access_token,p=i.user,localStorage.setItem("github_token",y),localStorage.setItem("github_user",JSON.stringify(p)),this.updateUI()}}catch(e){console.error("Auth error:",e)}}static async loadUser(){const t=localStorage.getItem("github_token"),e=localStorage.getItem("github_user");t&&e&&(y=t,p=JSON.parse(e),this.updateUI())}static updateUI(){const t=document.getElementById("auth-section");t&&(p?t.innerHTML=`
        <span>Welcome, ${p.login}!</span>
        <button onclick="GitHubAuth.logout()" class="auth-btn logout-btn">Logout</button>
      `:t.innerHTML=`
        <button onclick="GitHubAuth.login()" class="auth-btn login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Login with GitHub
        </button>
      `)}static async submitToGitHub(t){if(!p||!y)return alert("Please login with GitHub first"),!1;try{if((await fetch(`https://api.github.com/repos/${p.login}/brightly-responses/contents/quiz-${Date.now()}.json`,{method:"PUT",headers:{Authorization:`token ${y}`,"Content-Type":"application/json"},body:JSON.stringify({message:`Quiz submission: ${t.title}`,content:btoa(JSON.stringify(t,null,2))})})).ok)return alert("Quiz results submitted to GitHub successfully!"),!0;throw new Error("Failed to submit to GitHub")}catch(e){return console.error("GitHub submission error:",e),alert("Failed to submit to GitHub. Please try again."),!1}}}class f{constructor(){this.questions=[],this.answers=[],this.startTime=null,this.endTime=null,this.timer=null}startQuiz(){this.startTime=new Date}endQuiz(){this.endTime=new Date,this.timer&&this.timer.stop()}addQuestion(t,e,i=null){this.questions.push({question:t,correctAnswer:e,userAnswer:null,isCorrect:!1,timeSpent:null,status:"not_attempted",fullQuestion:i})}submitAnswer(t,e,i){if(t<this.questions.length){const n=this.questions[t];n.userAnswer=e,n.timeSpent=i,n.isCorrect=e===n.correctAnswer,n.status=n.isCorrect?"correct":"incorrect"}}markTimeout(t){t<this.questions.length&&(this.questions[t].status="timeout")}getResults(){const t=this.questions.length,e=this.questions.filter(o=>o.status==="correct").length,i=this.questions.filter(o=>o.status==="incorrect").length,n=this.questions.filter(o=>o.status==="timeout").length,a=this.questions.filter(o=>o.status==="not_attempted").length;return{total:t,correct:e,incorrect:i,timeout:n,notAttempted:a,percentage:Math.round(e/t*100),duration:this.endTime?this.endTime-this.startTime:0}}exportData(t){return{title:t,user:p?p.login:"anonymous",timestamp:new Date().toISOString(),results:this.getResults(),questions:this.questions.map((e,i)=>{const n={questionNumber:i+1,question:e.question,correctAnswer:e.correctAnswer,userAnswer:e.userAnswer,isCorrect:e.isCorrect,timeSpent:e.timeSpent,status:e.status};if(e.fullQuestion&&e.fullQuestion.options){const a={...e.fullQuestion};a.correctAnswer=a.correctAnswer,n.fullQuestion=a}return n}),startTime:this.startTime,endTime:this.endTime}}}class E{constructor(){this.questions=[],this.currentQuestionIndex=0,this.quizResults=new f,this.timer=null,this.questionStartTime=null,this.quizStartTime=null,this.elapsedTimeInterval=null,this.questionGenerator=null,this.usedQuestions=new Set,this.initializeElements(),this.bindEvents()}initializeElements(){this.configSection=document.getElementById("config-section"),this.quizSection=document.getElementById("quiz-section"),this.resultsSection=document.getElementById("results-section"),this.generateBtn=document.getElementById("generate-quiz"),this.prevBtn=document.getElementById("prev-question"),this.nextBtn=document.getElementById("next-question"),this.finishBtn=document.getElementById("finish-quiz"),this.submitBtn=document.getElementById("submit-to-github"),this.newQuizBtn=document.getElementById("new-quiz"),this.debugBtn=document.getElementById("submit-debug"),this.questionContainer=document.getElementById("question-container"),this.questionCounter=document.getElementById("question-counter"),this.timerDisplay=document.getElementById("timer-display"),this.resultsSummary=document.getElementById("results-summary"),this.resultsDetails=document.getElementById("results-details"),this.questionCounter&&(this.questionCounter.style.display="none")}bindEvents(){this.generateBtn.addEventListener("click",()=>this.generateQuiz()),this.prevBtn.addEventListener("click",()=>this.previousQuestion()),this.nextBtn.addEventListener("click",()=>this.nextQuestion()),this.finishBtn.addEventListener("click",()=>this.finishQuiz()),this.submitBtn.addEventListener("click",()=>this.submitToGitHub()),this.newQuizBtn.addEventListener("click",()=>this.resetQuiz()),this.debugBtn&&this.debugBtn.addEventListener("click",()=>this.showDebugData())}setQuestionGenerator(t){this.questionGenerator=t}generateQuiz(){if(!this.questionGenerator){console.error("Question generator not set");return}this.timer&&this.timer.stop(),this.stopElapsedTimeTracking();const t=parseInt(document.getElementById("questionCount").value),e=parseInt(document.getElementById("timeLimit").value);this.usedQuestions.clear(),this.questions=this.questionGenerator.generateQuestions(t,this.usedQuestions),this.currentQuestionIndex=0,this.quizResults=new f,this.questions.forEach(i=>{this.quizResults.addQuestion(i.question,i.correctAnswer,i)}),e>0?(this.timer=new I(e*60,i=>this.updateTimer(i),()=>this.timeUp()),this.timer.start()):(this.quizStartTime=Date.now(),this.startElapsedTimeTracking()),this.quizResults.startQuiz(),this.showQuiz(),this.displayQuestion()}showQuiz(){this.configSection.style.display="none",this.quizSection.style.display="block",this.resultsSection.style.display="none";const t=document.getElementById("question-counter");t&&(t.style.display="inline-block")}displayQuestion(){const t=this.questions[this.currentQuestionIndex];this.questionStartTime=Date.now();const e=document.getElementById("question-counter");e&&(e.textContent=`Question ${this.currentQuestionIndex+1} of ${this.questions.length}`);const i=this.getQuestionType(t),n=i==="multiple",a=i==="single",o=i==="number",u=this.quizResults.questions[this.currentQuestionIndex],s=u&&u.userAnswer!==null&&u.userAnswer!==void 0;let l="";if(a)l=`
        <div class="options">
          ${(s?t.options:Q(t.options)).map((h,b)=>{const g=s&&u.userAnswer===h;return`
          <label class="option ${s?"disabled":""}">
            <input type="radio" name="answer" value="${h}" ${g?"checked":""} ${s?"disabled":""}>
            <span class="option-text">${h}</span>
          </label>
        `}).join("")}
        </div>
      `;else if(n){const d=s&&Array.isArray(u.userAnswer)?u.userAnswer:[];l=`
        <div class="options">
          ${(s?t.options:Q(t.options)).map((b,g)=>{const m=d.includes(b);return`
          <label class="option ${s?"disabled":""}">
            <input type="checkbox" name="answer" value="${b}" ${m?"checked":""} ${s?"disabled":""}>
            <span class="option-text">${b}</span>
          </label>
        `}).join("")}
        </div>
      `}else l=`
        <input type="number" id="answer-input" placeholder="" value="${s?u.userAnswer:""}" ${s?"disabled":""} autocomplete="off">
      `;if(a||n?this.questionContainer.innerHTML=`
        <div class="question">
          <h3><span class="question-label">Q.</span> ${t.question}</h3>
          <div class="answer-input">
            <div class="mcq-row">
              <div class="answer-label">A.</div>
              ${l}
            </div>
            <button id="submit-answer" class="primary-btn mcq-submit" ${s?"disabled":""}>Submit Answer</button>
          </div>
          <div id="answer-feedback"></div>
        </div>
      `:this.questionContainer.innerHTML=`
        <div class="question">
          <h3><span class="question-label">Q.</span> ${t.question}</h3>
          <div class="answer-input">
            <div class="answer-label">A.</div>
            ${l}
            <button id="submit-answer" class="primary-btn" ${s?"disabled":""}>Submit Answer</button>
          </div>
          <div id="answer-feedback"></div>
        </div>
      `,s)this.showAnswerFeedback(t,u);else if(document.getElementById("submit-answer").addEventListener("click",()=>this.submitAnswer()),o){const r=document.getElementById("answer-input");r.addEventListener("keypress",h=>{h.key==="Enter"&&this.submitAnswer()}),r.focus()}this.prevBtn.disabled=this.currentQuestionIndex===0,this.nextBtn.style.display=this.currentQuestionIndex===this.questions.length-1?"none":"inline-block",this.finishBtn.style.display=this.currentQuestionIndex===this.questions.length-1?"inline-block":"none"}submitAnswer(){const t=this.questions[this.currentQuestionIndex],e=this.getQuestionType(t),i=e==="multiple",n=e==="single",a=document.getElementById("answer-feedback");let o;if(n){const s=document.querySelector('input[name="answer"]:checked');if(!s){a.innerHTML='<span class="error">Please select an answer</span>';return}o=s.value}else if(i){const s=Array.from(document.querySelectorAll('input[name="answer"]:checked'));if(s.length===0){a.innerHTML='<span class="error">Please select at least one answer</span>';return}o=s.map(l=>l.value)}else{const s=document.getElementById("answer-input");if(o=parseInt(s.value),isNaN(o)){a.innerHTML='<span class="error">Please enter a valid number</span>';return}}const u=Date.now()-this.questionStartTime;if(this.quizResults.submitAnswer(this.currentQuestionIndex,o,u),this.showAnswerFeedback(t,this.quizResults.questions[this.currentQuestionIndex]),n||i?document.querySelectorAll('input[name="answer"]').forEach(s=>{s.disabled=!0}):document.getElementById("answer-input").disabled=!0,document.getElementById("submit-answer").disabled=!0,this.currentQuestionIndex<this.questions.length-1){let s;if(i){const r=Array.isArray(t.correctAnswer)?t.correctAnswer:[];s=Array.isArray(o)&&o.length===r.length&&o.every(h=>r.includes(h))&&r.every(h=>o.includes(h))}else s=o===t.correctAnswer;const l=s?1e3:2e3,d=document.getElementById("next-question");if(d){const r=document.createElement("div");r.className="next-btn-progress",d.appendChild(r);const h=Date.now(),b=setInterval(()=>{const g=Date.now()-h,m=Math.min(g/l*100,100);r.style.width=`${m}%`,m>=100&&(clearInterval(b),this.nextQuestion())},50)}}}showAnswerFeedback(t,e){const i=this.getQuestionType(t),n=i==="multiple",a=i==="single",o=document.getElementById("answer-feedback");let u;if(n){const l=Array.isArray(t.correctAnswer)?t.correctAnswer:[],d=Array.isArray(e.userAnswer)?e.userAnswer:[];u=d.length===l.length&&d.every(r=>l.includes(r))&&l.every(r=>d.includes(r))}else u=e.userAnswer===t.correctAnswer;let s=`
      <span class="${u?"correct":"incorrect"}">
        ${u?"✓ Correct!":`✗ Incorrect. The correct answer is: ${n?t.correctAnswer.join(", "):t.correctAnswer}`}
      </span>
    `;(a||n)&&t.explanation&&(s+=`<div class="explanation">${t.explanation}</div>`),o.innerHTML=s}previousQuestion(){this.currentQuestionIndex>0&&(this.currentQuestionIndex--,this.displayQuestion())}nextQuestion(){this.currentQuestionIndex<this.questions.length-1&&(this.currentQuestionIndex++,this.displayQuestion())}finishQuiz(){this.quizResults.endQuiz(),this.timer&&this.timer.stop(),this.stopElapsedTimeTracking(),this.showResults()}timeUp(){alert("Time is up! Quiz will be submitted automatically."),this.finishQuiz()}startElapsedTimeTracking(){this.elapsedTimeInterval=setInterval(()=>{const t=Date.now()-this.quizStartTime;this.updateElapsedTime(t)},1e3)}stopElapsedTimeTracking(){this.elapsedTimeInterval&&(clearInterval(this.elapsedTimeInterval),this.elapsedTimeInterval=null),this.timerDisplay&&(this.timerDisplay.textContent="")}updateElapsedTime(t){const e=Math.floor(t/1e3),i=Math.floor(e/60),n=e%60;this.timerDisplay.textContent=`Time: ${i}:${n.toString().padStart(2,"0")}`}updateTimer(t){this.timerDisplay.textContent=this.timer.formatTime(t),t<=60&&this.timerDisplay.classList.add("warning")}showResults(){this.configSection.style.display="none",this.quizSection.style.display="none",this.resultsSection.style.display="block";const t=this.quizResults.getResults();this.saveQuizResults(t);const e=this.quizResults.questions.filter(s=>s.timeSpent),i=e.reduce((s,l)=>s+l.timeSpent,0),n=e.length>0?i/e.length:0,a=e.length>0?Math.min(...e.map(s=>s.timeSpent)):0,o=e.length>0?Math.max(...e.map(s=>s.timeSpent)):0,u=s=>{const l=Math.round(s/1e3),d=Math.floor(l/60),r=l%60;return d>0?`${d}m ${r}s`:`${l}s`};this.resultsSummary.innerHTML=`
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
          <span class="stat-value">${u(t.duration)}</span>
        </div>
        ${e.length>0?`
        <div class="stat">
          <span class="stat-label">Avg Time/Question:</span>
          <span class="stat-value">${u(n)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Fastest Question:</span>
          <span class="stat-value">${u(a)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Slowest Question:</span>
          <span class="stat-value">${u(o)}</span>
        </div>
        `:""}
      </div>
    `,this.resultsDetails.innerHTML=`
      <h3>Question Details</h3>
      <div class="question-results">
        ${this.quizResults.questions.map((s,l)=>{const d=this.questions[l],r=this.getQuestionType(d),h=r==="multiple",b=r==="single",g=r==="number";let m="Not answered",w=s.correctAnswer;h?(Array.isArray(s.userAnswer)&&s.userAnswer.length>0&&(m=s.userAnswer.join(", ")),w=Array.isArray(s.correctAnswer)?s.correctAnswer.join(", "):""):(b||g)&&(s.userAnswer!==null&&s.userAnswer!==void 0&&(m=s.userAnswer),w=s.correctAnswer),s.timeSpent&&Math.round(s.timeSpent/1e3);const S=s.timeSpent?u(s.timeSpent):"Not answered",q=s.status==="incorrect"?`<strong>${w}</strong>`:w;return`
            <div class="question-result ${s.status}">
              <div class="question-text">${d.question}</div>
              <div class="answer-details">
                <span>Your Answer: ${m}</span>
                <span>Correct Answer: ${q}</span>
                <span>Time: ${S}</span>
                <span class="status ${s.status}">${s.status.toUpperCase()}</span>
              </div>
            </div>
          `}).join("")}
      </div>
    `}async submitToGitHub(){const t=this.quizResults.exportData(this.quizTitle||"Quiz");await v.submitToGitHub(t)&&(this.submitBtn.textContent="Submitted ✓",this.submitBtn.disabled=!0)}showDebugData(){const t=this.quizResults.exportData(this.quizTitle||"Quiz"),e=window.open("","_blank","width=800,height=600");e.document.write(`
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
    `),e.document.close()}resetQuiz(){this.configSection.style.display="block",this.quizSection.style.display="none",this.resultsSection.style.display="none";const t=document.getElementById("question-counter");t&&(t.style.display="none"),this.timer&&this.timer.stop(),this.stopElapsedTimeTracking(),this.timerDisplay&&(this.timerDisplay.textContent=""),this.questions=[],this.currentQuestionIndex=0,this.quizResults=null,this.timer=null,this.quizStartTime=null}setQuizTitle(t){this.quizTitle=t}saveQuizResults(t){try{const e={totalQuestions:t.total,correctAnswers:t.correct,incorrectAnswers:t.incorrect,score:t.percentage,timeSpent:t.duration,questions:this.quizResults.questions.map((a,o)=>({question:this.questions[o]?.question||"Unknown question",correctAnswer:a.correctAnswer,userAnswer:a.userAnswer,isCorrect:a.status==="correct",timeSpent:a.timeSpent||0})),configuration:{questionCount:this.questions.length,timeLimit:this.timeLimit||0}},i=T.formatQuizResult(e,this.quizTitle||"Quiz");T.saveResult(i)?console.log("Quiz results saved successfully"):console.warn("Failed to save quiz results - storage may be full")}catch(e){console.error("Error saving quiz results:",e)}}getQuestionType(t){return t.type?t.type:Array.isArray(t.correctAnswer)?"multiple":t.options&&typeof t.correctAnswer=="string"?"single":"number"}}document.addEventListener("DOMContentLoaded",()=>{v.loadUser()});function Q(c){const t=[...c];for(let e=t.length-1;e>0;e--){const i=Math.floor(Math.random()*(e+1));[t[e],t[i]]=[t[i],t[e]]}return t}window.GitHubAuth=v;window.QuizTimer=I;window.QuizResults=f;window.CommonQuizManager=E;export{z as a,M as b,D as g};
