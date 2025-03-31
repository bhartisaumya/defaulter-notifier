import {Schema, model} from "mongoose"
import bcrypt from "bcrypt"


export enum Role {
    ADMIN = "admin",
    USER = "user"
}

interface IUsers extends Document {
    email: string;
    name: string;
    password: string;
    role: Role;
    company: string;
    companyId: string;
    isValidPassword(password: string): Promise<boolean>;
}

const UsersSchema = new Schema<IUsers>({
    email: {type: String, lowercase: true, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    company: {type: String, required: true},
    companyId: {type: String, required: true},
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

const UserModel = model('users', UsersSchema)

export default UserModel;