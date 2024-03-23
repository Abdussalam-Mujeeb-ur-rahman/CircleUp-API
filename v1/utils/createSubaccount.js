const sdk = require("api")("@chimoney/v0.2.3#2g24c1yolok9utem");

sdk.auth(process.env.chimoney_KEY);
sdk.server("https://api-v2-sandbox.chimoney.io");

const createSubaccount = async (userData) => {
  try {
    // Call SDK to create subaccount
    const response = await sdk.postV02SubAccountCreate(userData);
    return response.data;
  } catch (error) {
    // Handle SDK error
    console.error("SDK error:", error);
    throw new Error("Error creating subaccount.");
  }
};

module.exports = createSubaccount;