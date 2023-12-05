const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const tasks = [];

let uniqueID = 0;

function addTask(name, description, status) {
    const now = new Date();
    tasks.push({
        id: uniqueID,
        name: name,
        description: description,
        status: status,
        created_at: now.toISOString()
    });
    uniqueID++;
}

function removeTask(id) {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    } else {
        throw new Error('Task not found');
    }
}

app.get('/tasks', (req, res) => {
    try {
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/tasks', (req, res) => {
    try {
        addTask(req.body.name, req.body.description, req.body.status);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/tasks/:id', (req, res) => {
    try {
        removeTask(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});