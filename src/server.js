import express from "express";

const PORT = 8080;

const app  = express();

const handleHome = (req, res) => {
    return res.send("<h1>Heading #1</h1>");
}
const handleLogin = (req, res) => {
    return res.send({ "message" : "in the bottle.........." });
}

app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () => console.log(`✅ Server Listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);