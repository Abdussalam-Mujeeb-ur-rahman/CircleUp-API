exports.generateRandomOTP = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
};