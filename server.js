const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const getAttributes = require("./routes/getAttributes.js");
const getType = require("./routes/getType.js");
const getTypeAttributes = require("./routes/getTypeAttributes.js");
const getAssignedAttributes = require("./routes/getAssignedAttributes.js");
const productRouter = require("./routes/product.js");
const typeRouter = require("./routes/type.js");

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

    server.use("/api/product", productRouter);
    server.use("/api/type", typeRouter);

    server.use("/api/getAttributes", getAttributes);
    server.use("/api/getType", getType);
    server.use("/api/getTypeAttributes", getTypeAttributes);
    server.use("/api/getAssignedAttributes", getAssignedAttributes);

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
