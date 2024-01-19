import { prisma } from '../utils/prisma/index.js'
import express from 'express'

const router = express.Router()

/* 전체 월별 매출 통계 API */
router.get("/statistics", async (req, res, next) => {
    try {

        const firstOrder = await prisma.orders.findFirst({
            orderBy : {
                OrderDate : 'asc'
            }
        })

        const lastOrder = await prisma.orders.findFirst({
            orderBy: {
                OrderDate : 'desc'
            }
        })

        const firstDate = new Date(firstOrder.OrderDate)
        firstDate.setDate(1)

        const lastDate = new Date(lastOrder.OrderDate)

        const orders = []
        const refunds = []

        while (firstDate <= lastDate) {
            const endDate = new Date(firstDate)
            endDate.setMonth(firstDate.getMonth() + 1)
            endDate.setDate(0)

            
                    const ordersEachMonth = await prisma.orders.findMany({
                        where : {
                            OrderType : 'order',
                            OrderDate : {
                                gte : firstDate,
                                lte : endDate,
                            }
                        },
                        select : {
                            OrderDate : true,
                            OrderType : true,
                            OrderPrice : true
                        }
                    })

                    orders.push(ordersEachMonth)
                    
                    

                    const refundsEachMonth = await prisma.orders.findMany({
                        where : {
                            OrderType : 'refund',
                            OrderDate : {
                                gte : firstDate,
                                lte: endDate,
                            },
                        },
                        select : {
                            OrderDate : true,
                            OrderType : true,
                            OrderPrice : true
                        }
                    })

                    

                    refunds.push(refundsEachMonth)

                    firstDate.setMonth(firstDate.getMonth() + 1)
        }

        const OrderTotal = orders.map(month => {
            const total = month.reduce((sum, entry) => sum + entry.OrderPrice, 0);
            const orderDate = new Date(month[0].OrderDate);
        

            return {
                year: orderDate.getFullYear(),
                month: orderDate.getMonth() + 1,
                total: total
            };
        });

        const RefundTotal = refunds.map(month => {
            const total = month.reduce((sum, entry) => sum + entry.OrderPrice, 0);
            const orderDate = new Date(month[0].OrderDate);
        

            return {
                year: orderDate.getFullYear(),
                month: orderDate.getMonth() + 1,
                total: total
            };
        });


const OrderTotalMap = new Map(OrderTotal.map(item => [`${item.year}-${item.month}`, item.total]));
const refundTotalMap = new Map(RefundTotal.map(item => [`${item.year}-${item.month}`, item.total]));


const result = [];


OrderTotal.forEach(order => {
    const key = `${order.year}-${order.month}`;
    const refund = refundTotalMap.get(key) || 0; 
    const netTotal = order.total - refund;


    result.push({
        year: order.year,
        month: order.month,
        OrderTotal: order.total,
        RefundTotal: refund,
        NetTotal: netTotal
    });
});
        
        
        return res.status(200).json({ data : result })
    } catch (error) {
        return res.status(400).json({ message : error.message })
    }
})

export default router