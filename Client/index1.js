async function generateQuestionPaper() {
  const totalMarks = document.getElementById("totalMarks").value;
  const easyPercentage = document.getElementById("easyPercentage").value;
  const mediumPercentage = document.getElementById("mediumPercentage").value;
  const hardPercentage = document.getElementById("hardPercentage").value;

  if (!totalMarks || !easyPercentage || !mediumPercentage || !hardPercentage) {
    displayErrorMessage("Please fill in all the required fields.");
    return;
  }

  const difficultyDistributionPercentage = {
    easy: parseFloat(easyPercentage),
    medium: parseFloat(mediumPercentage),
    hard: parseFloat(hardPercentage),
  };

  try {
    const response = await fetch("http://localhost:3000/generate-paper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ totalMarks, difficultyDistributionPercentage }),
    });

    const data = await response.json();

    if (response.ok) {
      displayQuestionPaper(data.questionPaper);
    } else {
      displayErrorMessage(data.error);
    }
  } catch (error) {
    displayErrorMessage("Error: " + error.message);
  }
}

function displayErrorMessage(message) {
  const errorMessageDiv = document.getElementById("errorMessage");
  errorMessageDiv.textContent = message;
}

function displayQuestionPaper(questionPaper) {
  const questionPaperDiv = document.getElementById("questionPaper");
  questionPaperDiv.innerHTML = "";

  for (const difficulty in questionPaper) {
    if (questionPaper[difficulty].length > 0) {
      const heading = document.createElement("h3");
      heading.textContent = `${difficulty} Questions:`;
      questionPaperDiv.appendChild(heading);

      const list = document.createElement("ul");

      questionPaper[difficulty].forEach((question) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>Question:</strong> ${question.question}<br>
            <strong>Subject:</strong> ${question.subject}<br>
            <strong>Topic:</strong> ${question.topic}<br>
            <strong>Difficulty:</strong> ${question.difficulty}<br>
            <strong>Marks:</strong> ${question.marks}
          `;
        list.appendChild(listItem);
      });

      questionPaperDiv.appendChild(list);
    }
  }
}
