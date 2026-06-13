import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!DB_HOST) {
  throw new Error("DB_HOST não definido no arquivo .env");
}

if (!DB_USER) {
  throw new Error("DB_USER não definido no arquivo .env");
}

if (!DB_NAME) {
  throw new Error("DB_NAME não definido no arquivo .env");
}

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT ?? 3306),
  user: DB_USER,
  password: DB_PASSWORD ?? "",
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});