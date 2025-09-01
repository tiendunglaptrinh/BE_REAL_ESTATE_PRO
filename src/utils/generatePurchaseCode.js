const generatePurchaseCode = () => {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const code_purchase = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    return `HOMEPRO${timestamp}${code_purchase}`;
}

export default generatePurchaseCode;