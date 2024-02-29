import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import db from "./config/db.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

const port = process.env.PORT;
const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: "auto" },
  })
);

app.use(
  cors({
    origin: true, // Gantilah dengan origin aplikasi frontend Anda
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ProductRoute);
app.use(UserRoute);
app.use(AuthRoute);

// store.sync();

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
