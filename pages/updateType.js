import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import ProductType from "../models/productType";
import dbConnect from "../backLib/dbConnect";

export default function UpdateType({ type1, id }) {
  //   const [type, setType] = useState(JSON.parse(type1));
  const [name, setName] = useState(JSON.parse(type1).name);
  const [typeAtts, setTypeAtts] = useState(JSON.parse(type1).attributes);
  const [allattributes, setAllattributes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/getType", { method: "GET" })
      .then((res) => res.json())
      .then((res) => setAllattributes(res));
  }, []);
  useEffect(() => {
    console.log(typeAtts);
  }, [name, typeAtts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    for (let [key, value] of form.entries()) {
      console.log(key, value);
    }
    form.append("id", id);
    fetch("/api/type", {
      method: "PUT",
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        data.msg === "product updated" && router.push(`/`);
      });
  };

  return (
    <div className={styles.main}>
      <a href="/">{"<--Home"}</a>
      <div
        className={styles.card}
        style={{
          display: "flex",
          justifyContent: "center",
          itemsCenter: "center",
          margin: "auto",
        }}
      >
        <form id="form" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="name">name : </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              name="name"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="attributes">
              attributes: (you can choose multiple by pressing ctrl)
            </label>
            <div>
              <select
                value={typeAtts.map((att) => att._id)}
                onChange={(e) => {
                  var options = e.target.options;
                  var value = [];
                  for (var i = 0, l = options.length; i < l; i++) {
                    console.log(options[i].value )
                    if (options[i].selected) {
                      value.push({ _id: options[i].value });
                    }
                  }
                  setTypeAtts([...value]);
                }}
                required
                multiple
                name="attributes"
                id="attributes1"
              >
                {allattributes.map((att) => (
                  <option key={att.name} value={att._id}>
                    {att.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button type="submit">update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export async function getServerSideProps({ query }) {
  await dbConnect();
  const type = await ProductType.findOne({ _id: query.id })
    .populate({
      path: "attributes",
      populate: { path: "attributeValue" },
    })
    .lean();

  return { props: { type1: JSON.stringify(type), id: query.id } };
}
