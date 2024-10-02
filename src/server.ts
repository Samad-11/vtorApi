import app from "./app"
import "dotenv/config"
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000; // "3000"
const SERVER_URL = process.env.SERVER_URL

console.log(process.env.ENV);

app.listen(PORT, () => {
    logger.info(`Server is running`, {
        meta: {
            PORT,
            SERVER_URL
        }
    })
})