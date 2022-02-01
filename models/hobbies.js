import mongoose from 'mongoose';

const hobbiesSchema = new mongoose.Schema({
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
    channelId: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Hobbie = mongoose.model("Hobbie", hobbiesSchema);
export default Hobbie;
