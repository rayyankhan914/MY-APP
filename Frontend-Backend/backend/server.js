import express from "express";

const app = express();

console.log("Server file loaded!");

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.get("/api/jokes", (req, res) => {
  console.log("API route hit!");

  res.json([
    {
      id: 1,
      title: "A joke",
      content: "This is a joke",
    },
    {
      id: 2,
      title: "Another joke",
      content: "This is another joke",
    },
  ]);
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});