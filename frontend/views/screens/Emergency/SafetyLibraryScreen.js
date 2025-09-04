// frontend/views/screens/Community/SafetyLibraryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  SafeAreaView
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

const SafetyLibraryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('self-defense');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const categories = [
    { id: 'self-defense', title: 'Self Defense', icon: 'shield-alt' },
    { id: 'home-safety', title: 'Home Safety', icon: 'home' },
    { id: 'legal-rights', title: 'Legal Rights', icon: 'gavel' },
    { id: 'emergency', title: 'Emergency Info', icon: 'exclamation-triangle' },
  ];

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };
  const openURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };
  const selfDefenseContent = {
    basicTips: [
      {
        title: "Stay Alert and Aware",
        description: "Always be aware of your surroundings. Avoid using headphones or phones in isolated areas.",
        icon: "eye"
      },
      {
        title: "Trust Your Instincts",
        description: "If something feels wrong, it probably is. Don't ignore your gut feelings.",
        icon: "heart"
      },
      {
        title: "Walk Confidently",
        description: "Stand tall, make eye contact, and walk with purpose. Attackers often target those who appear vulnerable.",
        icon: "walking"
      },
      {
        title: "Learn Basic Strikes",
        description: "Know how to strike vulnerable areas: eyes, nose, throat, groin, instep, and shins.",
        icon: "hand-paper"
      }
    ],
    techniques: [
      {
        title: "Palm Strike",
        description: "Use the heel of your palm to strike upward toward the attacker's nose or chin. More effective than a punch and less likely to injure your hand."
      },
      {
        title: "Knee Strike",
        description: "If grabbed from the front, drive your knee upward into the attacker's groin area with full force."
      },
      {
        title: "Elbow Strike",
        description: "If grabbed from behind, drive your elbow backward into the attacker's ribs or solar plexus."
      },
      {
        title: "Escape Grabs",
        description: "If someone grabs your wrist, rotate your arm toward their thumb (weakest point) and pull away quickly."
      }
    ]
  };

  const homeSafetyContent = {
    pepperSpray: {
      title: "DIY Pepper Spray Recipe",
      ingredients: [
        "2 tablespoons cayenne pepper powder",
        "1 tablespoon chili powder", 
        "1 cup water",
        "1 teaspoon vegetable oil",
        "Small spray bottle"
      ],
      instructions: [
        "Boil water in a pot",
        "Add cayenne pepper and chili powder",
        "Simmer for 15-20 minutes",
        "Let it cool completely",
        "Strain the mixture",
        "Add vegetable oil and mix",
        "Pour into spray bottle",
        "Test spray direction before use"
      ],
      warnings: [
        "Always test wind direction before use",
        "Keep away from children",
        "Replace every 6 months",
        "Practice using it safely"
      ]
    },
    defenseItems: [
      {
        item: "Whistle",
        effectiveness: "High",
        description: "Loud noise can scare attackers and alert others. Attach to keychain."
      },
      {
        item: "Personal Alarm",
        effectiveness: "Very High", 
        description: "120dB+ sound that can disorient attackers and draw attention."
      },
      {
        item: "Tactical Pen",
        effectiveness: "Medium",
        description: "Legal to carry, can be used for writing or as a defensive tool."
      },
      {
        item: "Keys",
        effectiveness: "Medium",
        description: "Hold keys between fingers or use as striking tool."
      },
      {
        item: "Flashlight",
        effectiveness: "Medium",
        description: "Can temporarily blind attacker and also serves as a blunt weapon."
      }
    ],
    homeTips: [
      "Always lock doors and windows",
      "Install peepholes or security cameras",
      "Keep emergency numbers readily available",
      "Have a safe room identified",
      "Don't open doors to strangers",
      "Keep curtains closed at night"
    ]
  };

  const legalRightsContent = {
    laws: [
      {
        title: "Women and Children Repression Prevention Act, 2000",
        description: "Comprehensive law addressing violence against women including rape, kidnapping, and sexual harassment.",
        penalties: "Death penalty or life imprisonment for rape; 2-10 years for sexual harassment",
        link: "http://bdlaws.minlaw.gov.bd/act-367.html"
      },
      {
        title: "Domestic Violence (Prevention and Protection) Act, 2010",
        description: "Provides protection from domestic violence and establishes support services.",
        penalties: "Fine up to Tk. 10,000 or imprisonment up to 1 year",
        link: "http://bdlaws.minlaw.gov.bd/act-1066.html"
      },
      {
        title: "The Penal Code 1860 - Section 354",
        description: "Assault or criminal force to woman with intent to outrage her modesty",
        penalties: "Imprisonment up to 2 years or fine or both",
        link: "http://bdlaws.minlaw.gov.bd/act-11.html"
      },
      {
        title: "Digital Security Act, 2018",
        description: "Addresses cyber crimes including online harassment and defamation",
        penalties: "Fine up to Tk. 5 lakh or imprisonment up to 3 years",
        link: "http://bdlaws.minlaw.gov.bd/act-1175.html"
      }
    ],
    rights: [
      "Right to file complaint without any fee",
      "Right to legal aid if cannot afford lawyer",
      "Right to protection during trial",
      "Right to compensation from the state",
      "Right to speedy trial",
      "Right to appeal against judgment"
    ],
    procedure: [
      "File FIR at nearest police station",
      "Seek medical examination if required",
      "Contact legal aid services",
      "Inform family/trusted contacts",
      "Keep all documents safe",
      "Follow up on case progress"
    ]
  };

  const emergencyContent = {
    numbers: [
      { service: "National Emergency Service", number: "999" },
      { service: "Police", number: "100" },
      { service: "Fire Service", number: "102" },
      { service: "Women & Children Helpline", number: "109" },
      { service: "One Stop Crisis Center", number: "10921" },
      { service: "Moner Bondhu (Mental Health)", number: "01779-554391" }
    ],
    organizations: [
      {
        name: "Bangladesh National Women Lawyers' Association",
        phone: "02-9661128",
        services: "Legal aid, counseling"
      },
      {
        name: "Ain O Salish Kendra (ASK)",
        phone: "02-58314751",
        services: "Legal support, human rights"
      },
      {
        name: "BLAST (Bangladesh Legal Aid and Services Trust)",
        phone: "02-9886677",
        services: "Free legal services"
      },
      {
        name: "Manusher Jonno Foundation",
        phone: "02-58815845",
        services: "Human rights support"
      }
    ],
    websites: [
      {
        name: "Ministry of Women and Children Affairs",
        url: "http://www.mowca.gov.bd",
        description: "Official government portal for women's issues"
      },
      {
        name: "Bangladesh Police",
        url: "https://www.police.gov.bd",
        description: "Official police website with complaint procedures"
      },
      {
        name: "One Stop Crisis Center",
        url: "http://www.oscc.gov.bd",
        description: "Multi-sectoral services for violence survivors"
      }
    ]
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'self-defense':
        return (
          <View>
            <Text style={styles.sectionTitle}>Basic Self Defense Tips</Text>
            {selfDefenseContent.basicTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Ionicons name={tip.icon} size={24} color="#4CAF50" />
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => openModal({ type: 'techniques', data: selfDefenseContent.techniques })}
            >
              <Text style={styles.expandButtonText}>View Defense Techniques</Text>
              <FontAwesome name="chevron-right" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        );

      case 'home-safety':
        return (
          <View>
            <Text style={styles.sectionTitle}>Home Safety & Defense Items</Text>
            
            <TouchableOpacity 
              style={styles.highlightCard}
              onPress={() => openModal({ type: 'pepperSpray', data: homeSafetyContent.pepperSpray })}
            >
              <MaterialIcons name="warning" size={24} color="#FF9800" />
              <View style={styles.highlightContent}>
                <Text style={styles.highlightTitle}>DIY Pepper Spray Recipe</Text>
                <Text style={styles.highlightDescription}>Learn to make pepper spray at home</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#FF9800" />
            </TouchableOpacity>

            <Text style={styles.subsectionTitle}>Defense Items Effectiveness</Text>
            {homeSafetyContent.defenseItems.map((item, index) => (
              <View key={index} style={styles.defenseItem}>
                <View style={styles.defenseHeader}>
                  <Text style={styles.itemName}>{item.item}</Text>
                  <View style={[styles.effectivenessBadge, { 
                    backgroundColor: item.effectiveness === 'Very High' ? '#4CAF50' : 
                                   item.effectiveness === 'High' ? '#8BC34A' : '#FFC107' 
                  }]}>
                    <Text style={styles.effectivenessText}>{item.effectiveness}</Text>
                  </View>
                </View>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            ))}

            <Text style={styles.subsectionTitle}>Home Security Tips</Text>
            {homeSafetyContent.homeTips.map((tip, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{tip}</Text>
              </View>
            ))}
          </View>
        );

      case 'legal-rights':
        return (
          <View>
            <Text style={styles.sectionTitle}>Bangladesh Laws for Women's Protection</Text>
            {legalRightsContent.laws.map((law, index) => (
              <View key={index} style={styles.lawCard}>
                <Text style={styles.lawTitle}>{law.title}</Text>
                <Text style={styles.lawDescription}>{law.description}</Text>
                <Text style={styles.lawPenalty}>Penalties: {law.penalties}</Text>
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={() => openURL(law.link)}
                >
                  <Text style={styles.linkText}>Read Full Law</Text>
                  <FontAwesome name="external-link" size={14} color="#2196F3" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => openModal({ type: 'rights', data: legalRightsContent })}
            >
              <Text style={styles.expandButtonText}>Your Legal Rights & Procedures</Text>
              <FontAwesome name="chevron-right" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        );

      case 'emergency':
        return (
          <View>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            {emergencyContent.numbers.map((contact, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.emergencyContact}
                onPress={() => Linking.openURL(`tel:${contact.number}`)}
              >
                <FontAwesome name="phone" size={20} color="#F44336" />
                <View style={styles.contactInfo}>
                  <Text style={styles.serviceName}>{contact.service}</Text>
                  <Text style={styles.phoneNumber}>{contact.number}</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#666" />
              </TouchableOpacity>
            ))}

            <Text style={styles.subsectionTitle}>Support Organizations</Text>
            {emergencyContent.organizations.map((org, index) => (
              <View key={index} style={styles.organizationCard}>
                <Text style={styles.orgName}>{org.name}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${org.phone}`)}>
                  <Text style={styles.orgPhone}>{org.phone}</Text>
                </TouchableOpacity>
                <Text style={styles.orgServices}>{org.services}</Text>
              </View>
            ))}

            <Text style={styles.subsectionTitle}>Useful Websites</Text>
            {emergencyContent.websites.map((site, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.websiteCard}
                onPress={() => openURL(site.url)}
              >
                <View>
                  <Text style={styles.siteName}>{site.name}</Text>
                  <Text style={styles.siteDescription}>{site.description}</Text>
                  <Text style={styles.siteUrl}>{site.url}</Text>
                </View>
                <FontAwesome name="external-link" size={16} color="#2196F3" />
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!modalContent) return null;

    if (modalContent.type === 'techniques') {
      return (
        <ScrollView style={styles.modalScroll}>
          <Text style={styles.modalTitle}>Self Defense Techniques</Text>
          {modalContent.data.map((technique, index) => (
            <View key={index} style={styles.techniqueCard}>
              <Text style={styles.techniqueName}>{technique.title}</Text>
              <Text style={styles.techniqueDescription}>{technique.description}</Text>
            </View>
          ))}
          <Text style={styles.warningText}>
            ⚠️ These techniques are for emergency self-defense only. Consider taking a professional self-defense class.
          </Text>
        </ScrollView>
      );
    }

    if (modalContent.type === 'pepperSpray') {
      const data = modalContent.data;
      return (
        <ScrollView style={styles.modalScroll}>
          <Text style={styles.modalTitle}>{data.title}</Text>
          
          <Text style={styles.modalSubtitle}>Ingredients:</Text>
          {data.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
          ))}

          <Text style={styles.modalSubtitle}>Instructions:</Text>
          {data.instructions.map((step, index) => (
            <Text key={index} style={styles.instruction}>{index + 1}. {step}</Text>
          ))}

          <Text style={styles.modalSubtitle}>⚠️ Important Warnings:</Text>
          {data.warnings.map((warning, index) => (
            <Text key={index} style={styles.warning}>• {warning}</Text>
          ))}
        </ScrollView>
      );
    }

    if (modalContent.type === 'rights') {
      const data = modalContent.data;
      return (
        <ScrollView style={styles.modalScroll}>
          <Text style={styles.modalTitle}>Your Legal Rights</Text>
          {data.rights.map((right, index) => (
            <Text key={index} style={styles.rightItem}>• {right}</Text>
          ))}

          <Text style={styles.modalSubtitle}>Complaint Procedure:</Text>
          {data.procedure.map((step, index) => (
            <Text key={index} style={styles.procedureStep}>{index + 1}. {step}</Text>
          ))}
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Library</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.categorySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <FontAwesome 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? '#fff' : '#4CAF50'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {renderModal()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categorySelector: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  activeCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  expandButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  highlightContent: {
    flex: 1,
    marginLeft: 12,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  highlightDescription: {
    fontSize: 14,
    color: '#666',
  },
  defenseItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  defenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  effectivenessBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  effectivenessText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lawCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  lawTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lawDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  lawPenalty: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    marginRight: 8,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneNumber: {
    fontSize: 18,
    color: '#F44336',
    fontWeight: 'bold',
  },
  organizationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orgPhone: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orgServices: {
    fontSize: 14,
    color: '#666',
  },
  websiteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  siteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  siteDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  siteUrl: {
    fontSize: 12,
    color: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  techniqueCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  techniqueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  techniqueDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  warningText: {
    fontSize: 14,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  ingredient: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  warning: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 4,
  },
  rightItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  procedureStep: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
});