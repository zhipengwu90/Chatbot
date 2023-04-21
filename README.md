## Chatbot

This web application is based on Twitter bios [Github Link](https://github.com/Nutlope/twitterbio) and utilizes the streaming function to create a chatbot. This web application allows the user to switch between the OpenAI models of GPT-3.5 Turbo and GPT-4


## How it works

This project uses the [ChatGPT API](https://openai.com/api/) and [Vercel Edge functions](https://vercel.com/features/edge-functions) with streaming. Users, with their own OpenAI API key, can use this web application as a personal ChatGPT and switch between models as needed, without having to pay for ChatGPT plus. (Note: In order to use the GPT-4 model, users need to sign up on the waiting list to gain access.)

## App interface

<div style="display: flex;">
  <img src="https://github.com/zhipengwu90/openai-stream/blob/main/gitImg/demo1.jpg" width="330">
  <img src="https://github.com/zhipengwu90/openai-stream/blob/main/gitImg/demo2.jpg" width="330">
</div>


## Running Locally

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a file called `.env`.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zhipengwu90/openai-stream&env=OPENAI_API_KEY&project-name=openai-stream&repo-name=openai-stream)
> Note: In order to deploy this project, you will need to obtain your own OpenAI API key. For more details, please check the  [OpenAI](https://platform.openai.com/) website.