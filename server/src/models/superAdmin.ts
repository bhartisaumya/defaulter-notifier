import {Schema, model} from "mongoose"
import bcrypt from "bcrypt"


interface ISuperAdmin extends Document {
    email: string;
    name: string;
    password: string;
    role: string;
    isValidPassword(password: string): Promise<boolean>;
}

const SuperAdminSchema = new Schema<ISuperAdmin>({
    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String}
})


SuperAdminSchema.pre("save" , async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
        
    }catch (error: any){
        next(error);        
    }
})

SuperAdminSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate() as any;

        if (update.password) {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
            this.setUpdate(update);
        }
        next();
    } catch (error: any) {
        next(error);
    }
});


SuperAdminSchema.methods.isValidPassword = async function (password: string): Promise<boolean>{
    try {
        return bcrypt.compare(password, this.password);
    } catch (error) {
        throw error
    } 
}

const SuperAdminModel = model('superAdmin', SuperAdminSchema)

export default SuperAdminModel;