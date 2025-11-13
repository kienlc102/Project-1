import { handleGetCheckoutByUser, handleGetCheckoutsAll } from "../services/checkoutServices.js";

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

export { getAllCheckouts, getCheckoutsByUser };