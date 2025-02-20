import express, {Request, Response, NextFunction} from "express"

const app = express();



app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "Server is healthy!!!"
    });
})


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})