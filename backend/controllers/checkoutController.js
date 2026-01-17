import { handleGetCheckoutByUser, handleGetCheckoutsAll, handleGetCheckoutToday, handlePostCheckout } from "../services/checkoutServices.js";

const getAllCheckouts = async (req, res) => {
  const result = await handleGetCheckoutsAll();
  res.status(200).json({ result: result });
}

const getCheckoutsByUser = async (req, res) => {
  const { userId } = req.params;   
    try {
        const result = await handleGetCheckoutByUser(Number(userId));
        res.status(200).json({ result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const postCheckout = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body" });
  }

  try {
    const existingCheckout = await handleGetCheckoutToday(Number(userId));
    if (existingCheckout) {
      return res.status(200).json({
        message: "Already checked out today",
        checkinInfo: existingCheckout
      });
    }
    const result = await handlePostCheckout(userId);
    res.status(200).json({ 
        message: "Check-out successful", 
        result: result 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { getAllCheckouts, getCheckoutsByUser, postCheckout };