const { DBAddEmployee, DBEmployeeExists, DBGetEmployees, DBGetEmployee } = require("./database");
const { CalculateSalaryInfo } = require("./utilities");

const VALID_TYPES = ["junior-developer", "senior-developer", "accountant", "hr"];

async function AddEmployee(req, res) {
  const { name, address, type } = req.query;
  const basicSalary = parseInt(req.query.salary);
  const rentPayed = parseInt(req.query.rentPayed) || 0;

  if (name === undefined) {
    res.status(400);
    res.send({ status: "error", error: "invalid_name" });
  }
  if (address === undefined) {
    res.status(400);
    res.send({ status: "error", error: "invalid_address" });
  }
  if (type === undefined || !VALID_TYPES.includes(type)) {
    res.status(400);
    res.send({ status: "error", error: "invalid_type" });
  }
  if (isNaN(basicSalary)) {
    res.status(400);
    res.send({ status: "error", error: "invalid_salary" });
  }

  const { ctc, da, epf, grossSalary, netSalary } = CalculateSalaryInfo(
    basicSalary,
    rentPayed,
    address
  );

  try {
    await DBAddEmployee(name, address, type, ctc, da, epf, grossSalary, netSalary);
    res.send({ status: "success" });
  } catch (error) {
    res.status(500);
    res.send({ status: "error", error: "internal_server_error" });
    console.error(error);
  }
}

async function GetEmployees(req, res) {
  const { name, type, ownInfo } = req.query;

  if (name === undefined) {
    res.status(400);
    res.send({ status: "error", error: "invalid_name" });
  }
  if (type === undefined || !VALID_TYPES.includes(type)) {
    res.status(400);
    res.send({ status: "error", error: "invalid_type" });
  }

  try {
    const employeeExists = await DBEmployeeExists(name, type);
    if (employeeExists) {
      const employees = await DBGetEmployees(name, type, ownInfo === "true");
      res.send({ status: "success", employees });
    } else {
      res.status(400);
      res.send({ status: "error", error: "employee_not_found" });
    }
  } catch (error) {
    res.status(500);
    res.send({ status: "error", error: "internal_server_error" });
    console.error(error);
  }
}

module.exports = { AddEmployee, GetEmployees };
