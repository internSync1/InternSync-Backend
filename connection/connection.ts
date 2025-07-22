import mongoose from 'mongoose'

const url = process.env.MONGODB_URL as string;
if (!url) {
    console.error("Missing environment variable: MONGODB_URL");
}

export async function connect() {
    let db = await mongoose.connect(url)
    console.log("Connected to Database");
    return db
}
