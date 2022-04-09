import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    status:{
        type : Boolean,
        default : false
    },
    deliveryDate : {
        type : Date,
        required : true,
        default : Date.now
    },
    priority : {
        type: String,
        enum: ["Low", "Medium", "High"],
        required : true
    },
    project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
    }
},{
    timestamps : true
})

const Task = mongoose.model("Task", taskSchema);

export default Task;