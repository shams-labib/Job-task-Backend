const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://job-task:GbGq3qaIEpDGJYZb@cluster0.gs1mqwb.mongodb.net/newsPortal?retryWrites=true&w=majority";
mongoose.connect(uri).then(() => console.log("MongoDB Connected"));

const News = mongoose.model(
  "News",
  new mongoose.Schema({
    title: String,
    description: String,
    url: { type: String, unique: true },
    urlToImage: String,
    publishedAt: Date,
    sourceName: String,
    category: String,
    country: String,
  }),
);

app.get("/api/news", async (req, res) => {
  const { country, category } = req.query;

  try {
    const jsonData = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
    try {
      await News.insertMany(jsonData, { ordered: false });
    } catch (e) {}

    let query = {};
    if (country) query.country = country;
    if (category) query.category = category;

    const articles = await News.find(query).sort({ publishedAt: -1 });
    res.json({ status: "ok", articles });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

app.listen(5000, () => console.log("Server: http://localhost:5000"));
