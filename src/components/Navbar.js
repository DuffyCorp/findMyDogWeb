import React from "react";
import styles from "../styles/Dog.module.scss";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className={styles.navContainer}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Picture of app logo"
          width={40}
          height={40}
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link href="/">
        <h1 style={{ cursor: "pointer" }}>Find My Dog</h1>
      </Link>
    </div>
  );
};

export default Navbar;
