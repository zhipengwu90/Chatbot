import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  type ConversationItem = {
    role: string;
    content: string;
  };

  const [generatedBios, setGeneratedBios] = useState<String>("");
  const [message, setMessage] = useState<String>("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState<Conversation>([]);
  const chatContentRef = useRef<null | HTMLDivElement>(null);

  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isValid, setIsValid] = useState(true);

  type Conversation = Array<ConversationItem>;
  useEffect(() => {
    // Scroll to the bottom of the chat content container
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [conversation]);

  const sendHandler = async () => {
    if (prompt === "") return;
    setMessage(prompt);
    setPrompt("");
    setConversation((prev: Conversation) => [
      ...prev,
      { role: "user", content: prompt },
    ]);
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
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

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
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

  return (
    <div className={styles.container}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
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
                <div className="userBox">
                  <div className="user">
                    <Image
                      alt="user"
                      src={`/images/user.svg`}
                      width="35"
                      height="30"
                    />
                  </div>
                  <div className="userText">{message}</div>
                </div>
                {generatedBios && (
                  <>
                    <div className="assistantBox">
                      <div className="assistant">
                        <Image
                          alt="assistant"
                          src={`/images/assistant.svg`}
                          width="35"
                          height="30"
                        />
                      </div>
                      <div className="assistantText">
                        {generatedBios
                          .substring(generatedBios.indexOf("1") + 3)
                          .split("2.")
                          .map((generatedBio) => {
                            return (
                              <div key={generatedBio}>
                                <p>{generatedBio}</p>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}
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

            <button className={styles.chatButton} onClick={sendHandler}>
              <Image
                width="25"
                height="25"
                src={`/images/submit.svg`}
                alt="search"
              />
            </button>
          </div>
        </>
      ) : (
        checkPassword()
      )}
    </div>
  );
};

export default Home;
