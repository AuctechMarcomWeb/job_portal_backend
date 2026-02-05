import Category from "../models/Category.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Category name is required"));
  }

  const slug = slugify(name, { lower: true });

  const exists = await Category.findOne({ slug });
  if (exists) {
    return res
      .status(409)
      .json(new apiResponse(409, null, "Category already exists"));
  }

  const category = await Category.create({ name, slug });

  return res
    .status(201)
    .json(new apiResponse(201, category, "Category created successfully"));
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });

  return res
    .status(200)
    .json(new apiResponse(200, categories, "Category list fetched"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Category not found"));
  }

  Object.assign(category, req.body);
  await category.save();

  return res
    .status(200)
    .json(new apiResponse(200, category, "Category updated successfully"));
});

export default {
  createCategory,
  getCategories,
  updateCategory,
};