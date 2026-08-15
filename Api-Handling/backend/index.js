import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get("/api/products", (req, res) => {
  const products = [
    {
      id: 1,
      name: "wood",
      price: 10.99,
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
    },
    {
      id: 3,
      name: "Product 3",
      price: 5.99,
    },
    {
      id: 4,
      name: "Product 4",
      price: 15.99,
    },
  ];

  if (req.query.search) {
    const filteredProducts = products.filter((product) =>
    product.name.includes(req.query.search));
    res.send(filteredProducts);
    return;
  }

  setTimeout(() => {
    res.json(products);
  }, 3000);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
