import express from "express";
import morgan from "morgan";

const PORT = 8080;

const app  = express();
const loggerMiddleware = morgan("combined");

/* middlewares */

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

app.use(loggerMiddleware);
app.get("/", handleHome);
// app.get("/", methodLogger, routerLogger, handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

const handleListening = () => console.log(`✅ Server Listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);