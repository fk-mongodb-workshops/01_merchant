import { customerToStory } from "../util/util_translator.js";
import { embed } from "../util/util_embedder.js";
import { prompt } from "../util/util_prompter.js";

const main = async () => {

  const obj = {
    "to_date": {
      "total_spent": 2000000,
      "total_litres": 200,
      "average_spent": 100000,
      "average_litres": 25,
      "most_spbu": "111000",
      "most_product": "RON92"
    },
    "last_refuel": {
      "spbu": "111000",
      "date": "2025-04-15 10:10",
      "amount": 99000,
      "product": "RON92",
      "litres": 20
    },
    "profile": {
      "userid": "0001",
      "name": "Harta Susila Indrajaya"
    },
    "refuels": [
      {
        "amount": 99000,
        "litres": 20,
        "spbu": "111000",
        "date": "2025-04-15 10:10",
        "product": "RON92"
      },
      {
        "amount": 98000,
        "litres": 25,
        "spbu": "111000",
        "date": "2025-04-06 11:10",
        "product": "RON92"
      },
      {
        "amount": 97000,
        "litres": 22,
        "spbu": "111000",
        "date": "2025-04-01 08:10",
        "product": "RON92"
      },
      {
        "amount": 101100,
        "litres": 28,
        "spbu": "111000",
        "date": "2025-03-25 21:15",
        "product": "RON94"
      }
    ]
  }
  
  const story = customerToStory(obj);
  console.log("Quick story about me: ", story);
  // const emb = await embed(story);
  // console.log(emb.data[0].embedding)

  console.log("");
  console.log("====================");
  console.log("");

  const q1 = "How often do I refuel?";
  const q2 = "How much am i spending per week, what is the rate of increase";
  const q3 = "What fuel product am i spending on the most";
  const q4 = "How much do I save if I choose RON92 vs RON94";
  const q5 = "How long did I take to pump my petrol?";
  const answer = await prompt(story, q5);
  console.log(answer)
  console.log("");
}

(async function () {
  await main();
})();