import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Head from "next/head";
import dbConnect from "../backLib/dbConnect";
import ProductType from "../models/productType";

export default function AddProduct({ types1 }) {
  const [attributes, setattributes] = useState([]);
  const [type, setType] = useState(" ");

  const router = useRouter();
  const types = JSON.parse(types1);

  useEffect(() => {
    console.log(type);
    fetch(`/api/getTypeAttributes?id=${type}`, { method: "GET" })
      .then((res) => res.json())
      .then((res) => setattributes(res));
  }, [type]);
  useEffect(() => {
    console.log(attributes);
  }, [attributes]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    for (let [key, value] of form.entries()) {
      console.log(key, value);
    }
    fetch("/api/addProduct", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        data.msg === "Product Added successfully" && router.push(`/`);
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
          <label htmlFor="type">product type</label>
          <select
          required
            onChange={(e) => setType(e.target.value)}
            name="type"
            id="type"
          >
            <option disabled selected value>
              {" "}
              -- select an option --{" "}
            </option>
            {types.map((type) => (
              <option key={type.name} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="attributes">
            attributes, you can choose multiple
          </label>
          <select required multiple name="attributes" id="attributes">
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
export async function getServerSideProps() {
  await dbConnect();
  const types = await ProductType.find({})
    .populate({
      path: "attributes",
      populate: { path: "attributeValue" },
    })
    .lean();

  return { props: { types1: JSON.stringify(types) } };
}
