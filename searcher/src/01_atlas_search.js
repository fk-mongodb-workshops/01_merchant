import { MongoClient } from "mongodb";
import 'dotenv/config';

const main = async () => {

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();

  const whatToSearch = `Fernando`;

  const coll = client.db("linkaja").collection("customers");
  const stories = await coll.aggregate(
    [
      {
        $search: {
          index: "linkaja_customers",
          phrase: {
            path: "my_story",
            query: whatToSearch,
          },
        },
      },
      { "$limit": 3 },
      { $project: { _id: 0, my_story_embedding: 0 } }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  ).toArray()

  console.log(stories);
  await client.close();

  // Few other examples on codesandbox
  // Text: https://search-playground.mongodb.com/tools/code-sandbox/snapshots/6806d7a67751d6bf7b867542
  // Phrase: https://search-playground.mongodb.com/tools/code-sandbox/snapshots/6806d8287751d6bf7b867544
  // Equals: https://search-playground.mongodb.com/tools/code-sandbox/snapshots/6805a2903fd6643a88099cda
  // Near: https://search-playground.mongodb.com/tools/code-sandbox/snapshots/6805a44b7751d6bf7b867513
  // Range: https://search-playground.mongodb.com/tools/code-sandbox/snapshots/6805a4bc3fd6643a88099cdc
  // Morelikethis: https://search-playground.mongodb.com/tools/code-sandbox/snapshots/6806d8c43fd6643a88099d57
}

(async function () {
  await main();
})();