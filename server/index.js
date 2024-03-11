const express = require("express");
const path = require("path");
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

// app.get("/", (req, res) => {
//     res.send({ message: "Hello dear friend " });
// });
app.get("/v1/hajri", async (req, res) => {
    const dihari = await readFile("dihari");
    res.send({ dihari });
});
app.put("/v1/hajri", async (req, res) => {
    const { referCode, data } = req.body;
    const dihari = await updateFile("dihari", referCode, data);
    if (dihari) {
        return res.send({
            success: true,
            message: "Your data has been updated. "
        });
    } else
        return res.send({
            success: false,
            message: "Failed to update. "
        });
});
app.put("/v1/hajri-del", async (req, res) => {
    const { referCode } = req.body;
    const dihari = await deleteByRefer("dihari", referCode);
    if (dihari) {
        return res.send({
            success: true,
            message: "Your data has been deleted. "
        });
    } else
        return res.send({
            success: false,
            message: "Failed to delete. "
        });
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

const port = process.env.PORT || 5006;

//app.use("Images", express.static(path.resolve("./client/dist/Images")));
app.use(express.static(path.resolve("./client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

app.listen(port, () => {
    console.log("http://localhost:5006");
});
