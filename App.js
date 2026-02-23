import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const CUISINES = [
  'All',
  'Oaxacan',
  'Bengali',
  'Ethiopian',
  'Persian',
  'Filipino',
  'Lebanese',
  'Korean',
  'Nigerian',
  'Gujarati',
];

const SEED_COOKS = [
  {
    id: 'cook-1',
    name: 'Marisol Ruiz',
    culture: 'Oaxacan',
    location: 'Echo Park',
    story:
      'Third-generation cook sharing mole recipes from my abuela, now adapted for LA farmers markets.',
    priceRange: '$$',
    dishPrices: {
      'Mole negro plate': '$18',
      Tlayudas: '$14',
      'Hoja santa tamales': '$16',
    },
    rating: 4.9,
    preOrderHours: 24,
    dishes: ['Mole negro plate', 'Tlayudas', 'Hoja santa tamales'],
    tags: ['Family recipe', 'Spice-forward', 'Vegetarian options'],
  },
  {
    id: 'cook-2',
    name: 'Arif Hasan',
    culture: 'Bengali',
    location: 'Culver City',
    story:
      'Retired engineer cooking coastal Bengali dinners with mustard oils and seasonal seafood.',
    priceRange: '$$',
    dishPrices: {
      'Mustard fish curry': '$19',
      'Khichuri feast': '$15',
      'Mishti doi': '$8',
    },
    rating: 4.8,
    preOrderHours: 36,
    dishes: ['Mustard fish curry', 'Khichuri feast', 'Mishti doi'],
    tags: ['Comforting', 'Seafood', 'Gluten-free'],
  },
  {
    id: 'cook-3',
    name: 'Selam Bekele',
    culture: 'Ethiopian',
    location: 'Koreatown',
    story:
      'Cooking from a shared community kitchen with recipes from Addis family celebrations.',
    priceRange: '$',
    dishPrices: {
      'Doro wat platter': '$17',
      'Vegan injera set': '$14',
      'Shiro stew': '$13',
    },
    rating: 4.7,
    preOrderHours: 24,
    dishes: ['Doro wat platter', 'Vegan injera set', 'Shiro stew'],
    tags: ['Plant-forward', 'Family style', 'Spicy'],
  },
  {
    id: 'cook-4',
    name: 'Farah Yazdi',
    culture: 'Persian',
    location: 'Santa Monica',
    story:
      'Modern Persian meal prep with herb-heavy stews and saffron rice.',
    priceRange: '$$$',
    dishPrices: {
      'Ghormeh sabzi': '$22',
      'Zereshk polo': '$20',
      'Kashk-e bademjan': '$16',
    },
    rating: 5.0,
    preOrderHours: 48,
    dishes: ['Ghormeh sabzi', 'Zereshk polo', 'Kashk-e bademjan'],
    tags: ['Meal prep', 'Herbaceous', 'Saffron'],
  },
];

const ADMIN_SEED = [
  {
    id: 'signup-1',
    name: 'Lan Nguyen',
    culture: 'Vietnamese',
    location: 'Alhambra',
    story: 'Street-food inspired banh mi and pho with homemade broths.',
    status: 'pending',
  },
];

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4.1-mini';
const TAB_ITEMS = [
  { key: 'discover', label: 'Discover', icon: 'compass-outline', iconActive: 'compass' },
  { key: 'signup', label: 'Sign Up', icon: 'create-outline', iconActive: 'create' },
  { key: 'assistant', label: 'Assistant', icon: 'chatbubble-ellipses-outline', iconActive: 'chatbubble-ellipses' },
];

