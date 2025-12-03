import { getConnection } from "../configs/database.js";

const handleGetCheckinsAll = async (req, res) => {
    const connection = await getConnection();
    try{
        const query = "SELECT * FROM `checkin`";
        const [result, fields] = await connection.execute(query);
        return result;
    }
    catch (error) {
        console.error("Error fetching check-ins:", error);
        return error;
    }
    finally {
        await connection.end();
    }
};



const handleGetCheckinByUser = async (userId) => {
    const connection = await getConnection();
    try{
        const query = "SELECT * FROM `checkin` WHERE `userId` = ?";
        const [result] = await connection.execute(query, [Number(userId)]);
        return result;
    }
    catch (error) {
        console.error("Error fetching check-ins by user:", error);
        return [];
    }
    finally{
        await connection.end();
    }
};

const handlePostCheckin = async (userId) => {
    const connection = await getConnection();
    try {
        const query = "INSERT INTO `checkin` (`userId`, `time`) VALUES (?, ?)";
        const currentTime = new Date(); // Lấy thời gian hiện tại của server

        const [result] = await connection.execute(query, [userId, currentTime]);
        
        // result sẽ chứa thông tin như { insertId: ..., affectedRows: 1 }
        return result;
    } catch (error) {
        console.error("Error creating check-in:", error);
        return error;
    } finally {
        await connection.end();
    }
};

const handleGetCheckinToday = async (userId) => {
    const connection = await getConnection();
    try {
        // CURDATE() lấy ngày hiện tại của SQL
        // DATE(time) cắt bỏ phần giờ phút giây, chỉ lấy ngày để so sánh
        const query = "SELECT * FROM `checkin` WHERE `userId` = ? AND DATE(`time`) = CURDATE()";
        
        const [result] = await connection.execute(query, [userId]);
        
        // Trả về phần tử đầu tiên nếu tìm thấy, hoặc undefined nếu chưa checkin
        return result[0]; 
    } catch (error) {
        console.error("Error checking today checkin:", error);
        throw error; // Ném lỗi để controller bắt
    } finally {
        await connection.end();
    }
};

export { handleGetCheckinByUser, handleGetCheckinsAll, handlePostCheckin, handleGetCheckinToday };