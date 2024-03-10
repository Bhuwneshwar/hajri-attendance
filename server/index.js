const express = require("express");
//const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const {
    insertData,
    readFile,
    deleteByRefer,
    updateFile
} = require("./config/connnectDb");
require("dotenv").config();

const app = express();

app.use(express.json());
//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send({ message: "Hello dear friend " });
});
app.get("/v1/hajri", async (req, res) => {
    const dihari = await readFile("dihari");
    res.send({ dihari });
});
app.put("/v1/hajri", async (req, res) => {
    const { referCode } = req.body;
    const dihari = await updateFile("dihari", referCode, req.body);
    res.send({ dihari });
});
app.delete("/v1/hajri", async (req, res) => {
    const { referCode } = req.body;
    const dihari = await deleteByRefer("dihari", referCode);
    res.send({ dihari });
});
app.post("/v1/add-hajri", (req, res) => {
    const { date, rate, due, paid, builder, location } = req.body;
    if (date === "") return res.send({ error: "Date is Empty! " });
    if (rate === "") return res.send({ error: "rate is Empty! " });
    if (paid === "") return res.send({ error: "paid is Empty! " });
    if (builder === "") return res.send({ error: "builder is Empty! " });
    if (location === "") return res.send({ error: "location is Empty! " });

    insertData("dihari", req.body);
    res.status(201).send({ message: "Data Inserted. " });
});

app.listen(5006, () => {
    console.log("http://localhost:5006");
});
