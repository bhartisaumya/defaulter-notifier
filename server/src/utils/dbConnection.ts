import mongoose from "mongoose";

import {Data} from "../config"


const connectionStr = "mongodb://127.0.0.1:27017/test"
// mongodb://127.0.0.1:27017/myDatabase
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

