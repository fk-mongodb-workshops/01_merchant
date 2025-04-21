import { customerToStory } from "../util/util_translator.js";
import { embed } from "../util/util_embedder.js";
import { promptBook } from "../util/util_prompter.js";
import { MongoClient } from "mongodb";
import 'dotenv/config';

const main = async () => {

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0pftinh.mongodb.net/`;
  const client = new MongoClient(uri);
  await client.connect();

  const whatToSearch = `Story about murder of schoolboys`;
  const whatToSearchEmbObj = await embed(whatToSearch);
  const whatToSearchEmb = whatToSearchEmbObj.data[0].embedding;

  const coll = client.db("bookshop").collection("books");
  const books = await coll.aggregate(
    [
      {
        $vectorSearch: {
          index: 'synopsis_vector_index',
          path: 'synopsisEmb',
          queryVector: whatToSearchEmb,
          numCandidates: 20,
          limit: 3,
        }
      },
      { $project: { title: 1, author: 1 } }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  ).toArray()


  console.log(books);
  await client.close();
}

(async function () {
  await main();
})();