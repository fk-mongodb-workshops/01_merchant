import moment from "moment";
import { MongoClient } from "mongodb";
import 'dotenv/config';
import axios from 'axios';

const exportFn = async function (arg) {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();

  // Start of function
  var serviceName = "linkaja-dev";

  var dbName = "linkaja";
  var collName = "trx_logs";

  const voyageAiToken = process.env.VOYAGEAI_TOKEN; // For internal testing
  // const voyageAiToken = context.environment.values.VOYAGEAI_TOKEN; // For function

  let doc = arg.fullDocument;
  const { data } = await axios.post('https://api.voyageai.com/v1/embeddings', {
    "input": [doc.product],
    "model": "voyage-3-lite"
  }, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${voyageAiToken}`
    }
  })
 
  const newDoc = {
    amount: doc.amount,
    litres: doc.litres,
    product: doc.product,
    productEmbedding: data.data[0].embedding
  };

  // var collection = context.services.get(serviceName).db(dbName).collection(collName); // For function
  var collection = client.db(dbName).collection(collName); // For internal testing

  var insertResult;
  try {
    insertResult = await collection.insertOne(newDoc);

  } catch (err) {
    console.log("Error occurred while executing insertOne:", err.message);

    return { error: err.message };
  }

  await client.close(); // For internal testing

  return { result: insertResult };

  // end of function
};

export { exportFn as execute };