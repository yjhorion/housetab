import { prisma } from '../utils/prisma/index.js'
import express from 'express'

const router = express.Router()

/* 주문일자 기준 내림차순으로 기본 정렬된 전체 주문내역 */


router.get('/orders/every', async (req, res, next) => {
    try {
        const pageNo = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 50
        const orders = await prisma.orders.findMany({
            orderBy : {
                OrderDate : 'desc'
            },
            select : {
                OrderDate : true,
                OrderType : true,
                OrderPrice : true,
                Customer: {
                    select: {
                        USERNAME: true,
                        UserGrade: true
                    }
                },
            },
            take : pageSize,
            skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
        })

        return res.status(200).json({ data : orders })
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }
})



/* 필터적용 */
router.get('/orders/filtered', async (req, res, next) => {
    try {
        const { startDate, endDate, orderType, customerId} = req.query
        const pageNo = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 50
        const startDateReform = new Date (startDate)
        const endDateReform = new Date (endDate)
        let orderTypeReform = ""
        let orders
        if (orderType == 0) {
            orderTypeReform = "order"
        } else if (orderType == 1) {
            orderTypeReform = "refund"
        }
        
        if ( startDate && endDate && !orderType && !customerId) {
            orders = await prisma.orders.findMany({
                where : {
                    OrderDate : {
                        gte : startDateReform,
                        lte : endDateReform
                    },
                },
                take: pageSize,
                skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
            })
        } else if ( orderType && (!startDate || !endDate) && !customerId) {
            orders = await prisma.orders.findMany({
                where : {
                    OrderType : orderTypeReform
                },
                take: pageSize,
                skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
            })
        } else if ( customerId && (!startDate || !endDate) && !orderType ) {
            orders = await prisma.orders.findMany({
                where : {
                    UserId : +customerId
                },
                take: pageSize,
                skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
            })
        } else if ( customerId && orderType && (!startDate || !endDate)) {
            orders = await prisma.orders.findMany({
                where : {
                    UserId : +customerId,
                    OrderType : orderTypeReform
                },
                take: pageSize,
                skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
            })
        } else if ( startDate && endDate && orderType && !customerId) {
            orders = await prisma.orders.findMany({
                where : {
                    OrderDate : {
                        gte : startDateReform,
                        lte : endDateReform
                    },
                    OrderType : orderTypeReform
                },
                take: pageSize,
                skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
            })
        } else if ( startDate && endDate && customerId && !orderType) {
            orders = await prisma.orders.findMany({
                where : {
                    OrderDate : {
                        gte : startDateReform,
                        lte : endDateReform
                    },
                    UserId : +customerId
                },
                take: pageSize,
                skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
            })
        } else if ( startDate && endDate && customerId && orderType) {
            orders = await prisma.orders.findMany({
                where : {
                    OrderDate : {
                        gte : startDateReform,
                        lte : endDateReform
                    },
                    UserId : +customerId,
                    OrderType : orderTypeReform
                },
                take: pageSize,
                skip : pageNo > 1 ? (pageNo -1) * pageSize : 0
            })
        }


        return res.status(200).json({ data : orders })
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }
})



export default router