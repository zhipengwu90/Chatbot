
import { OpenAIStream, OpenAIStreamPayload, ChatGPTMessage } from "../../utils/OpenAIStream";

// type MyObject = {
//   role: string;
//   message: string;
// };

// const myPrompt: MyObject[] = [

// ];

// const myPrompt: ChatGPTMessage[] = [
// message 
// ]


if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt, model } = (await req.json()) as {
    prompt?: ChatGPTMessage[];
    model?: string;
  };
console.log(prompt);
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: model || "gpt-3.5-turbo",
    messages: prompt,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
