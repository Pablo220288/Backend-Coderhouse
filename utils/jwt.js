import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "12h",
  });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).send({
      error: "User no Autenticado",
    });
  const token = authHeader.split(" ")[1];
  jwt.sign(token, process.env.JWT_PRIVATE_KEY, (error, credentials) => {
    if (error)
      return req.status(403).send({
        error: "User no Autorizado",
      });
    req.user = credentials.user;
    next();
  });
};
