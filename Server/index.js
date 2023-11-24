//Importing questionStore from JSON file 
const fs = require('fs');
// Reading the JSON file
const jsonData = fs.readFileSync('questionStore.json');
// Parsing JSON data
const questionStore = JSON.parse(jsonData);

// Implementing Express server
const express = require('express');
const bodyParser = require('body-parser');
//Middleware-> Handling CORS error
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); 

app.use(bodyParser.json());

// function to generate question Paper
const generateQuestionPaper = (totalMarks, difficultyPercentage) => {
  const questionPaper = {};

  const easyQuestionsNumber = Math.round(difficultyPercentage.easy * totalMarks * 0.01)/10;
  const mediumQuestionsNumber = Math.round(difficultyPercentage.medium * totalMarks * 0.01)/15;
  const hardQuestionsNumber = Math.round(difficultyPercentage.hard * totalMarks * 0.01)/20;

  // function to get questions by difficulty
  const getQuestionsByDifficulty = (difficulty, count) => {
    const filteredQuestions = questionStore.filter((q) => q.difficulty === difficulty);

    const selectedQuestions = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      selectedQuestions.push(filteredQuestions[randomIndex]);
      filteredQuestions.splice(randomIndex, 1); 
    }

    return selectedQuestions;
  };

  // Adding questions to the question paper
  questionPaper.easy = getQuestionsByDifficulty('Easy', easyQuestionsNumber);
  questionPaper.medium = getQuestionsByDifficulty('Medium', mediumQuestionsNumber);
  questionPaper.hard = getQuestionsByDifficulty('Hard', hardQuestionsNumber);

  return questionPaper;
};

app.post('/generate-paper', (req, res) => {
  const { totalMarks, difficultyDistributionPercentage } = req.body;

  if (!totalMarks || !difficultyDistributionPercentage) {
    return res.status(400).json({ error: 'Invalid request. Please provide totalMarks and difficultyDistributionPercentage.' });
  }

  const generatedQuestionPaper = generateQuestionPaper(totalMarks, difficultyDistributionPercentage);
  res.json({ questionPaper: generatedQuestionPaper });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
