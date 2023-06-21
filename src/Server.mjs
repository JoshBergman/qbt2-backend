import app from "./Index.mjs";

let port = process.env.PORT || 5000;
app.listen(port);

// using seperate server and app files allows for reliable testing
