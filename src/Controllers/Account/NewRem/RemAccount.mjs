import { MongoClient } from "mongodb";
import privInfo from "../../../Private/private-info.mjs";

const { uri, dbName, collectionName, dbAuth } = privInfo;

const client = new MongoClient(uri);
const accountsCollection = client.db(dbName).collection(collectionName);

const remAccount = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    //check for required body properties
    if (email == null || password == null) {
      client.close();
      res.json({
        error: true,
        msg: "Please check request body for correct properties.",
      });
      return;
    }

    //validate email & password
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !(password.length >= 3)) {
      throw new Error();
    }

    //get existing account information
    const gatherAccountInfo = await accountsCollection.findOne({
      email: email,
    });
    if (gatherAccountInfo === null) {
      throw new Error();
    }

    //compare passwords to see if they are a match, if so delete the account.
    const storedPassword = dbAuth.decrypt(gatherAccountInfo.password);
    if (password === storedPassword) {
      const delResponse = await accountsCollection.deleteOne({ email: email });

      if (delResponse.acknowledged && delResponse.deletedCount >= 1) {
        client.close();
        res.json({ error: false });
        return;
      }
    }
    throw new Error();
  } catch (err) {
    client.close();
    res.json({
      error: true,
      msg: "Email does not exist or password does not match.",
    });
    return;
  }
};

export default remAccount;
