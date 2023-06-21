import { MongoClient } from "mongodb";
import privInfo from "../../Private/private-info.mjs";

const { uri, dbName, collectionName, dbAuth } = privInfo;

const client = new MongoClient(uri);
const accountsCollection = client.db(dbName).collection(collectionName);

const setExpenses = async (req, res, next) => {
  const email = req.body.email;
  const sessionID = req.body.sessionID;
  let expenses = req.body.expenses;

  try {
    //check body has all required properties
    if (email == null || sessionID == null || expenses == null) {
      client.close();
      res.json({
        error: true,
        msg: "Please check request body for correct properties.",
      });
      return;
    }

    //validate email & password
    if (
      !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
      !(sessionID.length >= 8)
    ) {
      client.close();
      res.json({ error: true, msg: "Invalid email or Session." });
      return;
    }

    //confirm account exists and has session ID
    const gatherAccountInfo = await accountsCollection.findOne({
      email: email,
    });
    if (gatherAccountInfo == null) {
      client.close();
      res.json({ error: true, msg: "Email doesn't exists" });
      return;
    }
    if (gatherAccountInfo.sessionID !== sessionID) {
      client.close();
      res.json({ error: true, msg: "Session invalid. Please re-log." });
      return;
    }

    //ensure expenses is an array.
    if (typeof expenses !== "object") {
      expenses = [];
    } else if (!Array.isArray(expenses)) {
      expenses = [];
    }

    // update expenses array
    const response = await accountsCollection.updateOne(
      { email: email },
      { $set: { expenses: expenses } }
    );

    if (response.acknowledged && response.modifiedCount >= 1) {
      client.close();
      res.json({ error: false });
      return;
    }

    throw new Error();
  } catch (err) {
    client.close();
    res.json({ error: true, msg: "Servor Error - Please try again later." });
    return;
  }
};

export default setExpenses;
