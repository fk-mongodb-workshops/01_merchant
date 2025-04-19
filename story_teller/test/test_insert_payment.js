import moment from "moment";
import { MongoClient } from "mongodb";
import 'dotenv/config';

const main = async () => {

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();

  const customerRefuelsColl = client.db("linkaja").collection("customer_refuels");
  await customerRefuelsColl.insertOne({
    "amount": 9010,
    "litres": 5,
    "spbu": "111223",
    "date": new Date(),
    "product": "RON93",
    "user_id": "0003",
    "user_name": "Arwin Santosi"
  });
  
  await client.close();
}

(async function () {
  await main();
})();