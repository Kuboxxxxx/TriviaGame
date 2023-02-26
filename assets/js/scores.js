const scoresTable = document.getElementById("scores")

const renderScores = () => {
  const scores = JSON.parse(localStorage.getItem("saves"))

  scores.forEach(element => {
    scoresTable.innerHTML += `<tr>
    <td>${element.name}</td>
    <td>${element.diff}</td>
    <td>${element.score}</td>
  </tr>`
  });
}

window.addEventListener("load", renderScores)