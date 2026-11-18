import express from 'express'
import dotenv from 'dotenv';
import http from 'http';

dotenv.config()
const app: express.Application =express()

const PORT = process.env.PORT
const  server =http.createServer(app) 



app.get("/",function(req:any, res:any){
    res.send("this route works")
})


app.get("/health",function(req:any, res:any){
    res.json({ status: 'ok', timestamp: new Date() })
})

server.listen(PORT , () => {
    console.log(`Server is running on ${PORT}` )
})