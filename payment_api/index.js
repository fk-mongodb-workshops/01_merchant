const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment');
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
const OpenAI = require("openai");

dotenv.config();

const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
    const data = req.body;

    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
    const mdbClient = new MongoClient(uri);
    await mdbClient.connect();
    const customersColl = mdbClient.db("linkaja").collection("customers");
    const customerDt = await customersColl.findOne({ "profile.userid": data.user_id });
    await mdbClient.close();

    console.log(customerDt);

    const openApiClient = new OpenAI({
        apiKey: process.env.OPENAI_TOKEN,
    });

    const completion = await openApiClient.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that answers questions based on the provided documentation."
            },
            {
                role: "user",
                content: `
                    My profile: ${customerDt.my_story}.
    
                    Question: ${data.question}.
    
                    Please answer the question in maximum one paragraph using information from my profile. If the answer isn't in my profile, say so politely.
                    `,
            },
        ],
    });

    const response = completion.choices[0].message.content;
    res.send({ response })
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
