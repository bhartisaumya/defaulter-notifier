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
    USER = "user"
}

export interface ICompany{
    name: string,
    address: string,
    credit: number
}

export interface ITemplate{
    _id: string,
    title: string,
    body: string,
    company: string
}


export interface IColumn {
    _id: string,
    defaulter_phone: string;
    guarantor_phone1: string;
    guarantor_phone2: string;
  }
  
