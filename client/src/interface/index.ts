export interface IUser{
    _id?: any,
    name: string,
    email: string,
    role: string,
    token: string
} 


export interface ICompanyUsers{
    name: string,
    email: string,
    password: string,
    role: string,
    company: string,
}

export enum Roles {
    ADMIN = "admin",
    USER = "user",
    SUPERADMIN = "super-admin"
}

export interface ICompany{
    _id? : string;
    name: string,
    address: string,
    credit: number
    legalName: string,
    letterHead: string,
    whatsappToken: string,
}

export interface ITemplate{
    _id: string,
    title: string,
    body: string,
    company: string
}


export interface IColumn {
    _id: string,
    borrower: string;
    co_borrower: string;
    guarantor_1: string;
    guarantor_2: string;
    guarantor_3: string;

  }

export interface ICreditTransaction {
    _id: string,
    company: string,
    amount: number,
    justification: string,
    createdAt: Date,
}
  
