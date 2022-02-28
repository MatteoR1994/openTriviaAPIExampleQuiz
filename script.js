const triviaArray = [];

function loadCategories() {
    fetch('https://opentdb.com/api_category.php')
        .then(resp => resp.json())
        .then((data) => createSelect(data.trivia_categories, 'categories-select'))
        .catch(err => console.log(err));
}

function loadDifficulty() {
    fetch('./assets/settings/difficulties.json')
        .then(resp => resp.json())
        .then((data) => createSelect(data, 'difficulty-select'))
        .catch(err => console.log(err));
}

function loadType() {
    fetch('./assets/settings/type.json')
        .then(resp => resp.json())
        .then((data) => createSelect(data, 'type-select'))
        .catch(err => console.log(err));
}

function createSelect(data, selectId) {
    const select = document.getElementById(selectId);
    for (const element of data) {
        const option = document.createElement('option');
        option.value = element.id;
        const textNode = document.createTextNode(element.name);
        option.appendChild(textNode);
        select.appendChild(option);
    }
}

function initQuiz() {
    loadCategories();
    loadDifficulty();
    loadType();
}

function loadTrivia() {
    const category = document.getElementById('categories-select').value;
    const difficulty = document.getElementById('difficulty-select').value;
    const type = document.getElementById('type-select').value;
    let stringUrl = 'https://opentdb.com/api.php?amount=15';
    if (category) {
        stringUrl += ('&category=' + category);
    }
    if (difficulty) {
        stringUrl += ('&difficulty=' + difficulty);
    }
    if (type) {
        stringUrl += ('&type=' + type);
    }
    fetch(stringUrl)
        .then(resp => resp.json())
        .then(createTrivias)
        .catch(err => console.log(err));
}

function createTrivias(data) {
    const results = data.results;
    // const triviaArray = [];

    for (const res of results) {
        const trivia = new Trivia(res.category, res.type, res.difficulty, res.question, res.correct_answer, res.incorrect_answers);
        triviaArray.push(trivia);
    }

    console.log(triviaArray);
    displayTrivia(triviaArray);
}


function displayTrivia() {
    const list = document.getElementById('question-container');
    let questionCounter = 1;
    for (const [i, trivia] of triviaArray.entries()) {
        let liElement = createTriviaListElement(trivia, i);
        list.appendChild(liElement);
    }

    // const title = document.getElementsByClassName('main-title')[0];
    // const body = document.getElementsByTagName('body')[0];
    // const list2 = document.querySelector('#trivia-list');
    // const title2 = document.querySelector('.main-title');
    // const li = document.querySelector('li');
}


function createTriviaListElement(trivia, questionId) {
    let liElement = document.createElement('div');
    let span = document.createElement('span');

    liElement.className += "question-div";
    span.className += "question-text";
    span.style.fontWeight = 'bold';

    let textNode = document.createTextNode(formattedTextFromTextArea(trivia.question));

    span.appendChild(textNode);
    liElement.appendChild(span)

    let answersList = createAnswersList(trivia.getAllAnswers(), questionId)

    liElement.appendChild(answersList);

    return liElement;
}

function createAnswersList(answers, questionId) {
    let answerList = document.createElement('ul');
    answerList.id = "answers-q" + questionId;
    
    for (const answ of answers) {
        let liElement = createAnswerListElement(formattedTextFromTextArea(answ), questionId, answerList.id)
        //let breakLine = document.createElement('br');
        
        answerList.appendChild(liElement);
        //answerList.appendChild(breakLine);
    }

    return answerList;
}

function createAnswerListElement(answ, questionId, answersContainerId) {
    let liElement = document.createElement('button');
    liElement.addEventListener('click', (event) => checkIfRight(event, questionId, answersContainerId, liElement));
    
    let span = document.createElement('span');
    let textNode = document.createTextNode(answ);

    span.clickable = false;

    //liElement.text(textNode);
    span.appendChild(textNode);
    liElement.appendChild(span);
    //liElement.appendChild(breakLine);
    return liElement;
}

function formattedTextFromTextArea(text){
        var txt = document.createElement("textarea");
        txt.innerHTML = text;
        return txt.value;
}

let points = 0;
let questionsDone = 0;

function checkIfRight(event, questionId, answersContainerId, button) {
    event.stopPropagation();
    console.log(event);
    let answerText = event.target.firstChild.textContent;
    let currentTriva = triviaArray[questionId];
    let isCorrect = currentTriva.checkAnswer(answerText);
    if (isCorrect) {
        points++;
        button.style.backgroundColor = 'green';
    } else {
        button.style.backgroundColor = 'red';
    }
    const answersContainer = document.getElementById(answersContainerId);
    const answersButtons = answersContainer.children;
    for (const answerButton of answersButtons) {
        console.log(answerButton);
        if (!isCorrect && answerButton.textContent === currentTriva.correctAnswer) {
            answerButton.style.backgroundColor = 'green';
        }
        answerButton.disabled = true;
    }
    questionsDone++;
    if (questionsDone === triviaArray.length) {
        //alert('Hai risposto a tutto!')
        this.showResult();
    }
}

function showResult() {
    // Get the modal
    const modal = document.getElementById("myModal");
    modal.style.display = 'flex';

    const modalContent = document.getElementById("modal-content");
    
    const image = document.getElementById('image-result');

    const pointsText = document.createElement('p');
    pointsText.className = 'points-done';

    const resultText = document.createElement('p');
    resultText.className = 'points-done';

    pointsText.innerHTML = '';
    resultText.innerHTML = '';

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    //modal.style.display = "block";

    let questionsNumber = triviaArray.length;
    if (points >=0 && points <= (questionsNumber / 3)) {
        image.src = './images/sad-face.png';
        pointsText.appendChild(document.createTextNode(points + ' / ' + (triviaArray.length)));
        resultText.appendChild(document.createTextNode('Sei proprio scarso!'));

        modalContent.appendChild(pointsText);
        modalContent.appendChild(resultText);
    }

    if (points >= (questionsNumber / 3)+1 && points <= (questionsNumber / 3)+(questionsNumber / 3)) {
        image.src = './images/neutral-face.jpg';
        pointsText.appendChild(document.createTextNode(points + ' / ' + (triviaArray.length)));
        resultText.appendChild(document.createTextNode('Potresti fare meglio...'));

        modalContent.appendChild(pointsText);
        modalContent.appendChild(resultText);
    }

    if (points >= (questionsNumber / 3)+(questionsNumber / 3) && points <= questionsNumber) {
        image.src = './images/happy-face.jpg';
        pointsText.appendChild(document.createTextNode(points + ' / ' + (triviaArray.length)));
        resultText.appendChild(document.createTextNode('Sei un campione!'));

        modalContent.appendChild(pointsText);
        modalContent.appendChild(resultText);
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";

        pointsText.innerHTML = '';
        resultText.innerHTML = '';
        location.reload();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";

            pointsText.innerHTML = '';
            resultText.innerHTML = '';
            location.reload();
        }
    }
}