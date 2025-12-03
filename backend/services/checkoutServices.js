import { getConnection } from "../configs/database.js";

const handleGetCheckoutsAll = async (req, res) => {
    const connection = await getConnection()
    try{
        const query = "SELECT * FROM `checkout`"
        const [result, fields] = await connection.execute(query);
        return result;
    }
    catch (error) {
        console.error("Error fetching check-outs:", error);
        return error;
    }
    finally {
        await connection.end();
    }  
};

const handleGetCheckoutByUser = async (userId) => {
    const connection = await getConnection();
    try{
        const query = "SELECT * FROM `checkout` WHERE `userId` = ?";
        const [result] = await connection.execute(query, [Number(userId)]);
        return result;
    }
    catch (error) {
        console.error("Error fetching check-outs by user:", error);
        return [];
    }
    finally{
        await connection.end();
    }
};

const handlePostCheckout = async (userId) => {
    const connection = await getConnection();
    try {
        const query = "INSERT INTO `checkout` (`userId`, `time`) VALUES (?, ?)";
        const currentTime = new Date(); // Lấy thời gian hiện tại của server

        const [result] = await connection.execute(query, [userId, currentTime]);
        
        // result sẽ chứa thông tin như { insertId: ..., affectedRows: 1 }
        return result;
    } catch (error) {
        console.error("Error creating check-out:", error);
        return error;
    } finally {
        await connection.end();
    }
};

const handleGetCheckoutToday = async (userId) => {
    const connection = await getConnection();
    try {
        // CURDATE() lấy ngày hiện tại của SQL
        // DATE(time) cắt bỏ phần giờ phút giây, chỉ lấy ngày để so sánh
        const query = "SELECT * FROM `checkout` WHERE `userId` = ? AND DATE(`time`) = CURDATE()";
        
        const [result] = await connection.execute(query, [userId]);
        
        // Trả về phần tử đầu tiên nếu tìm thấy, hoặc undefined nếu chưa checkin
        return result[0]; 
    } catch (error) {
        console.error("Error checking today checkout:", error);
        throw error; // Ném lỗi để controller bắt
    } finally {
        await connection.end();
    }
};

export { handleGetCheckoutByUser, handleGetCheckoutsAll, handlePostCheckout, handleGetCheckoutToday };