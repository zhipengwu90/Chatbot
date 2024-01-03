import type { NextPage } from "next";
import { useState, useRef } from "react";

import styles from "../styles/Image.module.css";

import axios from "axios";

const Image: NextPage = () => {
  const [token, setToken] = useState("");
  const [prompt, setPrompt] = useState("");
  const [number, setNumber] = useState(1);
  const [model, setModel] = useState("dall-e-2");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isValid, setIsValid] = useState(false);

  type ResultType = {
    url?: string;
    // other properties
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

  function getImages() {
    if (prompt != "") {
      setError(false);
      setLoading(true);
      axios
        .post(`/api/images?p=${prompt}&n=${number}&m=${model}`)
        .then((res) => {
          setResults(res.data.result);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else {
      setError(true);
    }
  }

  const [type, setType] = useState("webp");

  function download(url: string) {
    axios
      .post(`/api/download`, { url: url, type: type })
      .then((res) => {
        const link = document.createElement("a");
        link.href = res.data.result;
        link.download = `${prompt}.${type.toLowerCase()}`;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }



  return (
    <>
      {isValid ? (
        <div className={styles.container}>
          <title>Create Images With DALL-E App</title>

          <main className={styles.main}>
            <h1 className={styles.title}>
              Create images with 
              <span className={styles.titleColor}> DALL-E</span>
            </h1>
            <p className={styles.description}>
              {/* <input
              className={styles.input}
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Bearer Token (sk-...)"
            /> */}

              <select
                className={styles.select}
                defaultValue={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="dall-e-2">DALL-E-2</option>
                <option value="dall-e-3">DALL-E-3</option>
              </select>
              <input
                className={styles.input}
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Prompt"
              />
              <input
                className={styles.input}
                id="number"
                type="number"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                placeholder="Number of images"
                max="10"
              />

              <button className={styles.button} onClick={getImages}>
                Get {number} Images
              </button>
            </p>
            <small>
              Download as:{" "}
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="webp">Webp</option>
                <option value="png">Png</option>
                <option value="jpg">Jpg</option>
                <option value="gif">Gif</option>
                <option value="avif">Avif</option>
              </select>{" "}
              Click the image below and save.
            </small>
            <br />
            {error ? (
              <div className={styles.error}>
                Something went wrong. Try again.
              </div>
            ) : (
              <></>
            )}
            {loading && <p>Loading...</p>}
            <div className={styles.grid}>
              {results.map((result: ResultType)  => {
                return (
                  <div className={styles.card}>
                    <img
                      className={styles.imgPreview}
                    src={result?.url}
                    onClick={() => download(result?.url ?? '')}
                    />
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      ) : (
        checkPassword()
      )}
    </>
  );
};

export default Image;
