import bcrypt from 'bcrypt';

const HashPassword = async (name, value, round) => {
  try {
    if (!value || typeof value !== 'string') {
      console.log(value);
      throw new Error(`${name} is invalid`);
    }
    const salt = await bcrypt.genSalt(Number(round));
    const hashedValue = await bcrypt.hash(value, 10);
    
    return hashedValue;
    
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};


const CompareHash = async (password, hash) => {
  try {
    // Sử dụng bcrypt.compare (phiên bản bất đồng bộ)
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

const DecryptHash = async (password, round) => {

}

export { HashPassword, CompareHash }
