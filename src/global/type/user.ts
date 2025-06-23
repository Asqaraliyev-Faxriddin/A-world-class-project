export enum UserRole {
    User = "USER",
    Admin = "ADMIN",
    SuperAdmin ="SUPERADMIN"
}

export interface Checktoken {
    id:number,
    role:string,

}