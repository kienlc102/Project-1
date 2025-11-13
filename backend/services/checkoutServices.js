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

export { handleGetCheckoutByUser, handleGetCheckoutsAll };