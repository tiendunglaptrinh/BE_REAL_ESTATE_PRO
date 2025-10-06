
import ContactService from '../services/contactService.js';

class ContactController {

    getAllContactInSender = (req, res) => {

    }

    getAllContactInReceive = (req, res) => {

    }

    createContact = async (req, res) => {
        try {
            console.log("Body send be: ", req.body);
            const { userId } = req.user;
            const { receive_id, content } = req.body;

            const contactData = {
                sender_id: userId,
                receive_id,
                content
            }

            const response = await ContactService.createContact(contactData);

            if (response.success) {
                return res.status(200).json({
                    success: true,
                    message: "Tạo yêu cầu liên hệ thành công !!!",
                    data: response.data
                })
            }
            else{
                return res.status.status(422).json({
                    success: false, 
                    message: "Tạo yêu cầu liên hệ thất bại !!!"
                })
            }
        }
        catch (err){
            console.log("Error in create Contact: ", err);
            return res.status(500).json({
                success: false,
                message: "Lỗi hệ thống trong quá trình tạo yêu cầu liên hệ."
            })
        }
    }

    updataContact = async (req, res) => {

    }

    deleteContact = async (req, res) => {

    }
}

export default new ContactController();