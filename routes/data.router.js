// database.router.js

import express from 'express';
import xlsx from 'node-xlsx';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import path from 'path'

const router = express.Router();

dotenv.config();

const DATABASE_URL = process.env.DB_URL;
const DATABASE_PW = process.env.DB_PW;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parentDir = path.join(__dirname, '..')

const example = xlsx.parse(path.join(parentDir, `testdata.xlsx`));
const UserData = example[0]['data'];
const OrderData = example[1]['data'];


async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DATABASE_URL,
      user: 'root',
      password: DATABASE_PW,
      database: 'housetab',
    });

    for (let i = 1; i < UserData.length; i++) {
      if (!UserData[i][0]) {
        break;
      }
      const [UserId, UserName, UserGrade] = UserData[i];

      await connection.execute(
        'INSERT INTO customer (UserId, UserName, UserGrade) VALUES (?, ?, ?)',
        [UserId, UserName, UserGrade]
      );
    }

    for (let i = 1; i < OrderData.length; i++) {
      if (!OrderData[i][0]) {
        break;
      }
      const [UserId, OrderDate, OrderType, OrderPrice] = OrderData[i];
      const formattedOrderDate = new Date(
        (OrderDate - 2) * 24 * 60 * 60 * 1000 + Date.UTC(1900, 0, 1)
      )
        .toISOString()
        .slice(0, 10);
      await connection.execute(
        'INSERT INTO orders (UserId, OrderDate, OrderType, OrderPrice) VALUES (?, ?, ?, ?)',
        [UserId, formattedOrderDate, OrderType, OrderPrice]
      );
    }

    await connection.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error creating database:', error);
  }
}


router.post('/create-database', async (req, res) => {
  createDatabase(); 
  res.status(200).json({ message: '데이터베이스에 입력이 시작되었습니다' });
});

export default router;
