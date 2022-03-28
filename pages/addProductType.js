import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import { useRouter } from "next/router";

import Head from "next/head";
export default function AddProduct({}) {
  const [attributes, setattributes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/getAttributes", { method: "GET" })
      .then((res) => res.json())
      .then((res) => setattributes(res));
  }, []);
  // useEffect(() => {
  //   console.log(attributes);
  // }, [attributes]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    for (let [key, value] of form.entries()) {
      console.log(key, value);
    }
    fetch("/api/addProductType", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        data.msg === "type Added successfully" && router.push(`/`);
      });
  };

  return (
    <div className={styles.main}>
      <form className={styles.card} id="form" onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="name">name</label>
          <input required name="name" type="text" />
        </div>
        <div>
          <label htmlFor="attributes">
            attributes, you can choose multiple
          </label>
          <select required multiple name="attributes" id="attributes1">
            {attributes.map((att) => (
              <option key={att.name} value={att.name}>
                {att.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">submit</button>
        </div>
      </form>
    </div>
  );
}
