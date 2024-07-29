import bcrypt from "bcrypt";

const hashearPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt); 

    return passwordHashed
}

export default hashearPassword;