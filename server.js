const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const addProductRouter = require("./routes/addProduct.js");
// const corsRouter = require("./routes/cors.js");
// const updateRouter = require("./routes/update.js");
const addProductType = require("./routes/addProductType.js");
const getAttributes = require("./routes/getAttributes.js");
const getType = require("./routes/getType.js");
const updateProductType = require("./routes/updateProductType.js");
const getTypeAttributes = require("./routes/getTypeAttributes.js");
const addProduct = require("./routes/addProduct.js");
const updateProduct = require("./routes/updateProduct.js");



const cors = require('cors')

const port = parseInt(process.env.PORT, 10) || 5000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

if (dev) {
  require("dotenv").config();
}

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoose"));

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json());
    server.use(cors())

    // server.use("/api/addProduct", addProductRouter);
    // server.use("/api/cors", corsRouter);
    // server.use("/api/update", updateRouter);
    server.use("/api/addProductType", addProductType);
    server.use("/api/addProduct", addProduct);

    server.use("/api/getAttributes", getAttributes);
    server.use("/api/getType", getType);
    server.use("/api/updateProductType", updateProductType);
    server.use("/api/updateProduct", updateProduct);
    server.use("/api/getTypeAttributes", getTypeAttributes);

    
    server.all("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
