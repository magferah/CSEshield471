const SOSAlert = require('../models/SOSAlert'); // import this
const User = require('../models/User');
const sendSMSToContacts = require('../utils/sendSMS');


const sendSOS = async (req, res) => {
  try {
    const { userId, location } = req.body;
    const user = await User.findById(userId);
   
    if (!user || !user.trustedContacts) {
      return res.status(404).json({ msg: 'User or contacts not found' });
    }


    const locationLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const message = `🚨 HELP ME! IT'S AN EMERGENCY!\nLocation: ${locationLink}`;
   
    // Fetch full user data for trusted contacts (by phone number)
    const trustedUsers = await User.find({
      phoneNumber: { $in: user.trustedContacts }
    });


    const notifiedNames = [];


    for (const contact of trustedUsers) {
      try {
        // Send SMS
        await sendSMSToContacts([contact.phoneNumber], message);
      // Loop through each trusted contact
      //for (const recipientPhone of user.trustedContacts) {
        // Send SMS
        //await sendSMSToContacts([recipientPhone], message);


        // Save alert to database
        const alert = new SOSAlert({
          senderId: user._id,
          senderName: user.name,
          senderPhone: user.phoneNumber,
          recipientId: contact._id, // ✅ NEW ADDITION
          //recipientPhone,
          recipientPhone: contact.phoneNumber,
          recipientName: contact.name,
          //recipientName: 'Trusted Contact', // optional: you can store recipient names too
          message,
          locationLink,
        });


        //console.log('Saving SOS alert...');
        console.log(`Saving SOS alert for ${contact.name}`);
        await alert.save();
        //console.log('✅ SOS alert saved to DB');
        notifiedNames.push(contact.name);
      } catch (err) {
        console.error(`Failed to notify ${contact.name}:`, err.message);
      }
    }


  //     res.json({ msg: 'SOS sent and logged successfully' });
  //   } catch (error) {
  //     console.error('❌ Error in sendSOS:', error.message);
  //     res.status(500).json({ msg: 'Server error while sending SOS' });
  //   }
  // };


  // module.exports = { sendSOS };


  res.json({
        msg: 'SOS sent and saved successfully.',
        notifiedNames,
      });
  } catch (error) {
    console.error('❌ Error in sendSOS:', error.message);
    res.status(500).json({ msg: 'Server error while sending SOS' });
  }
};


module.exports = { sendSOS };





