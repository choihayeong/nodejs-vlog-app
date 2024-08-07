export const localsMiddleware = (req, res, next) => {
  // console.log(req.session);

  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Easy2Vlog";
  console.log(res.locals);

  next();
};
