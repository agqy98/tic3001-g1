class Question {
    constructor(_id, id, title, description, category, complexity, link) {
        this._id = _id;
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.complexity = complexity;
        this.link = link;
    }
}

export default Question;

export const QuestionFormat = {
    _id: '',
    id: '',
    title: '',
    description: '',
    category: [],
    complexity: '',
    link: ''
}