import { embed, rerank } from "../util/util_embedder.js";
import { MongoClient } from "mongodb";
import 'dotenv/config';

const main = async () => {

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();

  const whatToSearch = `Product RON90 and customer Fernando Karnagi`;
  const whatToSearchEmbObj = await embed(whatToSearch);
  const whatToSearchEmb = whatToSearchEmbObj.data[0].embedding;

  const coll = client.db("linkaja").collection("customers");
  const customers = await coll.aggregate(
    [
      {
        $vectorSearch: {
          index: 'linkaja_customers_mystory_vector',
          path: 'my_story_embedding',
          queryVector: whatToSearchEmb,
          numCandidates: 20,
          limit: 3,
        }
      },
      { $project: { _id: 0, my_story: 1 } }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  ).toArray()

  const storiesToReranked = customers.map(e => e.my_story)

  console.log(storiesToReranked)

  const rerankedCustomers = await rerank(whatToSearch, storiesToReranked);

  console.log(`Search for - ${whatToSearch}`)
  console.log(`------------------------------`)
  console.log(customers);

  console.log(`==============================`)
  console.log("");
  console.log(`Reranked`)
  console.log(`------------------------------`)
  console.log(rerankedCustomers);

  await client.close();
}

(async function () {
  await main();
})();