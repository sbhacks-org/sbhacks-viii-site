const { admin, db } = require("../utils/admin");
const { validateEmail } = require("../utils/mailingListUtils")
const uuid = require("uuid");

exports.mailingListSubscribe = (req, res) => {
    const emailAddress = req.body.emailAddress;
    if(!validateEmail(emailAddress)) {
        res.status(400).json({ error: `\"${emailAddress}\" is an invalid email` });
        return;
    }

    db.collection('mailing-list-subscribers').doc(emailAddress).get().then((doc) => {
        if(!doc.exists) {
            const subscriber = {
                'date-time-subscribed': admin.firestore.Timestamp.now(),
                'token': uuid.v4()
            }
            db.collection('mailing-list-subscribers').doc(emailAddress).set(subscriber).then((doc) => {
                res.json(subscriber);
            })
            .catch((err) => {
                res.status(400).json({ error: `something went wrong: ${err}` });
            });
        }
        else {
            res.status(400).json({ error: `\"${emailAddress}\" is already subscribed` });
        }
    })
};

