// import { OpenAI } from "openai";

// export default async function handler(req, res) {
//   console.log(req.query.m);
//   if (!process.env.OPENAI_API_KEY) {
//     throw new Error("Missing env var from OpenAI");
//   }

//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   const response = await openai.images.generate({
//     model: req.query.m,
//     prompt: req.query.p,
//     n: parseInt(req.query.n),
//     size: "1024x1024",
//     quality: "standard",
//   });

//   res.status(200).json({ result: response.data });
// }

export const config = {
  runtime: "edge",
};

export default async function handler(req, res) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error("Missing env var from OpenAI");
  }

  const { model, prompt } = await req.json();

  // const model = req.query.m;
  // const prompt = req.query.p;

  // You'll need to replace this with the actual OpenAI API endpoint and logic
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    }),
  });

  const data = await response.json();
  // Sending the response with headers
  console.log(data.data[0].url);
  return new Response(data.data[0].url);
}
