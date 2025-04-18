import moment from "moment";
import { MongoClient } from "mongodb";
import 'dotenv/config';
import axios from 'axios';

const customerToStory = customerObj => {
  let ret = `This is story about me. My name is ${customerObj.profile.name}. `;
  ret = ret + `My total spent until this present is as follow, total amount ${customerObj.to_date.total_spent} Rupiah and ${customerObj.to_date.total_litres} litres. `;
  ret = ret + `My average spent is as follow, amount ${customerObj.to_date.average_spent} Rupiah and ${customerObj.to_date.average_litres} litres. `;
  ret = ret + `I mostly visited this gas station ${customerObj.to_date.most_spbu}. `;
  ret = ret + `I mostly purchased this product ${customerObj.to_date.most_product}. `;
  ret = ret + `My last refueled amount is ${customerObj.last_refuel.amount} Rupiah and ${customerObj.last_refuel.litres} litres, at this fuel station ${customerObj.last_refuel.spbu}, on ${moment(customerObj.last_refuel.date, "YYYY-MM-DD HH:mm").format("DD-MMM-YYYY HH:mm")}, this product ${customerObj.last_refuel.product}. `;
  ret = ret + `The following is my most recent refueling activities: `;
  for (let i = 0; i < customerObj.refuels.length; i++) {
    const r = customerObj.refuels[i];
    ret = ret + `On ${moment(r.date, "YYYY-MM-DD HH:mm").format("DD-MMM-YYYY HH:mm")} at this fuel station ${r.spbu}, refueled ${r.litres} litres of this product ${r.product} as much as ${r.amount}, `;
  }
  return ret;
}

const exportFn = async function (arg) {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();
  const context = {
    environment: {
      values: {
        VOYAGEAI_TOKEN: process.env.VOYAGEAI_TOKEN
      }
    },
    services: {
      get: (nm) => {
        return client;
      }
    }
  }

  // Start of function
  // ---------------------------------------

  const serviceName = "linkaja-dev";
  const con = context.services.get(serviceName);

  const dbName = "linkaja";
  const trxLogCollNm = "trx_logs";
  const customerCollNm = "customers";

  const voyageAiToken = context.environment.values.VOYAGEAI_TOKEN;

  const doc = arg.fullDocument;

  try {
    // Transaction logging
    const customerColl = con.db(dbName).collection(customerCollNm);
    const customer = await customerColl.findOne({ "profile.userid": doc.user_id });
    let newCustomer = {};
    newCustomer.last_refuel = {
      spbu: doc.spbu,
      date: doc.date,
      amount: doc.amount,
      product: doc.product,
      litres: doc.litres
    }

    const totalSpent = customer.to_date.total_spent || 0;
    const totalLitres = customer.to_date.total_litres || 0;
    const totalActivities = customer.to_date.total_activities || 0;
    newCustomer.to_date = {};
    newCustomer.to_date.total_spent = doc.amount + totalSpent;
    newCustomer.to_date.total_litres = doc.litres + totalLitres;
    newCustomer.to_date.total_activities = totalActivities + 1;
    newCustomer.to_date.average_spent = (newCustomer.to_date.total_spent / newCustomer.to_date.total_activities).toFixed(0);
    newCustomer.to_date.average_litres = (newCustomer.to_date.total_litres / newCustomer.to_date.total_activities).toFixed(0);
    newCustomer.to_date.most_product = doc.product;
    newCustomer.to_date.most_spbu = doc.spbu;

    newCustomer.profile = {
      userid: doc.user_id,
      name: doc.user_name,
    }

    let refuels = newCustomer.refuels;
    if (refuels == null) {
      refuels = []
    }
    refuels.push(newCustomer.last_refuel);
    newCustomer.refuels = refuels;

    const myStory = customerToStory(newCustomer);

    const embeddingData = await axios.post('https://api.voyageai.com/v1/embeddings', {
      "input": [myStory],
      "model": "voyage-3-lite"
    }, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${voyageAiToken}`
      }
    })
 
    const updateResult = await con.db(dbName).collection(customerCollNm).updateOne({ "profile.userid": doc.user_id },
      {
        $set: {
          to_date: newCustomer.to_date, profile: newCustomer.profile, last_refuel: newCustomer.last_refuel,
          refuels: newCustomer.refuels, my_story: myStory, my_story_embedding: embeddingData.data.data[0].embedding
        }
      },
      {
        upsert: true
      });

  } catch (err) {
    console.log("Error occurred while executing updating customer record:", err.message);
    await client.close(); // For internal testing
    return { error: err.message };
  }

  try {
    await con.db(dbName).collection(trxLogCollNm).insertOne(arg);
  } catch (err) {
    console.log("Error occurred while inserting trx-log:", err.message);
    await client.close(); // For internal testing
    return { error: err.message };
  }

  // ---------------------------------------
  // end of function

  await client.close(); // For internal testing
  return { arg };
};

export { exportFn as execute };