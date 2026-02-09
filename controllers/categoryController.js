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
  const { page = 1, limit = 10 } = req.query;

  const filter = { isActive: true };

  const skip = (Number(page) - 1) * Number(limit);

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit)),

    Category.countDocuments(filter),
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: categories,
        pagination: {
          totalRecords: total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          limit: Number(limit),
        },
      },
      "Category list fetched"
    )
  );
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

/**
 * ADMIN – DELETE CONTACT
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Category not found"));
  }

  await category.deleteOne();

  return res.status(200).json(
    new apiResponse(
      200,
      null,
      "Category deleted successfully"
    )
  );
});

export default {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};