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
 * ADMIN – GET CONTACT LIST WITH FILTERS
 */
export const getContactList = asyncHandler(async (req, res) => {
  const { search, fromDate, toDate } = req.query;

  const filter = {};

  // 🔍 Name search (firstName + lastName)
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  // 📅 Date filter
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) {
      filter.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      filter.createdAt.$lte = new Date(toDate);
    }
  }

  const contacts = await ContactUs.find(filter).sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      contacts,
      "Contact list fetched successfully"
    )
  );
});