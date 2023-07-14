import express from "express";

const PORT = 8080;

const app  = express();

/* middlewares */
const methodLogger = (req, res, next) => {
    console.log(`METHOD: ${req.method}`);
    next();
}
const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if (url === "/protected") {
        return res.send("<h1>Not Allowed</h1>")
    }
    console.log("Allowed. You may continue");
    next();
}
const routerLogger = (req, res, next) => {
    console.log(`PATH: ${req.path}`);

    // return res.send("www");
    next();
}

/* handler */
const handleHome = (req, res) => {
    console.log("I will respond.");

    return res.send("Here is middlewares.........");
}
const handleLogin = (req, res) => {
    return res.send({ "message" : "in the bottle.........." });
}
const handleProtected = (req, res) => {
    return res.send("Welcome :)");
}

app.use(methodLogger, routerLogger);
// app.use(privateMiddleware);
app.get("/", handleHome);
// app.get("/", methodLogger, routerLogger, handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

const handleListening = () => console.log(`✅ Server Listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);