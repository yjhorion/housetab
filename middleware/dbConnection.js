import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

export async function createDatabase(router) {
    try {

        dotenv.config()
        
        const DATABASE_URL = process.env.DATABASE_URL
        const DATABASE_PW = process.env.DATABASE_PW

      const connection = await mysql.createConnection({
        host: DATABASE_URL,
        user: 'root',
        password: DATABASE_PW,
        database: 'housetab'
      });
      
      router


      await connection.end();
      console.log('Connection closed.');
    } catch (error) {
      console.error('Error creating database:', error);
    }
  }