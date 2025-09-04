// backend/controllers/liveLocationController.js
const LiveLocation = require('../models/LiveLocation');
const User = require('../models/user');
const sendSMSToContacts = require('../utils/sendSMS');

const updateLiveLocation = async (req, res) => {
  const { userId, latitude, longitude, isSharing } = req.body;

  try {
    let record = await LiveLocation.findOne({ userId });

    if (!record) {
      record = new LiveLocation({ userId, latitude, longitude, isSharing });
    } else {
      record.latitude = latitude;
      record.longitude = longitude;
      record.isSharing = isSharing;
      record.updatedAt = new Date();
    }

    await record.save();

    if (isSharing) {
      const user = await User.findById(userId);
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      const message = `${user.name} is sharing their live location:\n${locationLink}`;

      await sendSMSToContacts(user.trustedContacts, message);
    }

    res.json({ msg: 'Live location updated and sent if sharing.' });
  } catch (err) {
    console.error('Live Location Error:', err.message);
    res.status(500).json({ msg: 'Server error updating live location' });
  }
};

const stopSharing = async (req, res) => {
  const { userId } = req.body;

  try {
    await LiveLocation.findOneAndUpdate({ userId }, { isSharing: false });
    res.json({ msg: 'Stopped sharing location' });
  } catch (err) {
    console.error('Stop sharing error:', err.message);
    res.status(500).json({ msg: 'Server error stopping share' });
  }
};

module.exports = { updateLiveLocation, stopSharing };



