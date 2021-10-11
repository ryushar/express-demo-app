require("dotenv").config();

const express = require("express");
const { AddEmployee, GetEmployees, GetEmployee } = require("./routes");

const app = express();
const port = parseInt(process.env.PORT);

app.get("/add_employee", (req, res) => {
  AddEmployee(req, res);
});

app.get("/get_employees", (req, res) => {
  GetEmployees(req, res);
});

app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});
