import client from "prom-client";
import express from "express"
import { metricsMiddleware } from "./monitoring";

const app=express();
app.use(metricsMiddleware);

app.get("/user",async(req,res)=>{
    
    res.json({
        name:"John Doe",
        age:25
    })
}
)

app.post('/user',async(req,res)=>{
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.json({
    name:"nandhan"
})
})


app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})
app.listen(3000)