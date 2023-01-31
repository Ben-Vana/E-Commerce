const checkAdmin = async (req, res, next) => {
  try {
    if (!req.userData.admin) throw "Unauthorized";
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = checkAdmin;
