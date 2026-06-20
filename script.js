const questions = [
  {
    text: "初対面の人が多い場所では、あなたはどうすることが多いですか？",
    choices: [
      "自分から話しかけることが多い",
      "話しかけられれば自然に話す",
      "まずは周囲の様子を見る",
      "できれば静かに過ごしたい"
    ]
  },
  {
    text: "予定を立てるとき、あなたに近いのはどれですか？",
    choices: [
      "細かく計画を立てて進めたい",
      "大まかな流れだけ決めておきたい",
      "その場の状況に合わせたい",
      "予定を決めすぎると窮屈に感じる"
    ]
  },
  {
    text: "新しいことに挑戦するとき、あなたはどう感じやすいですか？",
    choices: [
      "楽しみでワクワクする",
      "不安はあるがやってみたい",
      "慎重に調べてから判断したい",
      "できれば慣れたことを続けたい"
    ]
  },
  {
    text: "人から頼みごとをされたとき、あなたに近い反応はどれですか？",
    choices: [
      "できるだけ助けたいと思う",
      "無理のない範囲で引き受ける",
      "内容によって慎重に考える",
      "自分の予定を優先したい"
    ]
  },
  {
    text: "ミスをしたとき、あなたはどうなりやすいですか？",
    choices: [
      "すぐに切り替えて次に進む",
      "原因を考えて改善しようとする",
      "しばらく気にしてしまう",
      "かなり落ち込んでしまう"
    ]
  }
];

let currentQuestionIndex = 0;
const answers = [];

let startTime = 0;
let timerId = null;

const startButton = document.getElementById("startButton");
const resultButton = document.getElementById("resultButton");
const restartButton = document.getElementById("restartButton");

const questionCount = document.getElementById("questionCount");
const questionText = document.getElementById("questionText");
const choices = document.getElementById("choices");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const timer = document.getElementById("timer");
const email = document.getElementById("email");

startButton.addEventListener("click", startDiagnosis);
resultButton.addEventListener("click", showWarning);
restartButton.addEventListener("click", restart);

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

function startDiagnosis() {
  currentQuestionIndex = 0;
  answers.length = 0;

  progress.classList.remove("visible");
  progressBar.style.width = "0%";
  timer.textContent = "経過時間: 0.000秒";

  showScreen("questionScreen");
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const question = questions[currentQuestionIndex];

  questionCount.textContent = `質問 ${currentQuestionIndex + 1} / ${questions.length}`;
  questionText.textContent = question.text;
  choices.innerHTML = "";

  if (currentQuestionIndex > 0) {
    progress.classList.add("visible");
  }

  const progressRate = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${progressRate}%`;

  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = choice;
    button.addEventListener("click", () => selectAnswer(index));
    choices.appendChild(button);
  });
}

function selectAnswer(choiceIndex) {
  answers.push(choiceIndex);
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    progress.classList.add("visible");
    progressBar.style.width = "100%";

    setTimeout(() => {
      stopTimer();
      showScreen("emailScreen");
    }, 300);
  } else {
    renderQuestion();
  }
}

function startTimer() {
  stopTimer();

  startTime = performance.now();

  timerId = setInterval(() => {
    const elapsedMs = performance.now() - startTime;
    const seconds = (elapsedMs / 1000).toFixed(3);
    timer.textContent = `経過時間: ${seconds}秒`;
  }, 10);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function showWarning() {
  const inputEmail = email.value.trim();

  if (!inputEmail) {
    alert("診断結果を見るにはメールアドレスの入力が必要です。");
    return;
  }

  showScreen("warningScreen");
}

function restart() {
  email.value = "";
  stopTimer();
  showScreen("topScreen");
}
