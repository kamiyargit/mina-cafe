const express = require("express");
const { Product } = require("../services/jsonStore");
const { adminAuth } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");

const router = express.Router();

// Public: list products with filtering & pagination
router.get("/", async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10, special } = req.query;

    const query = { status: "active" };
    if (category) {
      query.categoryId = category;
    }
    if (special === "true") {
      query.special = true;
    }
    if (search) {
      query.search = search;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const { items, total } = await Product.find(query, {
      skip,
      limit: limitNum,
      populate: true,
    });

    return res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    return next(err);
  }
});

// Admin: create product
router.post("/", adminAuth, uploadImage("image"), async (req, res, next) => {
  try {
    const {
      titleEn,
      titleFa,
      descEn,
      descFa,
      price,
      discount,
      status,
      orderingShowInList,
      special,
      category,
    } = req.body;

    const product = await Product.create({
      titleEn: titleEn || "",
      titleFa: titleFa || "",
      descEn: descEn || "",
      descFa: descFa || "",
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      status: status || "active",
      orderingShowInList: Number(orderingShowInList) || 0,
      special: special === "true" || special === true,
      categoryId: category,
      image: req.fileUrl || "",
    });

    const populated = await Product.populate(product);
    return res.status(201).json(populated);
  } catch (err) {
    return next(err);
  }
});

// Admin: update product — only overwrite fields actually sent by the client
router.put("/:id", adminAuth, uploadImage("image"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      titleEn,
      titleFa,
      descEn,
      descFa,
      price,
      discount,
      status,
      orderingShowInList,
      special,
      category,
    } = req.body;

    if (titleEn !== undefined) product.titleEn = titleEn;
    if (titleFa !== undefined) product.titleFa = titleFa;
    if (descEn !== undefined) product.descEn = descEn;
    if (descFa !== undefined) product.descFa = descFa;
    if (price !== undefined) product.price = Number(price) || 0;
    if (discount !== undefined) product.discount = Number(discount) || 0;
    if (status !== undefined) product.status = status;
    if (orderingShowInList !== undefined) {
      product.orderingShowInList = Number(orderingShowInList) || 0;
    }
    if (special !== undefined) {
      product.special = special === "true" || special === true;
    }
    if (category !== undefined) product.categoryId = category;
    if (req.fileUrl) product.image = req.fileUrl;

    const saved = await Product.save(product);
    const populated = await Product.populate(saved);
    return res.json(populated);
  } catch (err) {
    return next(err);
  }
});

// Admin: delete product
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
