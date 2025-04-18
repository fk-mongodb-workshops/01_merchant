import { execute } from "./fn_linkaja_customer_refuels.js";

const main = async () => {

  const obj = {
    "operationType": "insert",
    "clusterTime": {
      "$timestamp": {
        "t": 1744891099,
        "i": 1
      }
    },
    "wallTime": {
      "$date": "2025-04-17T11:58:19.581Z"
    },
    "fullDocument": {
      "_id": {
        "$oid": "6800ecd7b26e934cc2f2c045"
      },
      "amount": 99000,
      "litres": 20,
      "spbu": "111000",
      "date": "2025-02-15 10:10",
      "product": "RON92",
      "user_id": "0001",
      "user_name": "John Hoptin"
    },
    "ns": {
      "db": "linkaja",
      "coll": "customer_refuels"
    },
    "documentKey": {
      "_id": {
        "$oid": "6800ecd7b26e934cc2f2c045"
      }
    }
  }

  const res = await execute(obj);
  console.log(res);
}

(async function () {
  await main();
})();