const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const organizationsRouter = require('./routes/organizations');
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');
const profileRouter = require('./routes/profile');
const homeRouter = require('./routes/home');
const signRouter = require('./routes/sign');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/organizations', organizationsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/profile', profileRouter);
app.use('/api/home', homeRouter);
app.use('/api/sign', signRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
