import dotenv from "dotenv"
import { connectDB } from "./db/db.js";
import { app } from "./app.js";
import { initializeJobScheduler } from "./utils/jobScheduler.service.js";

dotenv.config({ path: './.env' })
const PORT = process.env.PORT || 3000
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port : ${PORT}`);
        })
        
        // Initialize job scheduler after successful DB connection
        initializeJobScheduler();
    }
    ).catch((error) => {
        console.log(`DB Connection failed: ${error}`);
    })