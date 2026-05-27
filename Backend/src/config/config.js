import dotenv from "dotenv";

dotenv.config();

// Environment variable checks
if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is missing in .env file");
}

if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is missing in .env file");
}
if(!process.env.GOOGLE_CLIENT_ID)
{
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment varaible")
}
if(!process.env.GOOGLE_CLIENT_SECRET)
{
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment varaible")
}
if(!process.env.IMAGEKIT_PRIVATE_KEY)
{
    throw new Error("ImageKit is not defined")

}
// Central config export
export const config = {
    port: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,

    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,

    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
};