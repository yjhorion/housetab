import express from 'express'
import {default as statistics}  from './routes/statistics.router.js'
import {default as getOrders} from './routes/getOrder.router.js'
import {default as insertData} from './routes/data.router.js'



const app = express()
const PORT = 3000



app.use('/', [
    statistics,
    getOrders,
    insertData
])

app.listen(PORT, () => {
    console.log(`express server open on port ${PORT}`)
})



// /* 엑셀 데이터를 db에 삽입하는 API*/
// dotenv.config()
// const DATABASE_URL = process.env.DB_URL
// const DATABASE_PW = process.env.DB_PW


// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// const example = xlsx.parse(`${__dirname}/testdata.xlsx`)  // router로 만들경우, example 변수에 parsing 되어 할당되는 xlsx 파일을 multer 로 S3에 저장했다가 불러오는 방식으로. req에서 파일을 formdata 형식으로 받을것.
// const UserData = example[0]['data']
// const OrderData = example[1]['data']

// async function createDatabase() {
//     try {
//       const connection = await mysql.createConnection({
//         host: DATABASE_URL,
//         user: 'root',
//         password: DATABASE_PW,
//         database: 'housetab'
//       });

      
//       for (let i = 1; i < UserData.length; i++) {
//           if (!UserData[i][0]) {
//               break;
//             }    
//             const [UserId, UserName, UserGrade] = UserData[i]
            
            
//             await connection.execute('INSERT INTO customer (UserId, UserName, UserGrade) VALUES (?, ?, ?)', [UserId, UserName, UserGrade])
//         }  
        
//         for (let i = 1; i< OrderData.length; i++) {
//           if (!OrderData[i][0]) {
//               break;
//           }
//           const [UserId, OrderDate, OrderType, OrderPrice] = OrderData[i]
//           const formattedOrderDate = new Date((OrderDate - 2) * 24 * 60 * 60 * 1000 + Date.UTC(1900, 0, 1)).toISOString().slice(0,10)
//           await connection.execute('INSERT INTO orders (UserId, OrderDate, OrderType, OrderPrice) VALUES (?, ?, ?, ?)', [UserId, formattedOrderDate, OrderType, OrderPrice])
//         }


//       await connection.end();
//       console.log('Connection closed.');
//     } catch (error) {
//       console.error('Error creating database:', error);
//     }
//   }
  

//   createDatabase();