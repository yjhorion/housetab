import xlsx from 'node-xlsx'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
const DATABASE_URL = process.env.DATABASE_URL
const DATABASE_PW = process.env.DATABASE_PW


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const example = xlsx.parse(`${__dirname}/testdata.xlsx`)
const UserData = example[0]['data']
const OrderData = example[1]['data']


async function createDatabase() {
    try {
      const connection = await mysql.createConnection({
        host: DATABASE_URL,
        user: 'root',
        password: DATABASE_PW,
        database: 'housetab'
      });

      
      for (let i = 1; i < UserData.length; i++) {
          if (!UserData[i][0]) {
              break;
            }    
            const [UserId, UserName, UserGrade] = UserData[i]
            
            
            await connection.execute('INSERT INTO customer (UserId, UserName, UserGrade) VALUES (?, ?, ?)', [UserId, UserName, UserGrade])
        }  
        
        for (let i = 1; i< OrderData.length; i++) {
          if (!OrderData[i][0]) {
              break;
          }
          const [UserId, OrderDate, OrderType, OrderPrice] = OrderData[i]
          const formattedOrderDate = new Date((OrderDate - 2) * 24 * 60 * 60 * 1000 + Date.UTC(1900, 0, 1)).toISOString().slice(0,10)
          await connection.execute('INSERT INTO orders (UserId, OrderDate, OrderType, OrderPrice) VALUES (?, ?, ?, ?)', [UserId, formattedOrderDate, OrderType, OrderPrice])
        }


      await connection.end();
      console.log('Connection closed.');
    } catch (error) {
      console.error('Error creating database:', error);
    }
  }
  

  createDatabase();




// 빈 행을 걸러내는 if문 - 0번째 행은 고객 id, 고객명, 고객등급을 포함하고 있으므로 1번부터 진행하면 된다. index 0번은 무시하도록할것
// const cellnumber = 95
// if (example[0]['data'][cellnumber][0]) {
//     console.log(example[0]['data'][cellnumber])
// } else {
//     console.log('empty')
// }

