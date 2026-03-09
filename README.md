# SHIELD ( a group project of 3)
An sos app developed to help and guide the women of BD, when they are in emergency situation. This app is built using REACT native CLI, Expo CLI, Javascript, Typescript, MongoDB and other essential APIs and libraries.
## 🛡️The features we aimed 
The app is organized into 3 modules, each targeting key aspects of women's safety.

📍 Module 1 — Emergency Response
|Feature |Description|
|SOS Button| One-tap alert sent to all saved contacts (contacts must have the app installed)|
|Volunteer Response| Contacts receive a "Will you volunteer?" prompt; their confirmation is relayed back to the userAuto Location SharingPressing SOS automatically enables live location tracking; off by default otherwise|

📚 Module 2 — Guidance & Resources
|Feature |Description|
|Situation Guidelines| if anyone do not want to press the sos button, but needs help, as she faced some awkward or dangerous situation, this feature will give guidlines like 'what you have to do next' type. We primarily gave the characteristics of three to four such circumstance which bangladeshi women face a lot. Based on it some guidelines like call nearby policestations, or slip into nearby crowded places (supposedly marked in map) or visit our library and check that section etc| 
|Safety Library| Curated content on relevant laws, self-defense tools, and basic martial techniques|

🗺️ Module 3 — Situational Awareness & Navigation
|Feature |Description|
|Red Zone Map Alerts| Google Maps integration highlights danger zones; user receives an alert upon entering a marked area
|Location Tracking| ToggleUser can manually turn location sharing on/off at any timeNearby Safe PlacesShows nearest hospitals and police stations based on current location|

##🔧 Admin Panel
-Manage user accounts (add / delete)
-Mark and update red zones on the map based on user reports and feedback
-Mark the nearby crowded palces like- nearby hospitals, shopping places for most of the area (it will be dynamic based on user's live location information)

#⚠️  Limitations and Failures we faced

Some planned features could not be implemented due to an external constraint — Google Maps Platform API access.
Google Maps Platform requires a valid billing account with an internationally accepted credit/debit card. Without billing enabled, API access is limited to 1 request/day — effectively unusable. As student developers based in Bangladesh, we did not have access to an internationally chargeable card accepted by Google Cloud. This was a payment infrastructure limitation, not a technical one.

The following features were blocked as a result:
-FeatureStatusReasonReal-time Navigation❌ Not implementedRequires full Google Maps API accessDynamic Red Zone Updates❌ Not implementedAdmin map-editing features depend on the same API
-
##Future Scopes
- We Can Integrate AI chatbots in in Guidance system, also train the LLM with all possible scenerios, with all possible guidelines, and with all information like the lists of nearby police stations, neaby hospitals, policestations hotlines, nearby mosques and shopping malls etc
- Enhance the library section further with more updated laws, integration of some trustable, verifies online pages selling self-protection tools etc
  
