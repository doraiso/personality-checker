let appData = null;
let warningData = null;
let questions = [];

let currentQuestionIndex = 0;
const answers = [];

let startTime = 0;
let timerId = null;

document.addEventListener("DOMContentLoaded", async () => {
  cacheElements();
  setupEvents();

  try {
    const [questionsResponse, warningResponse] = await Promise.all([
      fetch("json/questions.json"),
      fetch("json/warning.json")
    ]);

    if (!questionsResponse.ok) {
      throw new Error("questions.json の読み込みに失敗しました");
    }

    if (!warningResponse.ok) {
      throw new Error("warning.json の読み込みに失敗しました");
    }

    appData = await questionsResponse.json();
    warningData = await warningResponse.json();
    questions = appData.questions || [];

    applyAppText();
  } catch (error) {
    console.error(error);
    alert("診断データの読み込みに失敗しました。GitHub Pages またはローカルサーバー上で開いてください。");
  }
});

let startButton;
let resultButton;
let restartButton;

let title;
let lead;
let topDescription;

let questionCount;
let questionText;
let choices;
let progress;
let progressBar;
let timer;
let email;

function cacheElements() {
  startButton = document.getElementById("startButton");
  resultButton = document.getElementById("resultButton");
  restartButton = document.getElementById("restartButton");

  title = document.querySelector("#topScreen h1");
  lead = document.querySelector("#topScreen .lead");
  topDescription = document.querySelector("#topScreen .top-description");

  questionCount = document.getElementById("questionCount");
  questionText = document.getElementById("questionText");
  choices = document.getElementById("choices");
  progress = document.getElementById("progress");
  progressBar = document.getElementById("progressBar");
  timer = document.getElementById("timer");
  email = document.getElementById("email");
}

function setupEvents() {
  startButton.addEventListener("click", startDiagnosis);
  resultButton.addEventListener("click", showWarning);
  restartButton.addEventListener("click", restart);
}

function applyAppText() {
  if (!appData || !appData.app) return;

  title.textContent = appData.app.title;
  lead.textContent = appData.app.lead;
  topDescription.textContent = appData.app.description;
  document.title = appData.app.title;
}

function renderWarning() {
  if (!warningData) {
    alert("警告データの読み込みが完了していません。");
    return false;
  }

  const warningTitle = document.getElementById("warningTitle");
  const warningSubtitle = document.getElementById("warningSubtitle");
  const warningBody = document.getElementById("warningBody");

  const resultTitle = document.getElementById("resultTitle");
  const resultType = document.getElementById("resultType");
  const resultDescription = document.getElementById("resultDescription");

  const checklistTitle = document.getElementById("checklistTitle");
  const checklistItems = document.getElementById("checklistItems");

  const requiredElements = [
    warningTitle,
    warningSubtitle,
    warningBody,
    resultTitle,
    resultType,
    resultDescription,
    checklistTitle,
    checklistItems
  ];

  if (requiredElements.some((element) => !element)) {
    console.error("警告画面のHTML要素が見つかりません。id指定を確認してください。");
    return false;
  }

  warningTitle.textContent = warningData.warning.title;
  warningSubtitle.textContent = warningData.warning.subtitle;

  warningBody.innerHTML = "";
  warningData.warning.paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    warningBody.appendChild(paragraph);
  });

  resultTitle.textContent = warningData.result.title;
  resultType.textContent = warningData.result.type;
  resultDescription.textContent = warningData.result.description;

  checklistTitle.textContent = warningData.checklist.title;
  checklistItems.innerHTML = "";
  warningData.checklist.items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    checklistItems.appendChild(item);
  });

  return true;
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

function startDiagnosis() {
  if (!questions.length) {
    alert("質問データの読み込みが完了していません。");
    return;
  }

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

  const rendered = renderWarning();
  if (!rendered) return;

  showScreen("warningScreen");
}

function restart() {
  email.value = "";
  stopTimer();
  showScreen("topScreen");
}
