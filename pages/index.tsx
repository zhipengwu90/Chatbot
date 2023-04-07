import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {


  const [generatedText, setGeneratedText] = useState<String>("");
  const [message, setMessage] = useState<String>("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isCopied, setIsCopied] = useState(false);

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
  const copyHandler = () => {
    if (resultRef.current === null) return;
    const range = document.createRange();
    range.selectNode(resultRef.current);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
    setIsCopied(true);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
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
                <div className={styles.userBox}>
                  <div className={styles.user}>
                    <Image
                      alt="user"
                      src={`/images/user.svg`}
                      width={35}
                      height={30}
                    />
                  </div>
                  <div className={styles.userText}>
                    {message.split("\n").map((line, index) => (
                      <>
                        {line}
                        <br />
                      </>
                    ))}
                  </div>
                </div>
                {generatedText && (
                  <>
                    <div className={styles.assistantBox}>
                      <div className={styles.assistant}>
                        <Image
                          alt="assistant"
                          src={`/images/assistant.svg`}
                          width={35}
                          height={30}
                        />
                      </div>
                      <div className={styles.assistantText}>
                        <button
                          className={styles.copyButton}
                          onClick={copyHandler}
                        >
                          {!isCopied ? (
                            <Image
                              alt="copy"
                              src={`/images/copy.svg`}
                              width={20}
                              height={20}
                              className={styles.copyIcon}
                            />
                          ) : (
                            <span>Copied!</span>
                          )}
                        </button>
                        <div ref={resultRef}>
                          {generatedText.split("\n").map((line, index) => (
                            <>
                              {line}
                              <br />
                            </>
                          ))}
                        </div>
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
                width={25}
                height={25}
                src={`/images/submit.svg`}
                alt="submit"
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
