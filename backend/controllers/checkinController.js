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
    // 1. Kiểm tra xem hôm nay đã check-in chưa bằng hàm mới tối ưu hơn
    const existingCheckin = await handleGetCheckinToday(Number(userId));

    // 2. Nếu đã tồn tại dữ liệu -> Chặn lại
    if (existingCheckin) {
      return res.status(200).json({ // Hoặc 409 Conflict tuỳ bạn
        message: "Already checked in today",
        checkinInfo: existingCheckin // Trả về thông tin lần check-in đó nếu cần
      });
    }

    // 3. Nếu chưa -> Thực hiện check-in
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

