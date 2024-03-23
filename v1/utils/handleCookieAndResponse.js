const { createToken } = require("../utils/tokens");

const handleCookieAndResponse = (res, user) => {
  // Clear and set cookie
  res.clearCookie(process.env.COOKIE_NAME, {
    domain: "onrender.com",
    // domain: "localhost",
    httpOnly: true,
    signed: true,
    path: "/",
  });

  const token = createToken(user.id, user.email);

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  res.cookie(process.env.COOKIE_NAME, token, {
    path: "/",
    domain: "onrender.com",
    // domain: "localhost",
    expires,
    httpOnly: true,
    signed: true,
  });

  // Send success response
  res.status(201).json({
    success: true,
    data: user,
  });
};

module.exports = handleCookieAndResponse;
