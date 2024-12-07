import bcrypt from 'bcrypt';

const HashPassword = async (password, round) => {
  try {
    console.log('Password received before hash:', password);  // Log giá trị password nhận được

    // Kiểm tra kiểu dữ liệu của password
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw new Error('Password is invalid');
    }

    const salt = await bcrypt.genSalt(round);

    console.log('Generated salt:', salt);  // Log salt để kiểm tra
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword;
    
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

export default HashPassword;
