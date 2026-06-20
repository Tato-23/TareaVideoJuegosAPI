import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";

// Dynamic import ensures dotenv.config() runs before any module reads process.env
const { default: app } = await import("./app.js");

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 3000;

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
