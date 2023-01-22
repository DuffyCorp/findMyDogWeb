import styles from "../../styles/Dog.module.scss";
import { app, database } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function DisplayData() {
  const [postsArray, setPostsArray] = useState([]);
  const [currentDog, setCurrentDog] = useState();
  const dbInstance = collection(database, "posts");

  const getNotes = () => {
    getDocs(dbInstance).then((data) => {
      setPostsArray(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  const getSinglePost = (ID) => {
    if (ID) {
      const singleNote = doc(database, "posts", ID);
      getDoc(singleNote).then((data) => {
        setCurrentDog({ ...data.data(), id: data.id });
      });
    }
  };

  useEffect(() => {
    getNotes();
    getSinglePost("34e9fbc0-9901-11ed-b6a7-6d2b8c792282");
  }, []);

  return (
    <>
      <div className={styles.mainContent}>
        {postsArray.map((post, index) => {
          return (
            <div key={index}>
              <h3>{post.dogBreed}</h3>
            </div>
          );
        })}
        {currentDog && (
          <div>
            <h1>Current dog</h1>
            <div>
              <h2>{currentDog.dogBreed}</h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
