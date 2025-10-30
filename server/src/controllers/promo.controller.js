import PromoCode from "../models/promo.model.js";

/**
 * --- Create a new Promo Code ---
 * An admin/protected function to add new codes to the DB.
 */
export const createPromoCode = async (req, res) => {
  try {
    const { code, type, value, isActive } = req.body;

    if (!code || !type || !value) {
      return res
        .status(400)
        .json({ message: "Code, type, and value are required." });
    }

    // Check if code already exists (case-insensitive)
    const existingCode = await PromoCode.findOne({
      code: code.toUpperCase(),
    });

    if (existingCode) {
      return res
        .status(409)
        .json({ message: "This promo code already exists." });
    }

    const newPromo = new PromoCode({
      code: code.toUpperCase(), // Store as uppercase
      type,
      value,
      isActive,
    });

    await newPromo.save();

    res.status(201).json({
      status: "success",
      message: "Promo code created successfully",
      data: newPromo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * --- Validate a Promo Code ---
 * Used by the frontend on the checkout page.
 */
export const validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Promo code is required." });
    }

    const promo = await PromoCode.findOne({
      code: code.toUpperCase(), // Match in uppercase
      isActive: true,
    });

    if (!promo) {
      return res
        .status(404)
        .json({ message: "Invalid or expired promo code." });
    }

    // Send back the valid promo details
    res.status(200).json({
      status: "success",
      message: "Promo code is valid.",
      data: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
