function QuizPool(quizPool) {
  this.quizPool = quizPool;
  this.currentQuestion = {};
  this.questions = [];
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
        this.currentQuestion.type = item;
      }      
      else if(this.__search(item, 'prompt')) {
        this.currentQuestion.prompt = item;
      }
      else if(this.__search(item, 'answer')) {
        if(this.__search(item, 'correctAnswer')) {
          let correctAnswer = this.__getMatch(item, 'correctAnswer');
          this.__addCorrectAnswer(correctAnswer[1]);
        }
        let answer = this.__getMatch(item, 'answer');
        this.__addAnswer([answer[1], answer[2]]); // [1] is answer letter/number, [2] is text.
      }
    }
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
}

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