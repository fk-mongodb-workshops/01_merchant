import { salesToStory } from "../util/util_translator.js";
import { embed } from "../util/util_embedder.js";
import { promptMechant } from "../util/util_prompter.js";
import { MongoClient } from "mongodb";
import 'dotenv/config';
const main = async () => {

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();
  const salesColl = client.db("linkaja").collection("kiosk_transactions");
  const salesDt = await salesColl.aggregate(
    [
      { $sort: { 'Refueled Date': -1 } },
      { $project: { _id: 0 } },
      { $limit: 20 }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  ).toArray();

  let story = "";

  salesDt.forEach(e => {
    story += salesToStory(e);
  })
  
  console.log("====================");
  console.log("");

  const q1 = "Which fuel product sold the most in the last 4 months?";
  const q2 = "What is the total amount of sales that all the petrol kiosks in the Jakarta Pusat region?";
  const q3 = "What is the average amount spent per customer for each per fuel top-up?";
  const q4 = "What is the frequency of fuel top up for a Jakarta Selatan?";
  const answer = await promptMechant(story, q4);
  console.log(answer)
  console.log("");

  await client.close();
}

(async function () {
  await main();
})();