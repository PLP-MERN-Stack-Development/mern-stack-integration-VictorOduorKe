const mongoose=require("mongoose")
const dotenv=require("dotenv")

dotenv.config()

const createDbConnection=async ()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGODB_URI);
        if(!connection){
            return console.log("database not connected")
        }
        console.log("Db connected and running")
        
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
    
}

module.exports=createDbConnection