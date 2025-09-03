module.exports = async function sendAlertToContacts(contacts, message) {
    // Simulating alert sending
    contacts.forEach(contact => {
        console.log(`ALERT SENT TO ${contact}: ${message}`);
    });
};
