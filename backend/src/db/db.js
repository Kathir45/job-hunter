import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

export const connectDB = async () => {
    try {
        const MONGODB_URL = process.env.MONGODB_URL
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables")
        }
        const connectionInstance = await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`)
        console.log(`MONGODB Connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`MONGODB Connection error`, error);
        process.exit(1)
    }
}