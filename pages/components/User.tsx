import styles from "../../styles/User.module.css";
import Image from "next/image";
import React from "react";
import ReactMarkdown from 'react-markdown'
import Markdown from 'react-markdown'

interface UserProps {
  message: string;
}
const User: React.FC<UserProps> = (props: UserProps) => {
  return (
    <div className={styles.userBox}>
      <div className={styles.user}>
        <Image alt="user" src={`/images/user.svg`} width={35} height={30} />
      </div>
      <div className={styles.userText}>
        {/* {props.message.split("\n").map((line, index) => (
          <>
            {line}
            <br />
          </>
        ))} */}
        {/* <ReactMarkdown>{props.message}</ReactMarkdown> */}
        <Markdown>{props.message}</Markdown>
      </div>
    </div>
  );
};
export default User;
