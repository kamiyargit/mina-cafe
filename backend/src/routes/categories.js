const express = require("express");
const { Category } = require("../services/jsonStore");
const { adminAuth } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");

const router = express.Router();

// Public: list categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (err) {
    return next(err);
  }
});

// Admin: create category
router.post("/", adminAuth, uploadImage("image"), async (req, res, next) => {
  try {
    const { titleEn, titleFa, descEn, descFa, icon, orderingShowInList } = req.body;
    const category = await Category.create({
      titleEn: titleEn || "",
      titleFa: titleFa || "",
      descEn: descEn || "",
      descFa: descFa || "",
      icon: req.fileUrl || icon || "",
      orderingShowInList: Number(orderingShowInList) || 0,
    });
    return res.status(201).json(category);
  } catch (err) {
    return next(err);
  }
});

// Admin: update category — only overwrite fields actually sent by the client
router.put("/:id", adminAuth, uploadImage("image"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { titleEn, titleFa, descEn, descFa, icon, orderingShowInList } = req.body;
    if (titleEn !== undefined) category.titleEn = titleEn;
    if (titleFa !== undefined) category.titleFa = titleFa;
    if (descEn !== undefined) category.descEn = descEn;
    if (descFa !== undefined) category.descFa = descFa;
    if (orderingShowInList !== undefined) {
      category.orderingShowInList = Number(orderingShowInList) || 0;
    }
    if (req.fileUrl) {
      category.icon = req.fileUrl;
    } else if (icon !== undefined) {
      category.icon = icon;
    }

    const updated = await Category.save(category);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

// Admin: delete category
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
