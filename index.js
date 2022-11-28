const express = require('express');
const app = express();
const cors = require("cors");
const mysql = require("mysql");

const db = mysql.createPool({
    host: process.env.REACT_APP_HOST_NAME,
    user: process.env.REACT_APP_USER,
    password: process.env.REACT_APP_PASSWORD,
    database: process.env.REACT_APP_DATA_BASE
});

app.use(cors());
app.use(express.json())

app.get('/api/export/:projectId', (req, res) => {
    const { projectId } = req.params;
    const getProjectsForExport = "call "+process.env.REACT_APP_DATA_BASE+".get_full_project(?);"
    db.query(getProjectsForExport, [projectId], (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.get('/api/projects', (req, res) => {
    const projects = 'SELECT * FROM projects order by sn asc'
    db.query(projects, (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.get("/api/details/project/:projectId", (req, res) => {
    const { projectId } = req.params;
    const projectDetails = "SELECT * FROM projects WHERE projectId =? order by sn asc"
    db.query(projectDetails, [projectId], (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.get("/api/project/:projectId", (req, res) => {
    const { projectId } = req.params;
    const project = "SELECT * FROM scenes WHERE projectId =? order by sn asc"
    db.query(project, [projectId], (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.get("/api/details/scene/:sceneId", (req, res) => {
    const { sceneId } = req.params;
    const sceneDetails = "SELECT * FROM scenes WHERE sceneId =? order by sn asc"
    db.query(sceneDetails, [sceneId], (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.get("/api/scene/:sceneId", (req, res) => {
    const { sceneId } = req.params;
    const scene = `SELECT * FROM shots
    where sceneId='${sceneId}' order by sn asc`

    db.query(scene, (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.get("/api/details/shot/:shotId", (req, res) => {
    const { shotId } = req.params;
    const shot = `SELECT * FROM shots
    where shotId='${shotId}'`

    db.query(shot, (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.get("/api/shot/:shotId", (req, res) => {
    const { sceneId, shotId } = req.params;
    const shot = `SELECT * FROM shots
    where sceneId='${sceneId}' and shotId='${shotId}' order by sn asc`

    db.query(shot, (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.post('/api/project/create', (req, res) => {
    const projectId = req.body.id
    const projectName = req.body.name
    const createProject = `INSERT INTO projects (projectid,projectName) VALUES ('${projectId}','${projectName}')`
    db.query(createProject, (error, result) => {
        res.send(result)
    })
})

app.post('/api/scene/create', (req, res) => {
    const proId = req.body.proId
    const sceneId = req.body.id
    const number = req.body.number
    const description = req.body.description
    const loctype = req.body.locType
    const loc = req.body.loc
    const time = req.body.time

    const createScene = `INSERT INTO scenes (sceneId,projectId,number,description,locationType,location,time) VALUES
    ('${sceneId}','${proId}','${number}','${description}','${loctype}','${loc}','${time}')`

    db.query(createScene, (error, result) => {
        if (error) {
            res.send(error)
        }
        res.send(result)
    })
})

app.post('/api/shot/create', (req, res) => {

    const shotId = req.body.shotId
    const sceneId = req.body.sceneId
    const number = req.body.number
    const type = req.body.type
    const angle = req.body.angle
    const movement = req.body.movement
    const action = req.body.action
    const notes = req.body.notes

    const createShot = 'INSERT INTO shots (shotId,sceneId,number,type,angle,movement,action,notes) VALUES (?,?,?,?,?,?,?,?)';
    db.query(createShot, [shotId, sceneId, number, type, angle, movement, action, notes],
        (error, result) => {
            if (error) {
                res.send("Error" - error)
            }
            res.send(result)
        })
})

app.put('/api/project/update', (req, res) => {
    const projectId = req.body.id
    const projectName = req.body.projectname
    const updateProject = `update projects
    set projectName='${projectName}'
    where projectId = '${projectId}'`
    db.query(updateProject, (error, result) => {
        if (error) {
            res.send("Error" - error)
        }
        res.send(result)
    })
})

app.put('/api/scene/update', (req, res) => {
    const prjectId = req.body.prjectId
    const sceneId = req.body.id
    const sceneNumber = req.body.number
    const sceneDescription = req.body.description
    const locationType = req.body.locType
    const location = req.body.loc
    const time = req.body.time

    const updateScene = `update scenes
    set number='${sceneNumber}', description='${sceneDescription}', locationType='${locationType}' , location='${location}' , time='${time}'
    where projectId= '${prjectId}' and sceneId ='${sceneId}'`

    db.query(updateScene, (error, result) => {
        if (error) {
            res.send("Error" - error)
        }
        res.send(result)
    })
})

app.post('/api/shot/update', (req, res) => {

    const shotId = req.body.shotId
    const sceneId = req.body.sceneId
    const number = req.body.number
    const type = req.body.type
    const angle = req.body.angle
    const movement = req.body.movement
    const action = req.body.action
    const notes = req.body.notes

    const updateShot = `update shots
    set number='${number}', type='${type}', angle='${angle}' , movement='${movement}' , action='${action}', notes='${notes}'
    where sceneId= '${sceneId}}' and shotId ='${shotId}'`;

    db.query(updateShot, (error, result) => {
        if (error) {
            res.send("Error" - error)
        }
        res.send(result)
    })
})

app.delete("/api/project/delete/:projectId", (req, res) => {
    const { projectId } = req.params;
    const deleteProject = "CALL "+process.env.REACT_APP_DATA_BASE+".delete('project', ?)"
    db.query(deleteProject, projectId, (error, result) => {
        if (error) {
            res.send("Error" - error)
        }
        res.send(result)
    })

})

app.delete("/api/scene/delete/:sceneId", (req, res) => {
    const { sceneId } = req.params;
    const deleteScene = "CALL "+process.env.REACT_APP_DATA_BASE+".delete('scene', ?)"
    db.query(deleteScene, [sceneId], (error, result) => {
        if (error) {
            res.send("Error" - error)
        }
        res.send(result)
    })
})

app.delete("/api/shot/delete/:shotId", (req, res) => {
    const { shotId } = req.params;
    const deleteShot = "CALL "+process.env.REACT_APP_DATA_BASE+".delete('shot', ?)"
    db.query(deleteShot, [shotId], (error, result) => {
        if (error) {
            res.send("Error" - error)
        }
        res.send(result)
    })
})

app.listen(process.env.REACT_APP_PORT, () => {
    console.log(`Server is running on ${process.env.REACT_APP_PORT}....`);
});