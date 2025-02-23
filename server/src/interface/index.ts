import {Role} from "../models/users"

export const Roles = {
    ...Role,
    SUPER_ADMIN: "super_admin" as const
} 