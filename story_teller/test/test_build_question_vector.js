import { customerToStory } from "../util/util_translator.js";
import { embed } from "../util/util_embedder.js";
import { prompt } from "../util/util_prompter.js";
import { MongoClient } from "mongodb";
import 'dotenv/config';


const main = async () => {

  const question = "By product";
  const questionEmbedObj = await embed(question);
  const questionEmbed = questionEmbedObj.data[0].embedding;

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();

  const coll = client.db("linkaja").collection("kiosk_question_filters");
  await coll.insertOne({
    question,
    questionEmbed,
    parameters: ['product']
  });

  await client.close();
  console.log("");
  console.log("====================");
  console.log("");

  // const q1 = "Which fuel product sold the most in the last 4 months?";
  // const q2 = "What is the total amount of sales that all the petrol kiosks in the Jakarta Pusat region?";
  // const q3 = "What is the average amount spent per customer for each per fuel top-up?";
  // const q4 = "What is the frequency of fuel top up for a Jakarta Selatan?";
}

(async function () {
  await main();
})();