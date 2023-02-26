//API stuff
const TRIVIA_URL = "https://the-trivia-api.com/api/questions?limit=20";

//getting DOM elements
const name = document.getElementById("name");
const formBtn = document.getElementById("sub");

//Game score
const gameState = {
  name: "",
  score: 0,
  diff: "",
  questionNum: 0,
};
let time = 60;
//starts game

const startGame = (event) => {
  event.preventDefault();
  const name = document.getElementById("name")
  if (!name.value){
    alert("Please enter your name!")
  }
  else{
    makeSaveFile();
    getQuestions();
  }
};

const getQuestions = async () => {
  try {
    const diff = document.querySelector(
      "input[type='radio'][name=diff]:checked"
    ).value;

    const respone = await fetch(`${TRIVIA_URL}&difficulty=${diff}`);

    if (respone.status !== 200) {
      errorHandler();
    } else {
      const questions = await respone.json();
      saveQuestions(questions);
      removeForm();
      renderQuestion(gameState.questionNum);
    }
  } catch (error) {
    errorHandler(error);
  }
};

const removeForm = () => {
  const gameForm = document.getElementById("gameForm");
  gameForm.remove();
};

const clearQuestion = () => {
  const gameContent = document.getElementById("gameContent");
  gameContent.innerHTML = "";
};

const renderQuestion = (questionNum) => {
  const questions = JSON.parse(localStorage.getItem("questions"));

  const correctAnswer = questions[questionNum].correctAnswer;

  const answers = [
    questions[questionNum].correctAnswer,
    questions[questionNum].incorrectAnswers[0],
    questions[questionNum].incorrectAnswers[1],
    questions[questionNum].incorrectAnswers[2],
  ];

  shuffleAnswers(answers);

  const questionsDiv = document.createElement("div");
  questionsDiv.setAttribute("class", "form-label text-center");

  const categoryDiv = document.createElement("div");
  categoryDiv.textContent = questions[questionNum].category;

  const timerDiv = document.createElement("div");
  timerDiv.setAttribute("id", "timer");
  const countdown = () => {
    const timerDisplay = document.getElementById("timer");
    timerDisplay.innerHTML = time;
    time--;
    if (time == -1) {
      checkAnswer(NaN, NaN, timer, "skip");
    } else if (time <= 9) {
      timerDisplay.classList.add("text-danger");
    }
  };
  const timer = setInterval(countdown, 1000);

  const questionDiv = document.createElement("div");
  questionDiv.textContent = questions[questionNum].question;

  questionsDiv.append(categoryDiv, questionDiv, timerDiv);

  const answersDiv = document.createElement("div");
  answersDiv.setAttribute("class", "list-group");

  answers.forEach((answer) => {
    const handleAnswer = (event) => {
      checkAnswer(answer, correctAnswer, timer, event);
    };

    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("button");
    button.addEventListener("click", handleAnswer);
    answersDiv.append(button);
  });

  const gameContent = document.getElementById("gameContent");

  gameContent.append(questionsDiv, answersDiv);
};

const saveQuestions = (questions) => {
  localStorage.setItem("questions", JSON.stringify(questions));
};

const shuffleAnswers = (array) => {
  let index = array.length;
  while (index !== 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
};

const checkAnswer = (answer, correct, timer, event) => {
  if (answer == correct) {
    gameState.score++;
    gameState.questionNum++;
    clearInterval(timer);
    time = 60;
    event.target.setAttribute(
      "style",
      "background-color: #198754; color: #fff;"
    );
    setTimeout(() => {
      if (gameState.questionNum < 20) {
        clearQuestion();
        renderQuestion(gameState.questionNum);
      } else {
        renderFinalScreen();
        saveSaveFile();
      }
    }, 3000);
  } else {
    gameState.questionNum++;
    clearInterval(timer);
    time = 60;
    if (event != "skip") {
      event.target.setAttribute(
        "style",
        "background-color: #dc3545; color: #fff;"
      );
      setTimeout(() => {
        if (gameState.questionNum < 20) {
          clearQuestion();
          renderQuestion(gameState.questionNum);
        } else {
          renderFinalScreen();
          saveSaveFile();
        }
      }, 3000);
    } else {
      if (gameState.questionNum < 20) {
        clearQuestion();
        renderQuestion(gameState.questionNum);
      } else {
        renderFinalScreen();
        saveSaveFile();
      }
    }
  }
};

const refreshPage = () => {
  window.location.reload();
};

const renderFinalScreen = () => {
  const gameContent = document.getElementById("gameContent");

  const finalMsgDiv = document.createElement("div");
  finalMsgDiv.setAttribute("class", "form-label text-center");
  finalMsgDiv.textContent = `Well done ${gameState.name}, your final score is ${gameState.score}`;

  const goBackBtn = document.createElement("button");
  goBackBtn.classList.add("button");
  goBackBtn.textContent = "Try again";

  goBackBtn.addEventListener("click", refreshPage);

  const scoresLink = document.createElement("a");
  scoresLink.setAttribute("href", "./scores.html");

  const seeScoresBtn = document.createElement("button");
  seeScoresBtn.classList.add("button");
  seeScoresBtn.textContent = "See your scores";

  scoresLink.append(seeScoresBtn);

  gameContent.append(finalMsgDiv, goBackBtn, scoresLink);
};

const makeSaveFile = () => {
  const nameInput = document.getElementById("name");
  const name = nameInput.value;
  const diff = document.querySelector(
    "input[type='radio'][name=diff]:checked"
  ).value;
  gameState.name = name;
  gameState.diff = diff;
};

const saveSaveFile = () => {
  const saves = JSON.parse(localStorage.getItem("saves")) || [];
  saves.push(gameState);
  localStorage.setItem("saves", JSON.stringify(saves));
};

const errorHandler = (error) => {
  console.error(error);
};

//starts game when button pressed
formBtn.addEventListener("click", startGame);
