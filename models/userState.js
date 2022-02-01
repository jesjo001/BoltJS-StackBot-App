import mongoose from 'mongoose';

const userStateSchema = new mongoose.Schema({
    state: {
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

const UserState = mongoose.model("UserState", userStateSchema);
export default UserState;
