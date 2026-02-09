import ContactUs from "../models/ContactUs.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/**
 * CREATE CONTACT US
 */
export const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !email || !message) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Required fields missing"));
  }

  const contact = await ContactUs.create({
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  return res.status(201).json(
    new apiResponse(
      201,
      contact,
      "Contact request submitted successfully"
    )
  );
});

/**
 * ADMIN – GET CONTACT LIST WITH FILTERS + PAGINATION
 */
export const getContactList = asyncHandler(async (req, res) => {
  const {
    search,
    fromDate,
    toDate,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  // 🔍 Name search (firstName + lastName)
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  // 📅 Date filter (FULL DAY SAFE)
  if (fromDate || toDate) {
    filter.createdAt = {};

    if (fromDate) {
      filter.createdAt.$gte = new Date(`${fromDate}T00:00:00.000Z`);
    }

    if (toDate) {
      filter.createdAt.$lte = new Date(`${toDate}T23:59:59.999Z`);
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [contacts, total] = await Promise.all([
    ContactUs.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    ContactUs.countDocuments(filter),
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: contacts,
        pagination: {
          totalRecords: total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          limit: Number(limit),
        },
      },
      "Contact list fetched successfully"
    )
  );
});

/**
 * ADMIN – DELETE CONTACT
 */
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await ContactUs.findById(id);

  if (!contact) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Contact not found"));
  }

  await contact.deleteOne();

  return res.status(200).json(
    new apiResponse(
      200,
      null,
      "Contact deleted successfully"
    )
  );
});