function QuizPool(quizPool) {
  this.quizPool = quizPool;
  this.currentQuestion = {};
  this.questions = [];
  this.questionTypes = {
    multipleChoice: 'MC',
    multipleAnswer: 'MA',
    trueFalse: 'TF',
    essay: 'ESS'
  }
  this.matchPatterns = {
    type: /^Type: (\S{1,3})/i,
    prompt: /^\d{1,3}(?:\)|\.) /i,
    answer: /\*{0,1}([a-z])(?:\)|\.) ([\s\S]*)/i,
    correctAnswer: /^\*([a-z])(?:\)|\.) /i,
    // trueFalseQuestion: /^[ab](?:\)|\.) (?:true|false)/i,
    splitPool: /(?=^(?:\d{1,3}(?:\)|\.) |Type: \S{1,3}))/im,
    splitQuestion: /(?=^(?:\d{1,3}|\*{0,1}[a-z])(?:\)|\.) )/im,
    // splitAnswer: /(?:^(\*{0,1}[a-z])(?:\)|\.))/i
  };
}

QuizPool.prototype.splitPoolToQuestions = function(quizPool) {
  let splitResults = quizPool.trim().split(this.matchPatterns.splitPool);
  let results = [];
  while(splitResults.length != 0) {
    if (splitResults[0].includes('Type: ')) {
      results.push(splitResults.shift() + splitResults.shift());
    } else {
      results.push(splitResults.shift());
    }
  }
  return results;
};

QuizPool.prototype.evaluatePool = function() {
  let questions = this.splitPoolToQuestions(this.quizPool);

  for(let question of questions) {
    this.__startNewQuestion();
    let splitQuestion = question.split(this.matchPatterns.splitQuestion);
    
    for(let item of splitQuestion) {
      if(this.__search(item, 'type')) {
        let type = this.__getMatch(item, 'type');
        this.currentQuestion.type = type[1];
      }      
      else if(this.__search(item, 'prompt')) {
        this.currentQuestion.prompt = item.replace(this.matchPatterns.prompt, '');
      }
      else if(this.__search(item, 'answer')) {
        if(this.__search(item, 'correctAnswer')) {
          let correctAnswer = this.__getMatch(item, 'correctAnswer');
          this.__addCorrectAnswer(correctAnswer[1]) // [1] is answer letter
        }
        let answer = this.__getMatch(item, 'answer');
        this.__addAnswer([answer[1], answer[2]]); // [1] is answer letter/number, [2] is text.
      }
    }
    this.__setQuestionType(this.__getQuestionType());
    this.__addQuestion(this.currentQuestion);
    console.log('Question Added: ', this.currentQuestion);
  }
};

QuizPool.prototype.getQuestions = function() {
  return this.questions;
};

QuizPool.prototype.getQuestion = function(index) {
  if (index) {
  return this.questions[index];
  } else {
    return this.currentQuestion;
  }
};

QuizPool.prototype.questionsToCSV = function() {
  let questions = this.getQuestions();
  let result = '';
  for(let question of questions) {
    let type = question.type;
    let prompt = question.prompt.replace(/\r\n+/igm, ' ');
    let answers = question.answers;
    let correctAnswers = question.correctAnswers;
    let line = `${type}\t${prompt}\t`;

    result += line;
  }

  return result;
};

QuizPool.prototype.__getQuestionType = function() {
  // Gets question type of current question
  if(this.__isMultipleChoice()) {
    return this.questionTypes.multipleChoice;
  }
  
  if(this.__isMultipleAnswer()) {
    return this.questionTypes.multipleAnswer;
  }
  
  if(this.__isTrueFalse()) {
    return this.questionTypes.trueFalse;
  }

  if(this.currentQuestion.type != '') {
    let type = this.currentQuestion.type;
    switch(type) {
      case 'E':
        return 'ESS';
        // break;
      // Inlcude additional cases as needed
    }
  }

  // throw 'No Question Type Found';
};

QuizPool.prototype.__setQuestionType = function(type) {
  this.currentQuestion.type = type;
};

QuizPool.prototype.__isMultipleChoice = function() {
  let question = this.currentQuestion;
  let noTypeSpecified = question.type === '';
  let moreThanTwoAnswers = question.answers.length > 2;
  let oneCorrectAnswer = question.correctAnswers.length < 2;

  if(noTypeSpecified && moreThanTwoAnswers && oneCorrectAnswer) {
    return true;
  }
  return false;
};

QuizPool.prototype.__isMultipleAnswer = function() {
  // code here
  let question = this.currentQuestion;
  let noTypeSpecified = question.type === '';
  let moreThanTwoAnswers = question.answers.length > 2;
  let multipleCorrectAnswers = question.correctAnswers.length > 1;

  if(noTypeSpecified && moreThanTwoAnswers && multipleCorrectAnswers) {
    return true;
  }
  return false;
};

QuizPool.prototype.__isTrueFalse = function() {
  // code here
  let question = this.currentQuestion;
  let noTypeSpecified = question.type === '';
  let twoAnswers = question.answers.length == 2;
  let oneCorrectAnswer = question.correctAnswers.length < 2;

  if(noTypeSpecified && twoAnswers && oneCorrectAnswer) {
    return true;
  }
  return false;
};

QuizPool.prototype.__addQuestion = function(question) {
  this.questions.push(question);
};

QuizPool.prototype.__addAnswer = function(answer) {
  this.currentQuestion.answers.push(answer);
};

QuizPool.prototype.__addCorrectAnswer = function(correctAnswer) {
  this.currentQuestion.correctAnswers.push(correctAnswer);
};

QuizPool.prototype.__startNewQuestion = function() {
  return this.currentQuestion = {
      type: '',
      number: '',
      prompt: '',
      answers: [],
      correctAnswers: []
    }
};

QuizPool.prototype.__getMatch = function(item, patternName) {
  if(!item) {
    return console.log('Item paramater required to find match');
  }
  if (this.matchPatterns[patternName]) {
  return item.match(this.matchPatterns[patternName]);
  }
  console.log('Pattern does not exist: ', patternName)
  return false;
};

QuizPool.prototype.__search = function(item, patternName) {
  if(!item) {
    return console.log('Item paramater required for search');
  }
  if (this.matchPatterns[patternName]) {
  return item.search(this.matchPatterns[patternName]) > -1;
  }
  console.log('Pattern does not exist: ', patternName)
  return false;
};

module.exports = QuizPool;