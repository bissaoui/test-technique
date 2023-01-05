// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let quizApp = document.querySelector(".quiz-app");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let submitValidation = document.getElementById("submit")
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let btnWarning = document.querySelector(".btn-warning");
let typeTest = document.getElementById("typeTest");
let btnDownload = document.getElementById("telecharger");
let certcontainer= document.querySelector(".cert-container");

let info = document.querySelector(".info");
let modele = "html_questions.json";
var nom = "";
var prenom = "";
var email = "";
var choix = "";
var img="html.png"
// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

  // Utilisation de la bibliothèque jsPDF

function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}
function getQuestions() {
  if (currentIndex==0){
    var currentTime = new Date();

  }
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = shuffle(JSON.parse(this.responseText)).slice(0,5);
	
      let qCount = questionsObject.length;

      // Create Bullets + Set Questions Count
      createBullets(qCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      // Start CountDown
      countdown(15, qCount);

      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObject[currentIndex], qCount);

        // Handle Bullets Class
        handleBullets();

        // Start CountDown
        clearInterval(countdownInterval);
        countdown(15, qCount);

        // Show Results
        showResults(qCount,currentTime);
      };
    }
  };

  myRequest.open("GET", modele, true);
  myRequest.send();
}

//getQuestions();

function createBullets(num) {
  countSpan.innerHTML = "nombre des questions : " +num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);
    let dtt =[];

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      dtt[i-1]=mainDiv;
    }

    dtt=shuffle(dtt);

    
    for (let index = 0; index <4; index++) {

      
      answersArea.appendChild(dtt[index]);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function remplireCertifiAndShow(n){
  firstName.innerHTML=prenom;
  lastName.innerHTML=nom;
  note.innerHTML=n+"%";
  titre_cours.innerHTML=choix;
  imgg.setAttribute('src', img);

  date_certification.innerHTML=new Date().toISOString().slice(0, 10);
  certcontainer.classList.remove("d-none");
  btnWarning.classList.remove("d-none");
  
}

function showResults(count,currentTime) {

  let theResults;
  const clickTime = new Date();

  // Calculer la différence entre les deux dates en milisecondes
  const timeSpent = clickTime - currentTime;

  // Afficher le temps passé en secondes (dividé par 1000 pour convertir en secondes)

  if (currentIndex === count) {
    quizArea.remove();
    countdownElement.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    var NoteC=(rightAnswers/count)*100
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good"> Félicitations,  vous avez réussi le test.</span>, ${rightAnswers} / ${count}  ( `+ NoteC+" % )";
      theResults += `<span class="good"> le temps passe est : </span>, ${timeSpent/1000} s `;
      remplireCertifiAndShow(NoteC);

    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Parfait</span>, Toutes les réponses sont bonnes tres bon travail ( `+ NoteC+" % )";;
      theResults += `<span class="perfect"> le temps passe est : </span>, ${timeSpent/1000} s `;

      remplireCertifiAndShow(NoteC);

    } else {
      theResults = `<span class="bad">mauvais</span>, ${rightAnswers} / ${count} ( `+ NoteC +" % )";
      theResults += `<span class="bad"> le temps passe est : </span>, ${timeSpent/1000} s `;

    }
    quizApp.style.width = '1055px';

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault()
        event.stopPropagation()
        if (form.checkValidity()) {
        
          nom=document.getElementById("Nom").value;
          prenom=document.getElementById("Prenom").value;
          email=document.getElementById("email").value;
          choix= document.querySelector('input[name="lang"]:checked').value;
          if (choix=="HTML"){
            modele = "html_questions.json";
            img="html.png"
          }else if(choix=="CSS"){
            modele = "css_questions.json";
            img="css.png"

          }else{
            modele = "js_questions.json";
            img="js.png"
          }
          typeTest.innerHTML=choix;
          setTimeout(() => {
           info.className = "d-none";}, 2000);
         
           setTimeout(() => {
            document.querySelector(".demo").classList.remove("d-none");
            start();
          }, 4000);

           setTimeout(() => {
            document.querySelector(".demo").className="d-none";
            getQuestions(); 
            quizApp.classList.remove("d-none");
          }, 7000);
        }
        
        form.classList.add('was-validated')
      }, false)
    })
})()

var intervall = 1000;

// Set the initial value
var number = 1;

function start() {
  // Check if the timer is already running
    // If the timer is not already running, start the timer
     timer = setInterval(function() {
      number++;
      document.getElementById("demoo").innerHTML = number;
      
      // Clear the interval when the number reaches 3
      if (number == 3) {
        clearInterval(timer);
        timer = null;
      }
    }, intervall);
  
}

function download(){
  html2canvas(certcontainer).then(function(canvas) {
    // L'élément a été converti en une image canvas
    window.jsPDF = window.jspdf.jsPDF;

    var doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [11, 9]
    });
    doc.addImage(canvas, 'PNG', 0, 0);
    doc.save('certificat.pdf');
  });
}
btnDownload.addEventListener('click', function() {
  download();
});
