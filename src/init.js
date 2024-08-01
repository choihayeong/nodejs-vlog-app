import "./db";
import "./models/Video";
import "./models/User";
import "./models/Member";
import app from "./server";

const PORT = 3030;

const handleListening = () =>
  console.log(`✅ Server Listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);
