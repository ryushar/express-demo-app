const mysqlx = require("@mysql/xdevapi");
const { GetFieldsByType } = require("./utilities");

const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;
const TABLE_NAME = "Employee";

async function DBGetSession() {
  const config = { host: DB_HOST, user: DB_USERNAME, password: DB_PASSWORD };
  return await mysqlx.getSession(config);
}

async function DBCreateTable() {
  const session = await DBGetSession();
  await session
    .sql(
      `CREATE TABLE ${TABLE_NAME} (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL,
        address VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL,
        ctc DOUBLE NOT NULL,
        da DOUBLE NOT NULL,
        epf DOUBLE NOT NULL,
        grossSalary DOUBLE NOT NULL,
        netSalary DOUBLE NOT NULL,
        PRIMARY KEY (id)
      );`
    )
    .execute();
  return await db.getTable(TABLE_NAME);
}

async function DBGetTable() {
  const session = await DBGetSession();
  const db = await session.getSchema("temp");
  const table = await db.getTable(TABLE_NAME);
  const tableExists = await table.existsInDatabase();
  if (tableExists) return table;
  else return await DBCreateTable();
}

async function DBAddEmployee(name, address, type, ctc, da, epf, grossSalary, netSalary) {
  const table = await DBGetTable();
  await table
    .insert(["name", "address", "type", "ctc", "da", "epf", "grossSalary", "netSalary"])
    .values([name, address, type, ctc, da, epf, grossSalary, netSalary])
    .execute();
}

async function DBEmployeeExists(name, type) {
  const table = await DBGetTable();
  const result = await table
    .select("id")
    .where("name = :n", "type = :t")
    .bind("n", name)
    .bind("t", type)
    .execute();
  return result.fetchOne() !== undefined;
}

async function DBGetEmployees(name, type, ownInfo) {
  const table = await DBGetTable();
  let query = ownInfo ? table.select() : table.select(GetFieldsByType(type));
  if (ownInfo) query = query.where("name = :n", "type = :t").bind("n", name).bind("t", type);
  const result = await query.execute();
  const columns = result.getColumns().map((col) => col.getColumnName());
  const rows = result.fetchAll().map((row) =>
    row.reduce((obj, value, index) => {
      obj[columns[index]] = value;
      return obj;
    }, {})
  );
  return rows;
}

module.exports = { DBAddEmployee, DBGetEmployees, DBEmployeeExists };
