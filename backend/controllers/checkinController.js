import { handleGetCheckinByUser, handleGetCheckinsAll, handlePostCheckin, handleGetCheckinToday } from "../services/checkinServices.js";

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

const postCheckin = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body" });
  }

  try {
    const existingCheckin = await handleGetCheckinToday(Number(userId));
    if (existingCheckin) {
      return res.status(200).json({
        message: "Already checked in today",
        checkinInfo: existingCheckin
      });
    }

    const result = await handlePostCheckin(userId);
    res.status(200).json({ 
        message: "Check-in successful", 
        result: result 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { getAllCheckins, getCheckinsByUser, postCheckin };

