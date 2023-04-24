import Head from "next/head";
import styles from "@component/styles/Home.module.css";
import { FcGoogle } from "react-icons/fc";
import { GiNotebook } from "react-icons/gi";
import axios from "axios";
import { redirect } from "next/navigation";

export default function Home() {
  const handleAuth = async () => {
    try {
      await axios.get("http://localhost:8000/google");
    } catch (err) {
      console.log(err);
      //redirect("/");
    }
  };
  return (
    <>
      <Head>
        <title>Home Cook Recipe Book</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>
          Home Cook Recipe Book <GiNotebook />
        </h1>
        <div className={styles["register-login"]}>
          <a
            className={styles["google-link"]}
            href="http://localhost:8000/google"
          >
            <button className={styles["register-button"]}>
              <div>
                <FcGoogle />
              </div>
              Sign Up with Google
            </button>
          </a>
          {/* <span className={styles.query}>Already have an account?</span>
          <button className={styles["login-button"]}>
            <FcGoogle />
            Log in with Google
          </button> */}
        </div>
      </main>
    </>
  );
}
