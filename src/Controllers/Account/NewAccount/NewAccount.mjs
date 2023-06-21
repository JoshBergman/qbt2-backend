import { MongoClient } from "mongodb";
import privInfo from "../../../Private/private-info.mjs";

const { uri, dbName, collectionName } = privInfo;

const client = new MongoClient(uri);
const UsersCollection = client.db(dbName).collection(collectionName);

const newAccount = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let expenses = req.body.expenses;

  //validate email & password
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && !(password.length >= 3)) {
    res.json({ error: true, msg: "Invalid email or password." });
  }

  //ensure expenses is an array.
  if (typeof expenses !== "object") {
    expenses = [["wasn't object"]];
  } else if (!Array.isArray(expenses)) {
    expenses = [["was object, wasn't array"]];
  }

  const newUser = {
    email: email,
    password: password,
    expenses: expenses,
    sessionID: {
      curr: "testID12312",
      expiresOn: "69oclock",
    },
  };

  try {
    await UsersCollection.insertOne(newUser);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, msg: "Servor Error - Please try again later." });
  }
};

export default newAccount;
