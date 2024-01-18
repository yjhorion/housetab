import express from 'express'
import xlsx from 'node-xlsx'
import { fileURLToPath } from 'url'


const router = express.Router()

router.post("/InsertData", async (req, res, next) => {

    const { filePath } = req.body

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    
    const example = xlsx.parse(`filepath`)
    const UserData = example[0]['data']
    const OrderData = example[1]['data']
    
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

      return res.status(201).json({ message : "Successfully Inserted into Database"})
})

export default router
