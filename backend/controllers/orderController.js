const Order = require("../models/Order");
const Product = require("../models/Product");

// ✅ Buyer places an order
exports.placeOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in the order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const newOrder = new Order({
      buyer: req.user.id,
      products: orderItems,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// ✅ Buyer views their own orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Farmer views orders for their products
exports.getFarmerOrders = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).select("_id");
    const productIds = products.map((product) => product._id);

    const orders = await Order.find({ "products.product": { $in: productIds } })
      .populate("buyer", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching farmer orders", error: error.message });
  }
};

// ✅ Admin updates order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// ✅ Admin views all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders", error: error.message });
  }
};
