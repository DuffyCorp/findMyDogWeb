import { database } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import React, { useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Dog.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

export default function Post({ content }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  //console.log(content);

  var button;

  if (content.dogStatus === "Lost") {
    button = (
      <div className={styles.dogHeaderLost}>
        <p>
          {content.dogStatus} {content.dogBreed}
        </p>
      </div>
    );
  } else if (content.dogStatus === "Stolen") {
    button = (
      <div className={styles.dogHeaderStolen}>
        <p>
          {content.dogStatus} {content.dogBreed}
        </p>
      </div>
    );
  } else {
    button = (
      <div className={styles.dogHeaderFound}>
        <p>
          {content.dogStatus} {content.dogBreed}
        </p>
      </div>
    );
  }
  const mapContainer = useRef();
  const map = useRef();

  const markers = [
    {
      status: content.dogStatus,
      breed: content.dogBreed,
      latCoord: content.dogLocation.geopoint.latitude,
      longCoord: content.dogLocation.geopoint.longitude,
    },
  ];

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? "";
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [
        content.dogLocation.geopoint.longitude,
        content.dogLocation.geopoint.latitude,
      ],
      zoom: 15,
    });

    var color;

    if (content.dogStatus == "Lost") {
      color = "red";
    } else if (content.dogStatus == "Stolen") {
      color = "#FFBF00";
    } else {
      color = "green";
    }
    map.current.on("load", () => {
      const marker1 = new mapboxgl.Marker({ color: color })
        .setLngLat([
          content.dogLocation.geopoint.longitude,
          content.dogLocation.geopoint.latitude,
        ])
        .setPopup(
          // add pop out to map
          new mapboxgl.Popup({ offset: 25, color: "black" }).setHTML(
            `<h3>${content.dogStatus} ${content.dogBreed}</h3><br><p>What 3 words: <a href="${content.what3wordsLink}" target="_blank">${content.what3words}</a></p>`
          )
        )
        .addTo(map.current);
    });
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  //console.log(content)
  var date = new Date(content.datePublished);

 var title = `${content.dogStatus} ${content.dogBreed}`;
  return (
    <main className={styles.contentContainer}>
      <Head>
        <script src="https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js" />
        <title>{title}</title>
      </Head>
      <div className={styles.Left}>
        {button}
        <div style={{ position: "relative", width: "80%" }}>
          <Image
            src={content.postUrl}
            alt="Picture of the dog"
            width="0"
            height="0"
            sizes="100vw"
            className={styles.dogImg}
          />
        </div>
        <div className={styles.detailContainer}>
          <h2>
            {content.address} - {monthNames[date.getMonth()]} {date.getDate()}{" "}
            {date.getFullYear()}
          </h2>
          <div className={styles.userContainer}>
            <div className={styles.userPic}>
              <Image
                src={content.profImage}
                alt="Profile"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: "5rem", height: "auto", borderRadius: "50%" }}
              />
              <p>{content.username}</p>
            </div>
          </div>
          <div className={styles.dogText}>
            <h2>Dog details</h2>
            <p>Dog Color: {content.dogColor}</p>
            <p>Description: {content.description}</p>

            <p>
              What 3 words:{" "}
              <a href={content.what3wordsLink} target="_blank">
                {content.what3words}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.Right}>
        <div className={styles.mapContainer} ref={mapContainer} />
      </div>
    </main>
  );
}

export const getStaticPaths = async () => {
  const dbInstance = collection(database, "posts");
  const array = [];
  await getDocs(dbInstance).then((data) => {
    data.docs.map((item) => {
      const dog = { ...item.data() };
      const slug = dog.postId;
      array.push({ params: { slug } });
    });
  });

  const paths = array;
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const singleDog = doc(database, "posts", params.slug);

  var post;
  var final;
  await getDoc(singleDog).then((data) => {
    post = JSON.stringify({ ...data.data() });
    final = JSON.parse(post);
    final.datePublished = data.data().datePublished.toDate();

    final = JSON.stringify(final);

    final = JSON.parse(final);

  });

  return {
    props: {
      content: final,
    },
  };
};
