import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    userState: {
        type: String,
        required: true
    },
    hobbies: {
        type: Array,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    channel: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);
export default Question;
