import { OpenAI } from "openai";

export default async function handler(req, res) {
  console.log(req.query.m);
  if (!process.env.DALL_E_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }

  const openai = new OpenAI({
    apiKey: process.env.DALL_E_API_KEY,
  });

  const response = await openai.images.generate({
    model: req.query.m,
    prompt: req.query.p,
    n: parseInt(req.query.n),
    size: "1024x1024",
    quality: "standard",
  });
  console.log(response.data);
  res.status(200).json({ result: response.data });
}