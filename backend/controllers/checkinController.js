import { handleGetCheckinByUser, handleGetCheckinsAll } from "../services/checkinServices.js";

const getAllCheckins = async (req, res) => {
  const result = await handleGetCheckinsAll()
  res.status(200).json({result: result})
}

const getCheckinsByUser = async (req, res) => {
  const {userId} = req.params
  try {
  const result = await handleGetCheckinByUser(Number(userId))
  res.status(200).json({result: result})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { getAllCheckins, getCheckinsByUser };

