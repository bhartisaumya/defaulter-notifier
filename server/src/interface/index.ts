import {Role} from "../models/users"

export const Roles = {
    ...Role,
    SUPER_ADMIN: "super-admin" as const
} 