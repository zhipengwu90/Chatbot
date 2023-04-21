import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import User from "./components/User";
import Assistant from "./components/Assistant";

const Home: NextPage = () => {
  const [generatedText, setGeneratedText] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isSetting, setIsSetting] = useState(false);
  const [gptModel, setGptModel] = useState("gpt-3.5-turbo");

  interface Message {
    user: typeof message;
    assistant: typeof generatedText;
  }
  const [conversation, setConversation] = useState<Message[]>([]);

  const chatContentRef = useRef<null | HTMLDivElement>(null);

  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isValid, setIsValid] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat content container
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [generatedText, message]);

  const sendHandler = async () => {
    if (prompt === "") return;

    // Add the message to the conversation
    if (message !== "" || generatedText !== "") {
      setConversation((prev) => [
        ...prev,
        {
          user: message,
          assistant: generatedText,
        },
      ]);
    }

    setMessage(prompt);
    setPrompt("");
    setGeneratedText("");
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: gptModel,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }
    // Read the data from the ReadableStream, data.getReader() is a ReadableStreamDefaultReader
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      //reader.read() returns a promise with an object containing the value and a done boolean { value: theChunk, done: false }.
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      
      const chunkValue = decoder.decode(value);
      setGeneratedText((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  const checkPassword = () => {
    const passwordHandler = () => {
      if (passwordRef.current === null) return;
      if (passwordRef.current?.value === "0708") {
        setIsValid(true);
      } else {
        alert("Incorrect password");
      }
    };
    return (
      <div className={styles.passwordWrapper}>
        <input
          className={styles.passwordInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              passwordHandler();
            }
          }}
          ref={passwordRef}
          type="password"
          placeholder="Enter password"
        />
        <button className={styles.passButton} onClick={passwordHandler}>
          Submit
        </button>
      </div>
    );
  };

  const settingHander = () => {
    setIsSetting((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {isSetting && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setIsSetting(false)}
          />

          <div className={styles.settingWrapper}>
            <div className={styles.radios}>
              <input
                type="radio"
                name="model"
                value="gpt-3.5-turbo"
                checked={gptModel === "gpt-3.5-turbo"}
                onChange={(e) => setGptModel(e.target.value)}
              />
              <label htmlFor="gpt-3.5-turbo">GPT-3.5-Turbo</label>
            </div>
            <div className={styles.radios}>
              <input
                type="radio"
                name="model"
                value="gpt-4"
                checked={gptModel === "gpt-4"}
                onChange={(e) => setGptModel(e.target.value)}
              />
              <label htmlFor="gpt-4">GPT-4</label>
            </div>
            <div className={styles.warning}>
              <span>Warning:</span> Only use GPT-3.5-Turbo here, because GPT-4
              is too expensive.
            </div>
            <div className={styles.confirmButtonBox}>
              <button className={styles.confirmButton} onClick={settingHander}>
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {isValid ? (
        <>
          <div ref={chatContentRef} className={styles.chatContent}>
            {!message ? (
              <div className={styles.startBox}>
                <h1 className={styles.title}>ChatBot</h1>
                <p>
                  Ask me something, I will enlighten your mind with knowledge.
                </p>
              </div>
            ) : (
              <>
                {conversation &&
                  conversation.map((item, index) => (
                    <>
                      {item.user && (
                        <User message={item.user} key={index + "user"} />
                      )}
                      {item.assistant && (
                        <Assistant
                          generatedText={item.assistant}
                          key={index + "assistant"}
                        />
                      )}
                    </>
                  ))}

                <User message={message} />
                {generatedText && <Assistant generatedText={generatedText} />}
              </>
            )}

            {loading && (
              <div className={styles.loading}>
                <div className={styles.loader}></div>
                <div>Loading...</div>
              </div>
            )}
          </div>
          <div className={styles.inputButtonBox}>
            <textarea
              disabled={loading}
              className={styles.chatInput}
              rows={4}
              placeholder="Type your message here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendHandler();
                }
              }}
            />
            <div className={styles.buttonBox}>
              <button className={styles.chatButton} onClick={settingHander}>
                <Image
                  width={25}
                  height={25}
                  src={`/images/setting.svg`}
                  alt="setting"
                />
              </button>

              <button className={styles.chatButton} onClick={sendHandler}>
                <Image
                  width={25}
                  height={25}
                  src={`/images/submit.svg`}
                  alt="submit"
                />
              </button>
            </div>
          </div>
        </>
      ) : (
        checkPassword()
      )}
    </div>
  );
};

export default Home;
