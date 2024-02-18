import { config } from "dotenv";
config();

export default {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DATABASE: process.env.MONGO_DATABASE,
    PORT: process.env.PORT || 8080,
    MODE_ENVIROMENT: process.env.MODE_ENVIROMENT,
    JWT_SECRET: process.env.JWT_SECRET,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PERSISTENCE: process.env.PERSISTENCE,
    USER_MAIL: process.env.USER,
    PASS_MAIL: process.env.PASS,
    EMAIL_ADMIN: process.env.EMAIL_ADMIN,
    SESSION: process.env.SESSION,
    SECRET_MONGO_STORE: process.env.SECRET_MONGO_STORE,
    TTL: process.env.TTL
}