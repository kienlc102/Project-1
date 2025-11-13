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

export { handleGetCheckinByUser, handleGetCheckinsAll };