import Contact from '../models/ContactModel.js';

class ContactService {
    createContact = async (contactData) => {
        const contact = await Contact.create(contactData);

        try {
            if (contact) {
                return {
                    success: true,
                    data: contact
                }
            }
            else {
                return {
                    success: false,
                }
            }
        }
        catch (err) {
            console.log("Error in contact Service", err);
            return {
                success: false
            }
        }
    }
}

export default new ContactService();