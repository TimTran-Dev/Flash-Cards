let remove = document.getElementsByClassName("fa-trash");
let answer = document.getElementsByClassName("answer");
let answerBtn = document.getElementsByClassName("getAnswers")[0];
let generator = document.getElementById("generate");
let edit = document.getElementsByClassName("fa-edit");

Array.from(edit).forEach(function(element) {
  element.addEventListener("click", function() {
    const questions = this.parentNode.parentNode.childNodes[1].innerText;
    const answers = this.parentNode.parentNode.childNodes[3].innerText;
    let _id = this.parentNode.parentNode.querySelector(".hide").innerText;
    fetch("flashcards", {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        questions: questions,
        answers: answers,
        _id: _id
      })
    }).then(function(response) {
      console.log(response);
      window.location.reload();
    });
  });
});

generator.addEventListener("click", function() {
  window.location.reload();
});

answerBtn.addEventListener("click", function() {
  let answers = document.getElementsByClassName("answer");
  for (let i = 0; i < answers.length; i++) {
    answers[i].style.display = "block";
  }
});

Array.from(remove).forEach(function(element) {
  element.addEventListener("click", function() {
    const questions = this.parentNode.parentNode.childNodes[1].innerText;
    const answers = this.parentNode.parentNode.childNodes[3].innerText;
    fetch("flashcards", {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        questions: questions,
        answers: answers
      })
    }).then(function(response) {
      window.location.reload();
    });
  });
});
