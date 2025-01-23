export const generateAccessCode = () =>
  require("crypto").randomBytes(16).toString("hex");
