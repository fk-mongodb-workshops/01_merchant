import moment from "moment";
import { VoyageAIClient } from "voyageai";
import 'dotenv/config';

const embedFn = async txt => {
    const client = new VoyageAIClient({ apiKey: process.env.VOYAGEAI_TOKEN });
    const response = await client.embed({
        input: [txt],
        model: "voyage-3-lite",
    });
    return response;
}


const rerankFn = async (query, documents) => {
    const client = new VoyageAIClient({ apiKey: process.env.VOYAGEAI_TOKEN });
    const response = await client.rerank({
        query,
        documents,
        model: "rerank-2-lite",
        topK: 3
    });
    return response;
}

export { embedFn as embed, rerankFn as rerank };