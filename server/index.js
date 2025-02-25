const express = require("express");
const path = require("path");
//const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Hajri = require("./models/Hajri");
const { connectDatabase } = require("./config/connectDb");
//const {insertData,readFile, deleteByRefer,updateFile} = require("./config/File-json-database");
require("dotenv").config();

const app = express();

app.use(express.json());
//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/v1/hajri", async (req, res) => {
  const { userid } = req.query;

  const dihari = await Hajri.find({ userId: userid });
  res.send({ dihari });
});

app.put("/v1/hajri", async (req, res) => {
  const {
    _id,
    data: { date, rate, paid, due, builder, location, contact, userId },
  } = req.body;
  console.log({ _id });

  const dihari = await Hajri.findByIdAndUpdate(
    _id,
    {
      date,
      rate,
      paid,
      due,
      builder,
      location,
      contact,
      userId,
    },
    { new: true }
  );
  console.log({ dihari });
  if (dihari) {
    return res.send({
      success: true,
      message: "Your data has been updated. ",
    });
  } else
    return res.send({
      success: false,
      message: "Failed to update. ",
    });
});
app.put("/v1/hajri-del", async (req, res) => {
  const { _id } = req.body;
  const dihari = await Hajri.findByIdAndDelete(_id);
  if (dihari) {
    return res.send({
      success: true,
      message: "Your data has been deleted. ",
    });
  } else
    return res.send({
      success: false,
      message: "Failed to delete. ",
    });
});
app.post("/v1/add-hajri", async (req, res) => {
  try {
    const { date, rate, due, paid, builder, location, userId, contact } =
      req.body;
    if (date === "") return res.send({ error: "Date is Empty! " });
    if (rate === "") return res.send({ error: "rate is Empty! " });
    if (paid === "") return res.send({ error: "paid is Empty! " });
    if (builder === "") return res.send({ error: "builder is Empty!" });
    if (location === "") return res.send({ error: "location is Empty!" });
    if (userId === "") return res.send({ error: "userId is Empty!" });
    if (contact === "") return res.send({ error: "contact is Empty!" });

    const work = await Hajri.findOne({
      date,
      userId,
    });

    if (work) return res.send({ error: "At this date work already present!" });

    const create = new Hajri({
      date,
      rate,
      paid,
      due,
      builder,
      location,
      contact,
      userId,
    });

    const data = await create.save();
    console.log({ data });
    res.status(201).send({ message: "Data Inserted. ", data });
  } catch (e) {
    console.log(e);
  }
});

const port = process.env.PORT || 5006;

//app.use("Images", express.static(path.resolve("./client/dist/Images")));
app.use(express.static(path.resolve("./client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

app.listen(port, () => {
  connectDatabase();
  console.log("http://localhost:5006");
});
