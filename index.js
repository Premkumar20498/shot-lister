const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const schema = require('./Schema')
require('dotenv').config();

let auth = ""


mongoose.set('strictQuery', true)
await mongoose.connect(`mongodb+srv://${process.env.REACT_APP_DB_NAME}:${process.env.REACT_APP_DB_NAME}@${process.env.REACT_APP_CLUSTER_NAME}.${process.env.REACT_APP_COLLECTION_NAME}.mongodb.net/${process.env.REACT_APP_DB_NAME}?retryWrites=true&w=majority`)

app.use(cors());
app.use(express.json())



app.post('/api/user-login', async (req, res) => {
    const user = req.body.un;
    const email = req.body.em

    await schema.users.find({
        $or: [{ "user_name": user },
        { "email": email }]
    }).then(result => {
        if (result.length === 0) {
            res.status(404).send(JSON.stringify({ "error": "User not found" }))
        }
        else {
            const userId = result[0].user_id
            const name = result[0].name
            const userName = result[0].user_name
            const password = result[0].password
            const data = {
                userId,
                name,
                userName,
            }
            const token = jwt.sign(data, process.env.REACT_APP_SECRETE_KEY)
            res.status(200).send(JSON.stringify({
                "message": "logged in successfully",
                "hash": password,
                "token": token,
                "uID":userId
            }))
        }
    })
})


app.post('/api/create-user', (req, res) => {
    const userId = req.body.userId;
    const name = req.body.name;
    const email = req.body.email;
    const userName = req.body.username;
    const password = req.body.password;

    const new_user = new schema.users({
        "user_id": userId,
        "user_name": userName,
        "name": name,
        "password": password,
        "email": email
    })

    schema.users.find({
        $or: [{ "user_name": userName },
        { "email": email }]
    }).then(result => {
        if (result.length === 0) {
            new_user.save().then(out => {
                const data = {
                    userId,
                    name,
                    userName,
                    email
                }
                const token = jwt.sign(data, process.env.REACT_APP_SECRETE_KEY)
                res.status(201).send(JSON.stringify({
                    "token": token
                }))
            });
        }
        else {
            res.status(400).send(JSON.stringify({
                "message": "User details are already exists. Please use different or login with valid credentials"
            }))
        }
    })
})


