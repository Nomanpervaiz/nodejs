import express from "express";
const app = express();
const PORT = 4000;

const tasks = [
    { id: 1, name: "Complete project documentation", status: "pending" },
    { id: 2, name: "Review pull requests", status: "in progress" },
    { id: 3, name: "Fix login bug", status: "completed" },
    { id: 4, name: "Plan team meeting", status: "pending" },
    { id: 5, name: "Update project roadmap", status: "in progress" },
];

app.use(express.json());

function middleware(req, res, next) {
    console.log("get req ==>", req.query);
    const query = req.query.auth === "true";
    if (!query) {
        return res
            .status(403)
            .send("You are not authorized to access this resource.");
    }
    next();
}


app.get("/task/:id", (req, res) => {
    console.log("get req ==>", req.params);
    const parameterId = req.params.id
    const findId = tasks.findIndex((obj) => obj.id == parameterId)
    if (tasks[findId]) {
        res.status(200).send(tasks[findId]);
    }
    res.status(404).send("task not found!");
});


app.post("/task", middleware, (req, res) => {
    let newtask = req.body;
    let isTaskExisted = tasks.findIndex((obj) => obj.id === newtask.id);
    if (!newtask.id && !newtask.name && !newtask.status) {
        return res
            .status(404)
            .send("invalid task data , missing id ,name or status");
    }
    if (isTaskExisted === -1) {
        tasks.push(newtask);
        res.status(200).send(tasks);
    }
    res.status(403).send("task already added!");
});


app.put("/task", (req, res) => {
    res.send("hello put request");
});




app.delete("/task", middleware, (req, res) => {
    console.log( "req in delete ==> " , req.body);
    
    let deleteTask = req.body;
    const taskIndex = tasks.findIndex((obj) => obj.id === deleteTask.id);
    if (taskIndex === -1) {
        return res.status(404).send("Task deleted");
    }
    tasks.splice(taskIndex, 1);
    res.status(200).send({ message: "task deleted successfully !", tasks });
});

app.listen(PORT, () => console.log("Server runing on PORT " + PORT));
