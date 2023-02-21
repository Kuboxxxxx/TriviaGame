//API stuff
const TRIVIA_URL = "https://the-trivia-api.com/api/questions?limit=20";

//getting DOM elements
const name = document.getElementById("name");
const formBtn = document.getElementById("sub");

//starts game

const startGame = (event) => {
  event.preventDefault();
  getQuestions();
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
      renderQuestion();
    }
  } catch (error) {
    errorHandler();
  }
};

const renderQuestion = () => {
  let questions = JSON.parse(localStorage.getItem("questions"));

  const gameCanvas = document.getElementById("gameCanvas");

  gameCanvas.innerHTML = `<div>
  <div>${questions[0].category}</div>
  <div>${questions[0].question}</div>
</div>
<div>
  <button>${questions[0].correctAnswer}</button>
  <button>${questions[0].incorrectAnswers[0]}</button>
  <button>${questions[0].incorrectAnswers[1]}</button>
  <button>${questions[0].incorrectAnswers[2]}</button>
</div>`;
};

const saveQuestions = (questions) => {
  localStorage.setItem("questions", JSON.stringify(questions));
};

const shuffleAnswers = (array) => {
  let index = array.length;
  while (index != 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
};

const errorHandler = () => {
  console.log("error");
};
//starts game when button pressed

formBtn.addEventListener("click", startGame);
