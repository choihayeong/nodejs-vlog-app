import express from "express";

const PORT = 8080;

const app  = express();

/* middlewares */
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
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

/* handler */
const handleHome = (req, res) => {
    return res.send("Here is middlewares.........");
}
const handleLogin = (req, res) => {
    return res.send({ "message" : "in the bottle.........." });
}
const handleProtected = (req, res) => {
    return res.send("Welcome :)");
}

app.use(logger);
app.use(privateMiddleware);
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

const handleListening = () => console.log(`✅ Server Listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);