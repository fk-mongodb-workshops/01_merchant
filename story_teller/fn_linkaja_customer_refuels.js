import moment from "moment";
import { VoyageAIClient } from "voyageai";
import 'dotenv/config';

exports = async function(arg){ 
    var serviceName = "atlas-prd";
   
    console.log(arg)
    // var dbName = "linkaja";
    // var collName = "customer_transaction_history";
  
    // var collection = context.services.get(serviceName).db(dbName).collection(collName);
  
    // var findResult;
    // try {
    //   await collection.insertOne(arg);
  
    // } catch(err) {
    //   console.log("Error occurred while executing insertOne:", err.message);
  
    //   return { error: err.message };
    // }
  
    return { result: findResult };
  };