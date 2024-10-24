import bycrypt from "bcrypt"

export const hashPassword = async(password: string) => {
    const salt = await bycrypt.genSalt(10)
    const passwordHashed = await bycrypt.hash(password, salt)
    return passwordHashed
}