const {model, Schema} = require("mongoose");

//Schema for Projects Model
const projectsSchema = new Schema({
    projectId:String,
    projectName:String,
    userId:String
})
const proSchema = model("projects",projectsSchema)


//Schema for Scenes Model
const scenesSchema = new Schema({
    sceneId:String,
    projectId:String,
    number:Number,
    description:String,
    locationType:String,
    location:String,
    time: String
})
const sceneSchema = model("scenes", scenesSchema)

//Schema for shots Model
const shotsSchema = new Schema({
    shotId:String,
    sceneId: String,
    number: Number,
    type: String,
    angle: String,
    movement: String,
    action: String,
    notes: String
})
const shotSchema = model("shots",shotsSchema)

//Schema for Users Model
const usersSchema = new Schema({
    user_id:String,
    user_name:String,
    name:String,
    password:String,
    email:String
})
const users = model("users",usersSchema)

//Exporting all Models as module
module.exports = {
    proSchema,
    sceneSchema,
    shotSchema,
    users
}