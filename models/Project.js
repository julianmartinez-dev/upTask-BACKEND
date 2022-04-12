import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    deliveryDate:{
        type: Date,
        default: Date.now
    },
    client:{
        type: String,
        required: true,
        trim: true
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
},{
    timestamps: true

})

const Project = mongoose.model("Project", projectsSchema);
export default Project;