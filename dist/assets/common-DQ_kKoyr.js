import"./style-BGZcYuD9.js";const d="your-github-client-id",m=window.location.origin+"/auth-callback.html",p="repo";let o=null,u=null;class h{constructor(t,e,s){this.duration=t,this.onTick=e,this.onComplete=s,this.timeLeft=t,this.interval=null,this.isRunning=!1}start(){this.isRunning=!0,this.interval=setInterval(()=>{this.timeLeft--,this.onTick&&this.onTick(this.timeLeft),this.timeLeft<=0&&(this.stop(),this.onComplete&&this.onComplete())},1e3)}stop(){this.isRunning=!1,this.interval&&(clearInterval(this.interval),this.interval=null)}getTimeLeft(){return this.timeLeft}formatTime(t){const e=Math.floor(t/60),s=t%60;return`${e.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`}}class c{static async login(){const t=`https://github.com/login/oauth/authorize?client_id=${d}&redirect_uri=${encodeURIComponent(m)}&scope=${p}`;window.location.href=t}static async logout(){o=null,u=null,localStorage.removeItem("github_token"),localStorage.removeItem("github_user"),this.updateUI()}static async handleCallback(t){try{const e=await fetch("/api/github/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:t})});if(e.ok){const s=await e.json();u=s.access_token,o=s.user,localStorage.setItem("github_token",u),localStorage.setItem("github_user",JSON.stringify(o)),this.updateUI()}}catch(e){console.error("Auth error:",e)}}static async loadUser(){const t=localStorage.getItem("github_token"),e=localStorage.getItem("github_user");t&&e&&(u=t,o=JSON.parse(e),this.updateUI())}static updateUI(){const t=document.getElementById("auth-section");t&&(o?t.innerHTML=`
        <span>Welcome, ${o.login}!</span>
        <button onclick="GitHubAuth.logout()" class="auth-btn logout-btn">Logout</button>
      `:t.innerHTML=`
        <button onclick="GitHubAuth.login()" class="auth-btn login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Login with GitHub
        </button>
      `)}static async submitToGitHub(t){if(!o||!u)return alert("Please login with GitHub first"),!1;try{if((await fetch(`https://api.github.com/repos/${o.login}/brightly-responses/contents/quiz-${Date.now()}.json`,{method:"PUT",headers:{Authorization:`token ${u}`,"Content-Type":"application/json"},body:JSON.stringify({message:`Quiz submission: ${t.title}`,content:btoa(JSON.stringify(t,null,2))})})).ok)return alert("Quiz results submitted to GitHub successfully!"),!0;throw new Error("Failed to submit to GitHub")}catch(e){return console.error("GitHub submission error:",e),alert("Failed to submit to GitHub. Please try again."),!1}}}class l{constructor(){this.questions=[],this.answers=[],this.startTime=null,this.endTime=null,this.timer=null}startQuiz(){this.startTime=new Date}endQuiz(){this.endTime=new Date,this.timer&&this.timer.stop()}addQuestion(t,e){this.questions.push({question:t,correctAnswer:e,userAnswer:null,isCorrect:!1,timeSpent:null,status:"not_attempted"})}submitAnswer(t,e,s){if(t<this.questions.length){const i=this.questions[t];i.userAnswer=e,i.timeSpent=s,i.isCorrect=e===i.correctAnswer,i.status=i.isCorrect?"correct":"incorrect"}}markTimeout(t){t<this.questions.length&&(this.questions[t].status="timeout")}getResults(){const t=this.questions.length,e=this.questions.filter(n=>n.status==="correct").length,s=this.questions.filter(n=>n.status==="incorrect").length,i=this.questions.filter(n=>n.status==="timeout").length,r=this.questions.filter(n=>n.status==="not_attempted").length;return{total:t,correct:e,incorrect:s,timeout:i,notAttempted:r,percentage:Math.round(e/t*100),duration:this.endTime?this.endTime-this.startTime:0}}exportData(t){return{title:t,user:o?o.login:"anonymous",timestamp:new Date().toISOString(),results:this.getResults(),questions:this.questions,startTime:this.startTime,endTime:this.endTime}}}class g{constructor(){this.questions=[],this.currentQuestionIndex=0,this.quizResults=new l,this.timer=null,this.questionStartTime=null,this.questionGenerator=null,this.initializeElements(),this.bindEvents()}initializeElements(){this.configSection=document.getElementById("config-section"),this.quizSection=document.getElementById("quiz-section"),this.resultsSection=document.getElementById("results-section"),this.generateBtn=document.getElementById("generate-quiz"),this.prevBtn=document.getElementById("prev-question"),this.nextBtn=document.getElementById("next-question"),this.finishBtn=document.getElementById("finish-quiz"),this.submitBtn=document.getElementById("submit-to-github"),this.newQuizBtn=document.getElementById("new-quiz"),this.questionContainer=document.getElementById("question-container"),this.questionCounter=document.getElementById("question-counter"),this.timerDisplay=document.getElementById("timer-display"),this.resultsSummary=document.getElementById("results-summary"),this.resultsDetails=document.getElementById("results-details")}bindEvents(){this.generateBtn.addEventListener("click",()=>this.generateQuiz()),this.prevBtn.addEventListener("click",()=>this.previousQuestion()),this.nextBtn.addEventListener("click",()=>this.nextQuestion()),this.finishBtn.addEventListener("click",()=>this.finishQuiz()),this.submitBtn.addEventListener("click",()=>this.submitToGitHub()),this.newQuizBtn.addEventListener("click",()=>this.resetQuiz())}setQuestionGenerator(t){this.questionGenerator=t}generateQuiz(){if(!this.questionGenerator){console.error("Question generator not set");return}const t=parseInt(document.getElementById("questionCount").value),e=parseInt(document.getElementById("timeLimit").value);this.questions=this.questionGenerator.generateQuestions(t),this.currentQuestionIndex=0,this.quizResults=new l,this.questions.forEach(s=>{this.quizResults.addQuestion(s.question,s.correctAnswer)}),e>0&&(this.timer=new h(e*60,s=>this.updateTimer(s),()=>this.timeUp()),this.timer.start()),this.quizResults.startQuiz(),this.showQuiz(),this.displayQuestion()}showQuiz(){this.configSection.style.display="none",this.quizSection.style.display="block",this.resultsSection.style.display="none"}displayQuestion(){const t=this.questions[this.currentQuestionIndex];this.questionStartTime=Date.now(),this.questionCounter.textContent=`Question ${this.currentQuestionIndex+1} of ${this.questions.length}`,this.questionContainer.innerHTML=`
      <div class="question">
        <h3>${t.question}</h3>
        <div class="answer-input">
          <input type="number" id="answer-input" placeholder="Enter your answer" autocomplete="off">
          <button id="submit-answer" class="primary-btn">Submit Answer</button>
        </div>
        <div id="answer-feedback"></div>
      </div>
    `;const e=document.getElementById("answer-input"),s=document.getElementById("submit-answer");e.addEventListener("keypress",i=>{i.key==="Enter"&&this.submitAnswer()}),s.addEventListener("click",()=>this.submitAnswer()),e.focus(),this.prevBtn.disabled=this.currentQuestionIndex===0,this.nextBtn.style.display=this.currentQuestionIndex===this.questions.length-1?"none":"inline-block",this.finishBtn.style.display=this.currentQuestionIndex===this.questions.length-1?"inline-block":"none"}submitAnswer(){const t=document.getElementById("answer-input"),e=parseInt(t.value),s=document.getElementById("answer-feedback");if(isNaN(e)){s.innerHTML='<span class="error">Please enter a valid number</span>';return}const i=Date.now()-this.questionStartTime;this.quizResults.submitAnswer(this.currentQuestionIndex,e,i);const r=this.questions[this.currentQuestionIndex],n=e===r.correctAnswer;s.innerHTML=`
      <span class="${n?"correct":"incorrect"}">
        ${n?"✓ Correct!":`✗ Incorrect. The answer is ${r.correctAnswer}`}
      </span>
    `,t.disabled=!0,document.getElementById("submit-answer").disabled=!0}previousQuestion(){this.currentQuestionIndex>0&&(this.currentQuestionIndex--,this.displayQuestion())}nextQuestion(){this.currentQuestionIndex<this.questions.length-1&&(this.currentQuestionIndex++,this.displayQuestion())}finishQuiz(){this.quizResults.endQuiz(),this.timer&&this.timer.stop(),this.showResults()}timeUp(){alert("Time is up! Quiz will be submitted automatically."),this.finishQuiz()}updateTimer(t){this.timerDisplay.textContent=this.timer.formatTime(t),t<=60&&this.timerDisplay.classList.add("warning")}showResults(){this.configSection.style.display="none",this.quizSection.style.display="none",this.resultsSection.style.display="block";const t=this.quizResults.getResults();this.resultsSummary.innerHTML=`
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
          <span class="stat-label">Time Taken:</span>
          <span class="stat-value">${Math.round(t.duration/1e3)}s</span>
        </div>
      </div>
    `,this.resultsDetails.innerHTML=`
      <h3>Question Details</h3>
      <div class="question-results">
        ${this.quizResults.questions.map((e,s)=>`
          <div class="question-result ${e.status}">
            <div class="question-text">${this.questions[s].question}</div>
            <div class="answer-details">
              <span>Your Answer: ${e.userAnswer||"Not answered"}</span>
              <span>Correct Answer: ${e.correctAnswer}</span>
              <span class="status ${e.status}">${e.status.toUpperCase()}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `}async submitToGitHub(){const t=this.quizResults.exportData(this.quizTitle||"Quiz");await c.submitToGitHub(t)&&(this.submitBtn.textContent="Submitted ✓",this.submitBtn.disabled=!0)}resetQuiz(){this.configSection.style.display="block",this.quizSection.style.display="none",this.resultsSection.style.display="none",this.timer&&this.timer.stop(),this.questions=[],this.currentQuestionIndex=0,this.quizResults=null,this.timer=null}setQuizTitle(t){this.quizTitle=t}}document.addEventListener("DOMContentLoaded",()=>{c.loadUser()});window.GitHubAuth=c;window.QuizTimer=h;window.QuizResults=l;window.CommonQuizManager=g;
