import mongoose from "mongoose";

import {Data} from "../config"


const connectionStr = "mongodb://localhost:27017/test"
//  || Data.DATABASE_URL as string

// console.log("connectionStr:", connectionStr)

mongoose.connect(connectionStr)
.then(() => {
    console.log("Database connected")
})
.catch((err) => console.error(err))


process.on("beforeExit", () => {
    mongoose.disconnect();
    process.exit(0);
});

