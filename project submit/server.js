import { connectToDatabase } from "./config/databaseconfig.js";
import { server } from "./index.js";


server.listen(3000,()=>{
    console.log("Server is listening at 3000");
    connectToDatabase();
})