const extractAssistantText = (data) => {
  const topLevel = typeof data?.output_text === 'string' ? data.output_text.trim() : '';
  if (topLevel) return topLevel;

  const contentItems = Array.isArray(data?.output)
    ? data.output.flatMap((item) => (Array.isArray(item?.content) ? item.content : []))
    : [];

  const contentText = contentItems
    .map((item) => {
      if (typeof item?.text === 'string') return item.text;
      if (typeof item?.output_text === 'string') return item.output_text;
      if (typeof item?.value === 'string') return item.value;
      return '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();

  return contentText;
};

const getDishPrice = (cook, dish) => cook?.dishPrices?.[dish] || '$--';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [cooks, setCooks] = useState(SEED_COOKS);
  const [signups, setSignups] = useState(ADMIN_SEED);
  const [orders, setOrders] = useState([]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [selectedCook, setSelectedCook] = useState(null);
  const [selectedDish, setSelectedDish] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      text: 'Hi, I am your HomeTable assistant. Ask me what to order, what fits your diet, or how preorder timing works.',
    },
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  const [signupForm, setSignupForm] = useState({
    name: '',
    culture: '',
    location: '',
    story: '',
    dishes: '',
  });

  const [requestForm, setRequestForm] = useState({
    name: '',
    contact: '',
    address: '',
    date: '',
    timeWindow: '',
    quantity: '2',
    notes: '',
  });

  const filteredCooks = useMemo(() => {
    if (activeCuisine === 'All') return cooks;
    return cooks.filter((cook) => cook.culture === activeCuisine);
  }, [activeCuisine, cooks]);

  const openRequest = (cook, dish) => {
    setSelectedCook(cook);
    setSelectedDish(dish || cook.dishes[0]);
    setRequestOpen(true);
  };

  const submitRequest = () => {
    if (!requestForm.name || !requestForm.contact || !requestForm.date) {
      Alert.alert('Missing details', 'Please add your name, contact, and date.');
      return;
    }
    const newOrder = {
      id: `order-${orders.length + 1}`,
      cookId: selectedCook?.id,
      cookName: selectedCook?.name,
      dish: selectedDish,
      ...requestForm,
      status: 'new',
    };
    setOrders([newOrder, ...orders]);
    setRequestForm({
      name: '',
      contact: '',
      address: '',
      date: '',
      timeWindow: '',
      quantity: '2',
      notes: '',
    });
    setRequestOpen(false);
    Alert.alert('Request sent', 'Your order request was sent to the cook.');
  };

  const submitSignup = () => {
    if (!signupForm.name || !signupForm.culture || !signupForm.location) {
      Alert.alert('Missing details', 'Please add your name, cuisine, and location.');
      return;
    }
    const newSignup = {
      id: `signup-${signups.length + 1}`,
      ...signupForm,
      status: 'pending',
    };
    setSignups([newSignup, ...signups]);
    setSignupForm({ name: '', culture: '', location: '', story: '', dishes: '' });
    Alert.alert('Thanks for signing up', 'We will review your profile shortly.');
  };

  const approveSignup = (signupId) => {
    const signup = signups.find((item) => item.id === signupId);
    if (!signup) return;
    setSignups((prev) =>
      prev.map((item) =>
        item.id === signupId ? { ...item, status: 'approved' } : item
      )
    );
    setCooks((prev) => [
      {
        id: `cook-${prev.length + 1}`,
        name: signup.name,
        culture: signup.culture,
        location: signup.location,
        story: signup.story || 'New HomeTable cook profile pending full bio.',
        priceRange: '$$',
        rating: 5.0,
        preOrderHours: 24,
        dishes: signup.dishes ? signup.dishes.split(',').map((d) => d.trim()) : ['Signature dish'],
        dishPrices: {},
        tags: ['New cook'],
      },
      ...prev,
    ]);
  };

  const cookContext = useMemo(() => {
    return cooks
      .map((cook) => {
        const dishesWithPrices = cook.dishes
          .map((dish) => `${dish} (${getDishPrice(cook, dish)})`)
          .join(', ');
        return `${cook.name} (${cook.culture}, ${cook.location}) | Dishes: ${dishesWithPrices} | Tags: ${cook.tags.join(', ')} | Preorder: ${cook.preOrderHours}h`;
      })
      .join('\n');
  }, [cooks]);

  const buildFallbackReply = (message) => {
    const normalized = message.toLowerCase();
    if (normalized.includes('recommend') || normalized.includes('suggest')) {
      return 'Try Bengali mustard fish curry, Ethiopian vegan injera set, or Persian ghormeh sabzi.';
    }
    if (normalized.includes('vegetarian') || normalized.includes('vegan')) {
      return 'Vegetarian-friendly picks: Tlayudas, Vegan injera set, and Kashk-e bademjan.';
    }
    return 'I can help with recommendations, dietary filters, and preorder timing.';
  };

  const getAssistantReply = async (message) => {
    if (!OPENAI_API_KEY) {
      return 'Missing OpenAI key. Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file and restart Expo.';
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text:
                  'You are HomeTable Assistant. Give concise food and preorder guidance based only on listed cooks. If data is missing, say so clearly.',
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `Cook catalog:\n${cookContext}\n\nUser question: ${message}`,
              },
            ],
          },
        ],
        max_output_tokens: 240,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const outputText = extractAssistantText(data);
    if (outputText) return outputText;

    const statusReason = data?.status ? ` (status: ${data.status})` : '';
    throw new Error(`OpenAI returned no text content${statusReason}`);
  };

  const sendMessage = async () => {
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage || isAssistantLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedMessage,
    };

    setChatInput('');
    setChatMessages((prev) => [...prev, userMessage]);
    setIsAssistantLoading(true);

    try {
      const assistantText = await getAssistantReply(trimmedMessage);
      const assistantMessage = {
        id: `assistant-${Date.now() + 1}`,
        role: 'assistant',
        text: assistantText,
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage = {
        id: `assistant-${Date.now() + 1}`,
        role: 'assistant',
        text:
          typeof error?.message === 'string' && error.message
            ? `Assistant error: ${error.message}`
            : buildFallbackReply(trimmedMessage),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
      Alert.alert('Assistant temporarily unavailable', 'Check the error shown in chat and your terminal logs.');
      console.error(error);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>HomeTable</Text>
        <Text style={styles.subtitle}>Los Angeles preorder marketplace</Text>
      </View>

      <View style={styles.screenContent}>
        {activeTab === 'discover' && (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Explore by culture</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {CUISINES.map((cuisine) => (
                  <Pressable
                    key={cuisine}
                    onPress={() => setActiveCuisine(cuisine)}
                    style={[styles.chip, activeCuisine === cuisine && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, activeCuisine === cuisine && styles.chipTextActive]}>{cuisine}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured home cooks</Text>
              {filteredCooks.map((cook) => (
                <View key={cook.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{cook.name}</Text>
                      <Text style={styles.cardMeta}>{cook.culture} • {cook.location}</Text>
                    </View>
                    <View style={styles.ratingPill}>
                      <Text style={styles.ratingText}>{cook.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardStory}>{cook.story}</Text>
                  <View style={styles.tagRow}>
                    {cook.tags.map((tag) => (
                      <Text key={tag} style={styles.tag}>{tag}</Text>
                    ))}
                  </View>
                  <Text style={styles.dishLabel}>Popular dishes</Text>
                  {cook.dishes.map((dish) => (
                    <Pressable key={dish} onPress={() => openRequest(cook, dish)} style={styles.dishRow}>
                      <Text style={styles.dishName}>{dish}</Text>
                      <View style={styles.dishMeta}>
                        <Text style={styles.dishPrice}>{getDishPrice(cook, dish)}</Text>
                        <Text style={styles.dishAction}>Request</Text>
                      </View>
                    </Pressable>
                  ))}
                  <View style={styles.cardFooter}>
                    <Text style={styles.preorder}>Preorder {cook.preOrderHours}h notice</Text>
                    <Text style={styles.price}>{cook.priceRange}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {activeTab === 'signup' && (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Become a HomeTable cook</Text>
              <Text style={styles.sectionCopy}>
                Share your cultural recipes with neighbors. We prioritize authentic stories and pre-order planning.
              </Text>
              <FormField
                label="Your name"
                value={signupForm.name}
                onChangeText={(text) => setSignupForm({ ...signupForm, name: text })}
                placeholder="Chef name"
              />
              <FormField
                label="Cuisine / region"
                value={signupForm.culture}
                onChangeText={(text) => setSignupForm({ ...signupForm, culture: text })}
                placeholder="Burmese, Puerto Rican, etc."
              />
              <FormField
                label="Neighborhood"
                value={signupForm.location}
                onChangeText={(text) => setSignupForm({ ...signupForm, location: text })}
                placeholder="Leimert Park"
              />
              <FormField
                label="Short story"
                value={signupForm.story}
                onChangeText={(text) => setSignupForm({ ...signupForm, story: text })}
                placeholder="Why you cook"
                multiline
              />
              <FormField
                label="Signature dishes (comma separated)"
                value={signupForm.dishes}
                onChangeText={(text) => setSignupForm({ ...signupForm, dishes: text })}
                placeholder="Jollof rice, suya, puff puff"
              />
              <PrimaryButton label="Submit application" onPress={submitSignup} />
            </View>
          </ScrollView>
        )}

        {activeTab === 'assistant' && (
          <View style={styles.assistantContainer}>
            <ScrollView contentContainerStyle={styles.assistantMessages}>
              {chatMessages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.chatBubble,
                    message.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAssistant,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatText,
                      message.role === 'user' ? styles.chatTextUser : styles.chatTextAssistant,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              ))}
              {isAssistantLoading && (
                <View style={[styles.chatBubble, styles.chatBubbleAssistant]}>
                  <Text style={[styles.chatText, styles.chatTextAssistant]}>Thinking...</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask the assistant..."
                placeholderTextColor="#B6A89B"
                style={styles.chatInput}
              />
              <Pressable
                onPress={sendMessage}
                disabled={isAssistantLoading}
                style={[styles.chatSendButton, isAssistantLoading && styles.chatSendButtonDisabled]}
              >
                <Text style={styles.chatSendText}>Send</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <View style={styles.bottomNav}>
        {TAB_ITEMS.map((item) => (
          <TabButton
            key={item.key}
            label={item.label}
            icon={item.icon}
            iconActive={item.iconActive}
            active={activeTab === item.key}
            onPress={() => setActiveTab(item.key)}
          />
        ))}
      </View>

      <Modal visible={requestOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Request order</Text>
            <Text style={styles.modalSubtitle}>
              {selectedCook?.name} • {selectedCook?.culture}
            </Text>
            <Text style={styles.modalLabel}>Select dish</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dishPicker}>
              {selectedCook?.dishes.map((dish) => (
                <Pressable
                  key={dish}
                  onPress={() => setSelectedDish(dish)}
                  style={[styles.dishChip, selectedDish === dish && styles.dishChipActive]}
                >
                  <Text style={[styles.dishChipText, selectedDish === dish && styles.dishChipTextActive]}>{dish}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <FormField
              label="Your name"
              value={requestForm.name}
              onChangeText={(text) => setRequestForm({ ...requestForm, name: text })}
              placeholder="Customer name"
            />
            <FormField
              label="Phone or email"
              value={requestForm.contact}
              onChangeText={(text) => setRequestForm({ ...requestForm, contact: text })}
              placeholder="name@email.com"
            />
            <FormField
              label="Delivery address"
              value={requestForm.address}
              onChangeText={(text) => setRequestForm({ ...requestForm, address: text })}
              placeholder="Street, city"
            />
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <FormField
                  label="Date"
                  value={requestForm.date}
                  onChangeText={(text) => setRequestForm({ ...requestForm, date: text })}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={styles.rowItem}>
                <FormField
                  label="Time window"
                  value={requestForm.timeWindow}
                  onChangeText={(text) => setRequestForm({ ...requestForm, timeWindow: text })}
                  placeholder="5-7 PM"
                />
              </View>
            </View>
            <FormField
              label="Servings"
              value={requestForm.quantity}
              onChangeText={(text) => setRequestForm({ ...requestForm, quantity: text })}
              placeholder="2"
              keyboardType="number-pad"
            />
            <FormField
              label="Notes"
              value={requestForm.notes}
              onChangeText={(text) => setRequestForm({ ...requestForm, notes: text })}
              placeholder="Allergies, spice level, etc."
              multiline
            />

            <View style={styles.modalActions}>
              <Pressable onPress={() => setRequestOpen(false)} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submitRequest} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Send request</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function TabButton({ label, icon, iconActive, active, onPress }) {
  const iconName = active ? iconActive : icon;
  return (
    <Pressable onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Ionicons name={iconName} size={20} color={active ? '#3A2E24' : '#8A7462'} />
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function FormField({ label, value, onChangeText, placeholder, multiline, keyboardType }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B6A89B"
        multiline={multiline}
        keyboardType={keyboardType}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

function PrimaryButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const serifFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F0E8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: serifFont,
    color: '#3A2E24',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6E5A4A',
    marginTop: 4,
  },
  screenContent: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFF8F1',
    borderTopWidth: 1,
    borderTopColor: '#E7D6C7',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: '#EFE3D8',
  },
  tabButtonText: {
    color: '#8A7462',
    fontSize: 11,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#3A2E24',
  },
  content: {
    padding: 20,
    paddingBottom: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: serifFont,
    color: '#3A2E24',
  },
  sectionCopy: {
    color: '#6E5A4A',
    marginTop: 8,
    marginBottom: 12,
  },
  chipRow: {
    paddingVertical: 12,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#EFE3D8',
    borderRadius: 20,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: '#D57A4E',
  },
  chipText: {
    color: '#6E5A4A',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#FFF6EE',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF8F1',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E7D6C7',
    shadowColor: '#2E2218',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: serifFont,
    color: '#3A2E24',
  },
  cardMeta: {
    color: '#6E5A4A',
    fontSize: 12,
    marginTop: 2,
  },
  ratingPill: {
    backgroundColor: '#4E7C59',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#F7F0E8',
    fontWeight: '600',
  },
  cardStory: {
    color: '#4A3B2F',
    marginTop: 12,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#EFE3D8',
    color: '#6E5A4A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    fontSize: 11,
    marginRight: 8,
    marginBottom: 6,
  },
  dishLabel: {
    marginTop: 10,
    color: '#6E5A4A',
    fontSize: 12,
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE3D8',
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dishPrice: {
    color: '#4A3B2F',
    fontWeight: '600',
  },
  dishName: {
    color: '#3A2E24',
  },
  dishAction: {
    color: '#D57A4E',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  preorder: {
    color: '#6E5A4A',
    fontSize: 12,
  },
  price: {
    color: '#3A2E24',
    fontWeight: '600',
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#6E5A4A',
    marginBottom: 6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#FFF8F1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E7D6C7',
    color: '#3A2E24',
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#D57A4E',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFF6EE',
    fontWeight: '600',
  },
  subhead: {
    fontSize: 16,
    marginTop: 16,
    color: '#3A2E24',
    fontFamily: serifFont,
  },
  adminCard: {
    backgroundColor: '#FFF8F1',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E7D6C7',
  },
  adminName: {
    fontSize: 16,
    color: '#3A2E24',
  },
  adminMeta: {
    color: '#6E5A4A',
    marginTop: 4,
  },
  adminStory: {
    color: '#6E5A4A',
    marginTop: 6,
  },
  emptyText: {
    color: '#9B8573',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 18, 12, 0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFF8F1',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: serifFont,
    color: '#3A2E24',
  },
  modalSubtitle: {
    color: '#6E5A4A',
    marginTop: 4,
  },
  modalLabel: {
    marginTop: 12,
    color: '#6E5A4A',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dishPicker: {
    paddingVertical: 10,
  },
  dishChip: {
    backgroundColor: '#EFE3D8',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  dishChipActive: {
    backgroundColor: '#3A2E24',
  },
  dishChipText: {
    color: '#6E5A4A',
    fontSize: 12,
  },
  dishChipTextActive: {
    color: '#FFF6EE',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#D57A4E',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#D57A4E',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  assistantContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 0,
    paddingTop: 14,
  },
  assistantMessages: {
    paddingBottom: 12,
  },
  chatBubble: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: '88%',
  },
  chatBubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF8F1',
    borderWidth: 1,
    borderColor: '#E7D6C7',
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#3A2E24',
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatTextAssistant: {
    color: '#3A2E24',
  },
  chatTextUser: {
    color: '#FFF6EE',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 'auto',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#FFF8F1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7D6C7',
    color: '#3A2E24',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chatSendButton: {
    backgroundColor: '#D57A4E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chatSendButtonDisabled: {
    opacity: 0.6,
  },
  chatSendText: {
    color: '#FFF6EE',
    fontWeight: '600',
  },
});
