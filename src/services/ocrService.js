import Tesseract from "tesseract.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class OCRService {
  async testOCR() {
    const forwardPath = path.join(__dirname, "../uploads/mtcc.jpg"); // mặt trước
    const backwardPath = path.join(__dirname, "../uploads/mscc.jpg"); // mặt sau

    try {
      const forwardResult = await Tesseract.recognize(forwardPath, "vie+eng");
      const backResult = await Tesseract.recognize(backwardPath, "vie+eng");

      const fullText = (forwardResult.data.text + "\n" + backResult.data.text)
        .replace(/\s+/g, " ")
        .toUpperCase();

      console.log("===== OCR RAW TEXT =====");
      console.log(fullText);

      const info = {};

      // --- SỐ CCCD ---
      let cccdMatch = fullText.match(/\b\d{9,12}\b/);
      if (!cccdMatch) {
        const mrzMatch = fullText.match(/VNM\d{9,18}/);
        if (mrzMatch) {
          cccdMatch = [mrzMatch[0].replace("VNM", "")];
        }
      }
      if (cccdMatch) info.cccd = cccdMatch[0];

      // --- HỌ VÀ TÊN ---
      // match cả "HỌ VA TEN / FULL NAME: NGUYEN TIEN DUNG"
      const nameMatch = fullText.match(/HỌ\s*VA?\s*TÊN.*?[: ]+([A-Z\s]+)(?=\s+NGÀY|NGAY|DATE|DOB)/);
      if (nameMatch) {
        info.fullName = nameMatch[1].trim();
      } else {
        const mrzName = fullText.match(/<<([A-Z<]+)<<</);
        if (mrzName) info.fullName = mrzName[1].replace(/</g, " ").trim();
      }

      // --- NGÀY SINH ---
      const dobMatch = fullText.match(/NGÀY\s*SINH.*?[: ]+(\d{1,3}[\/-]\d{1,2}[\/-]\d{4})/);
      if (dobMatch) {
        let dob = dobMatch[1];
        dob = dob.replace(/^4(\d{2}\/\d{2}\/\d{4})$/, "$1"); // fix OCR 413/10/2003 -> 13/10/2003
        info.dob = dob;
        info.yearOfBirth = dob.split(/[\/-]/)[2];
      }

      // --- NGÀY CẤP ---
      const issueMatch = fullText.match(/DATE[, ]*MONTH[, ]*YEAR[: ]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/);
      if (issueMatch) {
        info.issueDate = issueMatch[1];
      }

      // --- NƠI THƯỜNG TRÚ ---
      const residenceMatch = fullText.match(/NƠI\s*THƯỜNG\s*TRÚ.*?:\s*([A-Z0-9\s,]+?)(?=\s+[A-Z]+\s*\/|DATE|NGÀY|NAM)/);
      if (residenceMatch) {
        info.residence = residenceMatch[1].trim();
      }

      console.log("===== PARSED INFO =====");
      console.log(info);

      return { rawText: fullText, parsed: info };
    } catch (err) {
      console.error("OCR lỗi:", err);
      return null;
    }
  }

  async verifyOCR(forwardImage, backwardImage, accountData) {
    return true;
  }
}

export default new OCRService();
