const Product = require("../models/Product");

const BASE_URL = "http://localhost:5000/"; // Adjust this for production

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name email");

    const updatedProducts = products.map((product) => ({
      ...product._doc,
      image: product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`,
    }));

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmer", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure image URL is properly formatted
    product.image = product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`;

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    console.log("Received Body:", req.body);
    console.log("Received File:", req.file);

    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ message: "Price and stock must be numbers" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imagePath = req.file.path.replace(/\\/g, "/"); // Ensure correct path format

    const newProduct = new Product({
      farmer: req.user.id,
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      image: imagePath,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: {
        ...newProduct._doc,
        image: `${BASE_URL}${newProduct.image}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own products" });
    }

    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : product.image;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.stock = stock ? Number(stock) : product.stock;
    product.image = imagePath;

    await product.save();

    res.json({
      message: "Product updated successfully",
      product: {
        ...product._doc,
        image: `${BASE_URL}${product.image}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own products" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
