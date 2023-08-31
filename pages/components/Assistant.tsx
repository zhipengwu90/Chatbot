import styles from "../../styles/Assistant.module.css";
import Image from "next/image";
import React, { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown'
interface UserProps {
  generatedText: string;
}
const Assistant: React.FC<UserProps> = (props: UserProps) => {
  const [isCopied, setIsCopied] = useState(false);
    const resultRef = useRef<HTMLDivElement | null>(null);

  const copyHandler = () => {
    if (resultRef.current === null) return;
    const range = document.createRange();
    range.selectNode(resultRef.current);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  return (
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
          <button className={styles.copyButton} onClick={copyHandler}>
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
          <div className={styles.code} ref={resultRef}>
            {/* {props.generatedText.split("\n").map((line, index) => (
              <>
                {line}
                <br />
              </>
            ))} */}
            <ReactMarkdown>{props.generatedText}</ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
};
export default Assistant;
