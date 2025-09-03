require('dotenv').config();  

const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

//const twilio = require('twilio');

//const accountSid = process.env.TWILIO_ACCOUNT_SID;
//const authToken  = process.env.TWILIO_AUTH_TOKEN;
//const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

//const dotenv = require('dotenv');
//dotenv.config();

//const client = new twilio(accountSid, authToken);


// /**
//  * Send an SMS to a list of trusted contacts
//  * @param {Array<string>} phoneNumbers - List of phone numbers
//  * @param {string} message - Message content
// */

// const sendSMSToContacts = async (phoneNumbers, message) => {
//     console.log("📞 phoneNumbers received:", phoneNumbers);
//     console.log("🔍 Type:", typeof phoneNumbers);
//     console.log("🔍 Is array?", Array.isArray(phoneNumbers));
//     for (let number of phoneNumbers) {
//         try {
//             const msg = await client.messages.create({
//                 body: message,
//                 from: process.env.TWILIO_PHONE_NUMBER,
//                 to: number
//             });
//             console.log(`✅ SMS sent to ${number}: SID ${msg.sid}`);
//         } catch (err) {
//             console.error(`❌ Failed to send SMS to ${number}`, err.message);
//         }
//     }
// };

// module.exports = sendSMSToContacts;


/**
 * Send an SMS to a list of trusted contacts
 * @param {Array<string>} phoneNumbers - List of phone numbers
 * @param {string} message - Message content
 */
const sendSMSToContacts = async (phoneNumbers, message) => {
  for (const number of phoneNumbers) {
    try {
      const response = await vonage.sms.send({
        to: number,
        from: 'ShieldSOS',
        text: message,
      });

      console.log(`✅ SMS sent to ${number}:`, response);
    } catch (err) {
      console.error(`❌ Failed to send SMS to ${number}:`, err.message);
    }
  }
};

module.exports = sendSMSToContacts;