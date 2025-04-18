const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment');
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();

const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
    const data = req.body;
    console.log(data)
    res.send('Hello World!')
})

app.post('/pay', async (req, res) => {
    const data = req.body;

    let newDt = Object.assign({}, data);
    newDt.date = new Date();
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
    const client = new MongoClient(uri);
    await client.connect();

    const customerRefuelsColl = client.db("linkaja").collection("customer_refuels");

    const result = await customerRefuelsColl.insertOne(newDt);

    await client.close();

    res.send(result);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
