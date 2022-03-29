import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import dbConnect from "../backLib/dbConnect";
import ProductType from "../models/productType";
import Link from "next/link";
import Product from "../models/product";
require("../models/assignedAttribute");

export default function Home({ types1, prods1 }) {
  const types = JSON.parse(types1);
  const prods = JSON.parse(prods1);

  useEffect(() => {
    fetch("/", { method: "GET" })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }, []);
  // console.log(prods);

  return (
    <div className={styles.container}>
      <Head>
        <title>releasin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <h2 className={styles.title}>List of types</h2>
          <button>
            <Link passHref href={`/addProductType`}>
              <a
                href="
                "
              >
                add a type
              </a>
            </Link>
          </button>
          {types.map((type) => (
            <div
              className={styles.card}
              key={type._id}
              style={{ margin: "15px" }}
            >
              <div>_id : {type._id}</div>
              <div>name : {type.name}</div>
              <div>created_at : {type.created_at}</div>
              <div>
                attributes :
                <ul>
                  {type.attributes.map((att, index) => (
                    <li key={"attribute" + index}>
                      {index}
                      <ul>
                        type : {att.type}
                        <li>
                          attributeValue :
                          {att?.type?.map((type, index) => {
                            return type == "boolean" ? (
                              <span key={"type" + index}>
                                {" "}
                                {att?.attributeValue?.boolean?.toString()}
                              </span>
                            ) : (
                              <div key={"type2" + index}>
                                {att?.attributeValue?.date}
                              </div>
                            );
                          })}
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
              <button>
                <Link passHref href={`/updateType?id=${type._id}`}>
                  <a
                    href="
                "
                  >
                    update type
                  </a>
                </Link>
              </button>
            </div>
          ))}
        </div>
        <div>
          <h2 className={styles.title}>List of products</h2>
          <button>
            <Link passHref href={`/addProduct`}>
              <a>add a product</a>
            </Link>
          </button>
          {prods.map((prod) => (
            <div
              className={styles.card}
              key={prod._id}
              style={{ margin: "15px" }}
            >
              <div>_id : {prod._id}</div>
              <div>name : {prod.name}</div>
              <div>created_at : {prod.created_at}</div>
              <div>
                Assigned attributes :
                {prod.assignedAttributes.map((att, index) => (
                  <li key={att}>
                    _id : {att}
                    {/* <ul>
                      name :{" "}
                      {att.attributeValue.name?.map((name) => (
                        <div key={name}>{name}</div>
                      ))}
                      {att.attributeValue.boolean && (
                        <div>
                          boolean: {att.attributeValue.boolean.toString()}
                        </div>
                      )}
                    </ul> */}
                  </li>
                ))}
              </div>
              <button>
                <Link passHref href={`/update?id=${prod._id}`}>
                  <a>update product</a>
                </Link>
              </button>
            </div>
          ))}
        </div>
        <div>
          <h2 className={styles.title}>suggestions</h2>
          The model AssignedAttribute should have the same property type like
          Attibute, or we should just use Attribute instead.
        </div>
      </main>
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
  const prods = await Product.find({})
    // .populate({
    //   path: "assignedAttributes",
    //   populate: { path: "attributeValue" },
    // })
    .lean();
  return {
    props: { types1: JSON.stringify(types), prods1: JSON.stringify(prods) },
  };
}
