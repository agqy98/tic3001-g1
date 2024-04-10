import mongoose from "mongoose";

var Schema = mongoose.Schema;

let QuestionModelSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Array,
    default: [], // Setting default to the current date/time
  },
  complexity: {
    type: String,
    required: true,
    default: "Easy",
  },
  link: {
    type: String,
    required: false,
    default: "",
  },
});

export default mongoose.model("QuestionModel", QuestionModelSchema);
