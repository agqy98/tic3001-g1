import {
  ormFindAllQuestions as _findAllQuestions,
  ormFindQuestionById as _findQuestionById,
  ormCreateQuestion as _createQuestion,
  ormUpdateQuestion as _updateQuestion,
  ormDeleteQuestion as _deleteQuestion
} from "../model/question-orm.js";

export async function getAllQuestions(req, res) {
  console.log(`GET ALL QUESTIONS`);

  const response = await _findAllQuestions();

  console.log(response);

  if (response === null) {
    return res.status(404).json({ message: `No questions exist!` });
  } else if (response.err) {
    return res.status(400).json({ message: "Could not find questions!" });
  } else {
    console.log(`Questions found!`);
    return res.status(200).json({
      message: `Found questions!`,
      questions: response,
    });
  }
}

export async function getQuestionById(req, res) {
  try {
    const { id } = req.params;
    if (id) {
      console.log(`GET QUESTION: ${id}`);
      const response = await _findQuestionById(id);
      console.log(response);
      if (response === null) {
        console.log(`Question with ${id} not found!`);
        return res
          .status(404)
          .json({ message: `Question with ${id} not found!` });
      } else if (response.err) {
        return res.status(400).json({ message: "Could not find the question!" });
      } else {
        console.log(`Question with ${id} found!`);
        return res.status(200).json({
          message: `Found question ${id}!`,
          questionDetails: response,
        });
      }
    } else {
      return res.status(400).json({
        message: "ID is missing!",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when getting question!" });
  }
}

export async function createQuestion(req, res) {
  try {
    const { title, description, category, complexity, link } = req.body;

    console.log(title + "&&" + description + "&&" + category + "&&" + complexity);

    if (title && description && category && complexity) {
      console.log(`CREATE QUESTION: Title : ${title}`);
      const resp = await _createQuestion(title, description, category, complexity, link);
      console.log(resp);
      if (resp.err) {
        return res.status(409).json({
          message: resp.e
          // "Could not create a new question! (Possibly Title already exists!)",
        });
      } else {
        console.log(`Created new question successfully!`);
        return res
          .status(201)
          .json({ message: `Created new question successfully!` });
      }
    } else {
      return res.status(400).json({
        message: "Title and/or Description and/or Category and/or Complexity are missing!",
      });
      console.log(res)
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new question!" });
  }
}

export async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, complexity, link } = req.body;

    if (id && title && description && category && complexity) {
      const response = await _updateQuestion(id, title, description, category, complexity, link);
      console.log(response);
      if (response.err) {
        return res.status(409).json({
          message:
            "Could not update the question (Possibly duplicate title)!",
        });
      } else if (!response) {
        console.log(`Question with id: ${id} not found!`);
        return res
          .status(404)
          .json({ message: `Question with id: ${id} not found!` });
      } else {
        console.log(`Question with id: ${id} found!`);
        return res.status(200).json({
          message: `Updated Question Data with id: ${id}!`,
        });
      }
    } else {
      return res.status(400).json({
        message: "Id and/or Title and/or Description and/or Category and/or Complexity are missing!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "Database failure when updating question! (Possibly Missing Title field)",
    });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    if (id) {
      console.log(`DELETE QUESTION: : ${id}`);
      const response = await _deleteQuestion(id);
      console.log(response);
      if (response.err) {
        return res.status(400).json({ message: "Could not delete the question!" });
      } else if (!response) {
        console.log(`Question with ${id} not found!`);
        return res
          .status(404)
          .json({ message: `Question with ${id} not found!` });
      } else {
        console.log(`Deleted question ${id} successfully!`);
        return res
          .status(200)
          .json({ message: `Deleted question ${id} successfully!` });
      }
    } else {
      return res.status(400).json({
        message: "ID is missing!",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when deleting question!" });
  }
}