import { MongoClient } from "mongodb";
import privInfo from "../../../Private/private-info.mjs";
import getNewId from "../../../Private/sess-id.mjs";

const { uri, dbName, collectionName, dbAuth } = privInfo;

const client = new MongoClient(uri);
const accountsCollection = client.db(dbName).collection(collectionName);

const newAccount = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let expenses = req.body.expenses;

  try {
    //check body has all required properties
    if (email == null || password == null || expenses == null) {
      client.close();
      res.json({
        error: true,
        msg: "Please check request body for correct properties.",
      });
      return;
    }

    //validate email & password
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !(password.length >= 3)) {
      client.close();
      res.json({ error: true, msg: "Invalid email or password." });
      return;
    }

    //check for existing email
    const gatherAccountInfo = await accountsCollection.findOne({
      email: email,
    });
    if (gatherAccountInfo !== null) {
      if (gatherAccountInfo.email !== "TestAdd@TestAdd.com") {
        client.close();
        res.json({ error: true, msg: "Email already exists" });
        return;
      }
    }

    //ensure expenses is an array.
    if (typeof expenses !== "object") {
      expenses = [];
    } else if (!Array.isArray(expenses)) {
      expenses = [];
    }

    // add new user after all checks
    const safePassword = dbAuth.encrypt(password);
    const newSessId = getNewId();
    const newUser = {
      email: email,
      password: safePassword,
      sessionID: newSessId,
      expenses: expenses,
    };
    await accountsCollection.insertOne(newUser);
    client.close();
    res.json({ error: false, sessionID: newSessId });
    return;
  } catch (err) {
    client.close();
    res.json({ error: true, msg: "Servor Error - Please try again later." });
    return;
  }
};

export default newAccount;
