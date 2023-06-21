import { MongoClient } from "mongodb";
import privInfo from "../../../Private/private-info.mjs";
import getNewId from "../../../Private/sess-id.mjs";

const { uri, dbName, collectionName, dbAuth } = privInfo;

const client = new MongoClient(uri);
const accountsCollection = client.db(dbName).collection(collectionName);

const changePassword = async (req, res, next) => {
  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    //check body has all required properties
    if (email == null || oldPassword == null || newPassword == null) {
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
      !(oldPassword.length >= 3) ||
      !(newPassword.length >= 3)
    ) {
      client.close();
      res.json({
        error: true,
        msg: "Invalid email, password, or new password.",
      });
      return;
    }

    //check for old password match
    const gatherAccountInfo = await accountsCollection.findOne({
      email: email,
    });
    if (gatherAccountInfo == null) {
      client.close();
      res.json({ error: true, msg: "Email doesn't exists" });
      return;
    }

    //compare passwords to see if they are a match, if so delete the account.
    const storedPassword = dbAuth.decrypt(gatherAccountInfo.password);
    if (oldPassword === storedPassword) {
      const safeNewPassword = dbAuth.encrypt(newPassword);
      const newSessId = getNewId();

      const response = await accountsCollection.updateOne(
        { email: email },
        { $set: { password: safeNewPassword, sessionID: newSessId } }
      );

      if (response.acknowledged && response.modifiedCount >= 1) {
        client.close();
        res.json({ error: false, sessionID: newSessId });
        return;
      }
    }

    throw new Error();
  } catch (err) {
    client.close();
    res.json({ error: true, msg: "Servor Error - Please try again later." });
    return;
  }
};

export default changePassword;
