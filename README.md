## Chatbot

This project forks from Twitter bios [Github Link](https://github.com/Nutlope/twitterbio)



## How it works

This project uses the [ChatGPT API](https://openai.com/api/) and [Vercel Edge functions](https://vercel.com/features/edge-functions) with streaming. It constructs a prompt based on the form and user input, sends it to the chatGPT API via a Vercel Edge function, then streams the response back to the application.


<div style="display: flex;">
  <img src="https://github.com/zhipengwu90/openai-stream/blob/main/gitImg/demo1.jpg" width="300">
  <img src="https://github.com/zhipengwu90/openai-stream/blob/main/gitImg/demo2.jpg" width="300">

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
