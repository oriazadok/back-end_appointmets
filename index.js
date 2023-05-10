const express = require('express');
const app = express();

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);


const PORT = 8080;
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));


