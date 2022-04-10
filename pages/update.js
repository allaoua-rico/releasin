import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Product from "../models/product";
import ProductType from "../models/productType";

import dbConnect from "../backLib/dbConnect";

export default function UpdateType({ types1, id, prod1 }) {
  const prod = JSON.parse(prod1);
  const types = JSON.parse(types1);
  const [type, setType] = useState(prod.productType);
  const [name, setName] = useState(JSON.parse(prod1).name);
  const [atts, setAtts] = useState(JSON.parse(prod1).assignedAttributes);
  const [attributes, setattributes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/getType", { method: "GET" })
      .then((res) => res.json())
      .then((res) => setattributes(res));
  }, []);
  // useEffect(() => {
  //   console.log(attributes);
  // }, [attributes]);
  useEffect(() => {
    console.log(type);
    fetch(`/api/getTypeAttributes?id=${type}`, { method: "GET" })
      .then((res) => res.json())
      .then((res) => setattributes(res));
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    form.append("id", id);
    // for (let [key, value] of form.entries()) {
    //   console.log(key, value);
    // }
    fetch("/api/updateProduct", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        data.msg === "product updated" && router.push(`/`);
      });
  };

  return (
    <div  className={styles.main}>
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
            <label htmlFor="name">Name : </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              name="name"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="type">Product type</label>
            <select
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              name="type"
              id="type"
            >
              {types.map((type) => (
                <option
                  key={type._id}
                  value={type._id}
                  selected={type._id == prod.productType ? true : false}
                >
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="attributes">
              attributes: (you can choose multiple by pressing ctrl)
            </label>
            <div>
              <select
                value={atts.map((att) => att)}
                onChange={(e) => {
                  var options = e.target.options;
                  var value = [];
                  for (var i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                      value.push( options[i].value );
                    }
                  }
                  setAtts([...value]);
                }}
                required
                multiple
                name="attributes"
                id="attributes1"
              >
                {attributes.map((att) => (
                  <option key={att.name} value={att._id}>
                    {att.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export async function getServerSideProps({ query }) {
  await dbConnect();
  const prod = await Product.findOne({ _id: query.id })
    // .populate("productType")
    .lean();
  const types = await ProductType.find({})
    .populate({
      path: "attributes",
      populate: { path: "attributeValue" },
    })
    .lean();
  return {
    props: {
      prod1: JSON.stringify(prod),
      id: query.id,
      types1: JSON.stringify(types),
    },
  };
}
