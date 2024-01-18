import { config } from "dotenv";
config();

export default {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DATABASE: process.env.MONGO_DATABASE,
    PORT: process.env.PORT || 8080,
    MODE_ENVIROMENT: process.env.MODE_ENVIROMENT,
    JWT_SECRET: process.env.JWT_SECRET,
    PERSISTENCE: process.env.PERSISTENCE,
    USER_MAIL: process.env.USER,
    PASS_MAIL: process.env.PASS
}