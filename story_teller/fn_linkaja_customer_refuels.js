import moment from "moment";
import { VoyageAIClient } from "voyageai";
import { MongoClient } from "mongodb";
import 'dotenv/config';

const exportFn = async function (arg) {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();

  // Start of function
  var serviceName = "linkaja-dev";

  var dbName = "linkaja";
  var collName = "trx_logs";

  // var collection = context.services.get(serviceName).db(dbName).collection(collName);
  var collection = client.db(dbName).collection(collName);

  var insertResult;
  try {
    insertResult = await collection.insertOne(arg);

  } catch (err) {
    console.log("Error occurred while executing insertOne:", err.message);

    return { error: err.message };
  }

  await client.close();

  return { result: insertResult };

  // end of function
};

export { exportFn as execute };