class CapchaService{
    constructor(){
    }

    verifyCaptcha = async (req, res) => {
        const captcha_token = process.env.CAPTCHA_TOKEN;
        const secret_key = process.env.SECRET_KEY_CAPTCHA;

        
    }


}