import mongoose from "mongoose";

import {Data} from "../config"


const connectionStr = "mongodb+srv://bhartisaumya22:1VHY71iRzOWCG6wi@cluster0.jaa9y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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

