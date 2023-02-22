//API stuff
const TRIVIA_URL = "https://the-trivia-api.com/api/questions?limit=20";

//getting DOM elements
const name = document.getElementById("name");
const formBtn = document.getElementById("sub");

//Game score
const gameState = {
  score: 0,
  questionNum: 0,
}
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
      renderQuestion(gameState.questionNum);
    }
  } catch (error) {
    errorHandler();
  }
};

const renderQuestion = (questionNum) => {
  let questions = JSON.parse(localStorage.getItem("questions"));

  let correctAnswer = questions[questionNum].correctAnswer

  let answers = [questions[questionNum].correctAnswer,questions[questionNum].incorrectAnswers[0],questions[questionNum].incorrectAnswers[1],questions[questionNum].incorrectAnswers[2]]
  
  shuffleAnswers(answers)

  const gameCanvas = document.getElementById("gameCanvas");
  
  gameCanvas.innerHTML = `<div>
  <div>Question number ${gameState.questionNum+1}</div>
  <div>${questions[questionNum].category}</div>
  <div>${questions[questionNum].question}</div>
</div>
<div id="test">
  <button onclick="checkAnswer('${answers[0]}','${correctAnswer}')">${answers[0]}</button>
  <button onclick="checkAnswer('${answers[1]}','${correctAnswer}')">${answers[1]}</button>
  <button onclick="checkAnswer('${answers[2]}','${correctAnswer}')">${answers[2]}</button>
  <button onclick="checkAnswer('${answers[3]}','${correctAnswer}')">${answers[3]}</button>
</div>`;
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

const checkAnswer = (answer, correct) => {
  if(answer == correct){
    gameState.score++
    gameState.questionNum++
    if(gameState.questionNum<20){
      renderQuestion(gameState.questionNum)
    }
    else{
      console.log(`Your final score is ${gameState.score}`)
    }
  }
  else{
    gameState.questionNum++
    if(gameState.questionNum<20){
      renderQuestion(gameState.questionNum)
    }
    else{
      console.log(`Your final score is ${gameState.score}`)
    }
  }
}

const errorHandler = () => {
  console.log("error");
};

//starts game when button pressed
formBtn.addEventListener("click", startGame);
