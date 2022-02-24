class Trivia {
    /**
     * The constructor function creates a new object with some properties;
     * The constructor function is called when you create a new object using the following syntax:
     * @param category - The category of the question.
     * @param type - Type of question. 
     * @param difficulty - Easy, Medium, Hard
     * @param question - The question itself.
     * @param correctAnswer - The correct answer to the question
     * @param incorrectAnswer - An array of incorrect answers
     */

    constructor(category, type, difficulty, question, correctAnswer, incorrectAnswers){
        this.category = category;
        this.type = type;
        this.difficulty = difficulty;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.incorrectAnswers = incorrectAnswers;
    }

    getAllAnswers(){ 
        const allAnswers = [];
        allAnswers.push(this.correctAnswer);
        allAnswers.push(...this.incorrectAnswers);
        // for (const answer of this.incorrect_answers){
        //     allAnswers.push(answer);
        // } 
        const shuffledArray = Utility.shuffleArray(allAnswers);
        return shuffledArray;
    }

    checkAnswer(answerText) {
        return this.formattedTextFromTextArea(this.correctAnswer) === answerText;
    }

    formattedTextFromTextArea(text) {
        var txt = document.createElement("textarea");
        txt.innerHTML = text;
        return txt.value;
    }
}