app.get('/api/export/:projectId', (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const { projectId } = req.params;
                const getProjectsForExport = "call " + process.env.REACT_APP_DATA_BASE + ".get_full_project(?);"
                db.query(getProjectsForExport, [projectId], (error, result) => {
                    if (error) {
                        res.status(400).send(error)
                    }
                    else {
                        res.status(200).send(result)
                    }
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


// Get All Projects
app.get('/api/projects', (req, res) => {
    auth = req.headers.authorization

    const uId = req.query.uId ;

    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                schema.proSchema.find({"userId":uId}).then(result => {
                    res.status(200).send(result)
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Get individual project details for update
app.get("/api/details/project/:projectId", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const { projectId } = req.params;
                const projectDetails = "SELECT * FROM projects WHERE projectId =? order by sn asc"
                db.query(projectDetails, [projectId], (error, result) => {
                    if (error) {
                        res.status(400).send(error)
                    }
                    else {
                        res.status(200).send(result)
                    }
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Get All Scenes
app.get("/api/get-scenes-list", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, async function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const id = req.query.id;
                await schema.sceneSchema.find({ "projectId": id }).then(result => {
                    res.status(200).send(result)
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Get individual scene details for update
app.get("/api/details/scene", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const sid= req.query.s_Id;
                
                schema.sceneSchema.findOne({"sceneId":sid}).then(result=>{
                    res.status(200).send(result)
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Get All Shots
app.get("/api/get-shots-list", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, async function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const sid = req.query.s_Id;

                await schema.shotSchema.find({"sceneId":sid}).then(result => {
                    res.status(200).send(result)
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Get individual shot details for update
app.get("/api/details/shot", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const shid = req.query.sh_Id;
                
                schema.shotSchema.findOne({"shotId":shid}).then(result=>{
                    res.status(200).send(result)
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Create Project
app.post('/api/project/create', (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {
        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const pId = req.body.id
                const pName = req.body.name
                const uId = req.body.uId

                const new_project = new schema.proSchema({
                    "projectId": pId,
                    "projectName": pName,
                    "userId": uId
                })
                new_project.save().then(result => {
                    res.status(201).send(JSON.stringify({ "message": `Project is Ccreated with name ${pName}` }))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Create Scene
app.post('/api/scene/create', (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const proId = req.body.proId
                const sceneId = req.body.id
                const number = req.body.number
                const description = req.body.description
                const loctype = req.body.locType
                const loc = req.body.loc
                const time = req.body.time

                const new_scene = new schema.sceneSchema({
                    number: number,
                    sceneId: sceneId,
                    projectId: proId,
                    description: description,
                    locationType: loctype,
                    location: loc,
                    time: time
                })

                new_scene.save().then(result => {
                    res.status(201).send(JSON.stringify({ "message": "Scene added successfully" }))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Create Shot
app.post('/api/shot/create', (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {

                const shotId = req.body.shotId
                const sceneId = req.body.sceneId
                const number = req.body.number
                const type = req.body.type
                const angle = req.body.angle
                const movement = req.body.movement
                const action = req.body.action
                const notes = req.body.notes

                const new_shot = new schema.shotSchema({
                    number:number,
                    shotId:shotId,
                    sceneId:sceneId,
                    type:type,
                    angle:angle,
                    movement:movement,
                    action:action,
                    notes:notes
                })

                new_shot.save().then(result=>{
                    res.status(201).send(JSON.stringify({"message":"Shot is added to the scene successfully"}))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Update Project
app.put('/api/project/update', (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {
        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const projectId = req.body.id
                const projectName = req.body.projectname

                schema.proSchema.updateOne({ "projectId": projectId }, { "projectName": projectName }).then(result => {
                    res.status(200).send(JSON.stringify({ "message": `Project name is successfully changed as ${projectName}` }))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Update Scene
app.put('/api/scene/update', (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const prjectId = req.body.prjectId
                const sceneNumber = req.body.number
                const sceneDescription = req.body.description
                const locationType = req.body.locType
                const location = req.body.loc
                const time = req.body.time

                schema.sceneSchema.updateOne({ "projectId": prjectId }, {
                    "number": sceneNumber,
                    "description": sceneDescription,
                    "locationType": locationType,
                    "location": location,
                    "time": time
                }).then(result=>{
                    res.status(200).send(JSON.stringify({"message":"Scene is updated successfully"}))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Update Shot
app.put('/api/shot/update', (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {

                const sceneId = req.body.sceneId
                const number = req.body.number
                const type = req.body.type
                const angle = req.body.angle
                const movement = req.body.movement
                const action = req.body.action
                const notes = req.body.notes

                schema.shotSchema.updateOne({sceneId:sceneId},{
                    number:number,
                    angle:angle,
                    movement:movement,
                    type:type,
                    action:action,
                    notes:notes
                }).then(result=>{
                    res.send(result)
                    // res.status(200).send(JSON.stringify({"message":"Shot is updated successfully"}))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Delete Project
app.delete("/api/project/delete", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, async function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {

                const pid  = req.query.p_Id;

                await schema.proSchema.findOneAndDelete({ "projectId": pid }).then(result => {

                    res.status(200).send(JSON.stringify({ "message": "Project deleted successfully" }))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Delete Scene
app.delete("/api/scene/delete", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, async function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const sid = req.query.s_Id;
                await schema.sceneSchema.findOneAndDelete({ "sceneId": sceneId }).then(result => {

                    res.status(200).send(JSON.stringify({ "message": "Scene deleted successfully" }))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Delete Shot
app.delete("/api/shot/delete", (req, res) => {
    auth = req.headers.authorization;
    if (auth !== null && auth !== '') {

        jwt.verify(auth, process.env.REACT_APP_SECRETE_KEY, function (error, outcome) {
            if (error) {
                return res.status(401).send(JSON.stringify({
                    error: "Authorization Failed"
                }))
            }
            else {
                const shid= req.query.sh_Id;
                
                schema.shotSchema.findOneAndDelete({"shotId":shid}).then(result=>{
                    res.status(200).send(JSON.stringify({ "message": "Shot deleted successfully" }))
                })
            }
        })
    }
    else {
        res.status(401).send(JSON.stringify({
            error: "Authorization Failed"
        }))
    }
})


//Connection to the Server
app.listen(process.env.REACT_APP_PORT, () => {
    console.log(`Server running on the port ${process.env.REACT_APP_PORT}`)
    console.log(`DB name ${process.env.REACT_APP_DB_NAME}`)
});