import OpenAI from "openai";
import 'dotenv/config';

const promptFn = async (knowledge, question) => {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_TOKEN,
    });

    const completion = await client.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that answers questions based on the provided documentation."
            },
            {
                role: "user",
                content: `
                My profile: ${knowledge}.

                Question: ${question}.

                Please answer the question in maximum one paragraph using information from my profile. If the answer isn't in my profile, say so politely.
                `,
            },
        ],
    });

    const response = completion.choices[0].message.content;
    return response;
}

export { promptFn as prompt };