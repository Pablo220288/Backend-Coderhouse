class SessionManager {
  getSession = (req, res, next) => {
    if (req.session.login) {
      return res.redirect("home", {});
    } else {
      return res.redirect("/", {});
    }
  };
  testLogin = (req, res, next) => {
    if (req.body.email == "p@p.com" && req.body.password == "1234") {
      req.session.login = true;
      return res.redirect("home", {});
    } else {
      return res.redirect("/", {
        //mensajes de error
      });
    }
  };

  destroySession = (req, res, next) => {
    if (req.session.login) {
      return res.redirect("/", {});
    }
  };
}

export default SessionManager
