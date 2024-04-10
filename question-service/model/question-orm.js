import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "./repository.js";

export async function ormFindAllQuestions() {
  try {
    const result = await getQuestions();

    // Checking if Questions exist
    if (result.length !== 0) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not find questions");
    return { err };
  }
}

export async function ormFindQuestionById(Id) {
  try {
    const result = await getQuestionById(Id);

    // Checking if Question exists
    if (result) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not find question");
    return { err };
  }
}

// Need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateQuestion(title, description, category, complexity, link) {
  try {
    const newQuestion = await createQuestion({ title, description, category, complexity, link });
    await newQuestion.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new question");
    return { err };
  }
}

export async function ormUpdateQuestion(id, title, description, category, complexity, link) {
  try {
    const result = await updateQuestion(id, title, description, category, complexity, link);

    // Checking if Question Details Modified
    if (result.modifiedCount === 0) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("ERROR: Could not update question data");
    return { err };
  }
}

export async function ormDeleteQuestion(id) {
  try {
    const result = await deleteQuestion(id);

    // Checking if Question existed
    if (result.deletedCount === 0) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("ERROR: Could not delete question");
    return { err };
  }
}