import bcrypt from "bcrypt";

const checkPassword = async(password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}

export default checkPassword