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

export { embedFn as embed };