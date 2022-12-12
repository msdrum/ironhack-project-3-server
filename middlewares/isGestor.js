async function isGestor(req, res, next) {
    try {
      if (req.currentUser.role !== "GESTOR") {
        return res.status(401).json({ msg: "Não autorizado." });
      }
  
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  export default isGestor