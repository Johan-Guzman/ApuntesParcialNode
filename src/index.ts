import express from "express";
import type { Request, Response } from "express";
import dotenv from 'dotenv';
import routes from "./routes";
import { db } from "./config/db";

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Hola mundo desde Node.js con TypeScript!");
});

//app.listen(port, () => {
 // console.log(`Servidor corriendo en http://localhost:${port}`);
//});

routes(app);

db.then( () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        // createMateo();
    })
} );
