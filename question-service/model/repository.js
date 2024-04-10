import QuestionModel from "./question-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDBUri =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.on("connected", () => console.log("MongoDB Connected!"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function getQuestions() {
  return QuestionModel.find();
}
export async function getQuestionById(id) {
  return QuestionModel.findOne({ id: id });
}

export async function createQuestion(params) {
  params._id = new mongoose.Types.ObjectId();

  const newId = await getNewId();

  // Set the id field of the new question
  params.id = newId;

  return new QuestionModel(params);
}
export async function updateQuestion(id, title, description, category, complexity, link) {
  // getQuestionById(id);
  return QuestionModel.updateOne(
    { id: id },
    {
      $set: {
        title: title,
        description: description,
        category: category,
        complexity: complexity,
        link: link
      },
    }
  );
}

export async function deleteQuestion(id) {
  return QuestionModel.deleteOne({ id: id });
}

// Other functions
async function getNewId() {
  const questions = await QuestionModel.find().sort({ id: -1 }).exec();
  return questions[0] ? parseInt(questions[0].id) + 1 : 1;
}
