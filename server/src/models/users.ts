import {Schema, model} from "mongoose"
import bcrypt from "bcrypt"


export enum Role {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    USER = "user"
}

const UsersSchema = new Schema({
    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: Role, required: true}
})


UsersSchema.pre("save" , async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
        
    }catch (error: any){
        next(error);        
    }
})

UsersSchema.pre("findOneAndUpdate", async function (next) {
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


UsersSchema.methods.isValidPassword = async function (password: string): Promise<boolean>{
    try {
        return bcrypt.compare(password, this.password);
    } catch (error) {
        throw error
    } 
}

const SuperAdminModel = model('superAdmin', UsersSchema)

export default SuperAdminModel;