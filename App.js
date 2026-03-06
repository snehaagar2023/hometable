import React, { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Image,
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
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ANY_FILTER = 'Any';

const CUISINES = [
  ANY_FILTER, 'Oaxacan', 'Bengali', 'Ethiopian',
  'Persian', 'Filipino', 'Lebanese', 'Korean', 'Nigerian', 'Gujarati',
];
const DIETARY_OPTIONS = [ANY_FILTER, 'Vegetarian', 'Vegan', 'Gluten-free', 'Seafood'];
const PRICE_OPTIONS = [ANY_FILTER, '$', '$$', '$$$'];
const RATING_OPTIONS = ['Any', '4.5+', '4.8+', '5.0'];

// Real Unsplash food images
const SEED_COOKS = [
  {
    id: 'cook-1',
    name: 'Marisol Ruiz',
    culture: 'Oaxacan',
    location: 'Echo Park',
    chefImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    profileImage: 'https://i.pravatar.cc/200?img=32',
    story: 'Third-generation cook sharing mole recipes from my abuela, now adapted for LA farmers markets.',
    priceRange: '$$',
    dishPrices: { 'Mole negro plate': '$18', 'Tlayudas': '$14', 'Hoja santa tamales': '$16' },
    rating: 4.9,
    preOrderHours: 24,
    dishes: [
      {
        name: 'Mole negro plate',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
        description: 'Chicken in rich mole with sesame rice.',
      },
      {
        name: 'Tlayudas',
        image: 'https://images.unsplash.com/photo-1570461226513-e08b58a52c53?w=600&q=80',
        description: 'Crispy Oaxacan tortilla with beans and quesillo.',
      },
      {
        name: 'Hoja santa tamales',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80',
        description: 'Steamed tamales wrapped in fragrant hoja santa.',
      },
    ],
    tags: ['Family recipe', 'Spice-forward', 'Vegetarian options'],
    dietary: ['Vegetarian options'],
    ecoFriendly: true,
  },
  {
    id: 'cook-2',
    name: 'Arif Hasan',
    culture: 'Bengali',
    location: 'Culver City',
    chefImage: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80',
    profileImage: 'https://i.pravatar.cc/200?img=15',
    story: 'Retired engineer cooking coastal Bengali dinners with mustard oils and seasonal seafood.',
    priceRange: '$$',
    dishPrices: { 'Mustard fish curry': '$19', 'Khichuri feast': '$15', 'Mishti doi': '$8' },
    rating: 4.8,
    preOrderHours: 36,
    dishes: [
      {
        name: 'Mustard fish curry',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
        description: 'Salmon in mustard gravy with steamed rice.',
      },
      {
        name: 'Khichuri feast',
        image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&q=80',
        description: 'Rainy-day lentil rice meal with pickles and sides.',
      },
      {
        name: 'Mishti doi',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
        description: 'Caramelized sweet yogurt served chilled.',
      },
    ],
    tags: ['Comforting', 'Seafood', 'Gluten-free'],
    dietary: ['Gluten-free'],
    ecoFriendly: false,
  },
  {
    id: 'cook-3',
    name: 'Selam Bekele',
    culture: 'Ethiopian',
    location: 'Koreatown',
    chefImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    profileImage: 'https://i.pravatar.cc/200?img=48',
    story: 'Cooking from a shared community kitchen with recipes from Addis family celebrations.',
    priceRange: '$',
    dishPrices: { 'Doro wat platter': '$17', 'Vegan injera set': '$14', 'Shiro stew': '$13' },
    rating: 4.7,
    preOrderHours: 24,
    dishes: [
      {
        name: 'Doro wat platter',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
        description: 'Slow cooked chicken stew with eggs and injera.',
      },
      {
        name: 'Vegan injera set',
        image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=600&q=80',
        description: 'Colorful vegan combos for sharing.',
      },
      {
        name: 'Shiro stew',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
        description: 'Silky chickpea stew with berbere spices.',
      },
    ],
    tags: ['Plant-forward', 'Family style', 'Spicy'],
    dietary: ['Vegan', 'Vegetarian'],
    ecoFriendly: true,
  },
  {
    id: 'cook-4',
    name: 'Farah Yazdi',
    culture: 'Persian',
    location: 'Santa Monica',
    chefImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    profileImage: 'https://i.pravatar.cc/200?img=20',
    story: 'Modern Persian meal prep with herb-heavy stews and saffron rice.',
    priceRange: '$$$',
    dishPrices: { 'Ghormeh sabzi': '$22', 'Zereshk polo': '$20', 'Kashk-e bademjan': '$16' },
    rating: 5.0,
    preOrderHours: 48,
    dishes: [
      {
        name: 'Ghormeh sabzi',
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
        description: 'Herb stew with kidney beans and dried lime.',
      },
      {
        name: 'Zereshk polo',
        image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80',
        description: 'Saffron rice with barberries and roasted chicken.',
      },
      {
        name: 'Kashk-e bademjan',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
        description: 'Smoky eggplant dip with mint and whey.',
      },
    ],
    tags: ['Meal prep', 'Herbaceous', 'Saffron'],
    dietary: ['Vegetarian options'],
    ecoFriendly: true,
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
  return contentItems.map((item) => item?.text || item?.output_text || item?.value || '').filter(Boolean).join('\n').trim();
};

const getDishPrice = (cook, dish) => cook?.dishPrices?.[dish] || '$--';
const FALLBACK_DISH_IMAGE = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80';
const FALLBACK_PROFILE_IMAGE = 'https://i.pravatar.cc/200?img=11';

const getMinRatingFromFilter = (r) => r === '4.5+' ? 4.5 : r === '4.8+' ? 4.8 : r === '5.0' ? 5.0 : 0;

const normalizeDish = (cook, dish) => {
  if (typeof dish === 'string') return { name: dish, image: FALLBACK_DISH_IMAGE, description: '', price: getDishPrice(cook, dish) };
  const name = dish?.name || 'Signature dish';
  return { ...dish, name, image: dish?.image || FALLBACK_DISH_IMAGE, description: dish?.description || '', price: dish?.price || getDishPrice(cook, name) };
};

const getCookDishes = (cook) => (cook?.dishes || []).map((d) => normalizeDish(cook, d));

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg: '#0F0A06',
  surface: '#1A1208',
  card: '#1E1510',
  cardBorder: '#2E2018',
  accent: '#E8633A',
  accentLight: '#F0855A',
  accentDark: '#C04A22',
  gold: '#D4A853',
  cream: '#F5EDD6',
  creamDim: '#C8B898',
  textPrimary: '#F5EDD6',
  textSecondary: '#9A8060',
  textMuted: '#5A4530',
  white: '#FFFFFF',
  overlay: 'rgba(10,6,2,0.55)',
  navBg: '#120D08',
};

const serifFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [activeCuisine, setActiveCuisine] = useState(ANY_FILTER);
  const [activeLocation, setActiveLocation] = useState(ANY_FILTER);
  const [activeDietary, setActiveDietary] = useState(ANY_FILTER);
  const [activePrice, setActivePrice] = useState(ANY_FILTER);
  const [activeRating, setActiveRating] = useState('Any');
  const [ecoOnly, setEcoOnly] = useState(false);
  const [activeFilterMenu, setActiveFilterMenu] = useState('');
  const [cooks, setCooks] = useState(SEED_COOKS);
  const [signups, setSignups] = useState(ADMIN_SEED);
  const [orders, setOrders] = useState([]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [selectedCook, setSelectedCook] = useState(null);
  const [selectedDish, setSelectedDish] = useState('');
  const [selectedChefId, setSelectedChefId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 'welcome', role: 'assistant', text: 'Hi! I\'m your HomeTable assistant. Ask me what to order, what fits your diet, or how preorder timing works.' },
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: '', culture: '', location: '', story: '', dishes: '' });
  const [requestForm, setRequestForm] = useState({ name: '', contact: '', address: '', date: '', timeWindow: '', quantity: '2', notes: '' });

  const locationOptions = useMemo(() => [ANY_FILTER, ...new Set(cooks.map((c) => c.location))], [cooks]);

  const filteredCooks = useMemo(() => {
    const minRating = getMinRatingFromFilter(activeRating);
    return cooks.filter((cook) => {
      const matchesCuisine = activeCuisine === ANY_FILTER || cook.culture === activeCuisine;
      const matchesLocation = activeLocation === ANY_FILTER || cook.location === activeLocation;
      const matchesDietary = activeDietary === ANY_FILTER || (cook.dietary || []).some((t) => t.toLowerCase().includes(activeDietary.toLowerCase()));
      const matchesPrice = activePrice === ANY_FILTER || cook.priceRange === activePrice;
      return matchesCuisine && matchesLocation && matchesDietary && matchesPrice && cook.rating >= minRating && (!ecoOnly || cook.ecoFriendly);
    });
  }, [activeCuisine, activeLocation, activeDietary, activePrice, activeRating, ecoOnly, cooks]);

  const openRequest = (cook, dish) => {
    setSelectedCook(cook);
    setSelectedDish(dish || getCookDishes(cook)[0]?.name || '');
    setRequestOpen(true);
  };

  const submitRequest = () => {
    if (!requestForm.name || !requestForm.contact || !requestForm.date) {
      Alert.alert('Missing details', 'Please add your name, contact, and date.'); return;
    }
    setOrders([{ id: `order-${orders.length + 1}`, cookId: selectedCook?.id, cookName: selectedCook?.name, dish: selectedDish, ...requestForm, status: 'new' }, ...orders]);
    setRequestForm({ name: '', contact: '', address: '', date: '', timeWindow: '', quantity: '2', notes: '' });
    setRequestOpen(false);
    Alert.alert('Request sent ✓', 'Your order request was sent to the cook.');
  };

  const submitSignup = () => {
    if (!signupForm.name || !signupForm.culture || !signupForm.location) {
      Alert.alert('Missing details', 'Please add your name, cuisine, and location.'); return;
    }
    setSignups([{ id: `signup-${signups.length + 1}`, ...signupForm, status: 'pending' }, ...signups]);
    setSignupForm({ name: '', culture: '', location: '', story: '', dishes: '' });
    Alert.alert('Application submitted', 'We\'ll review your profile shortly.');
  };

  const cookContext = useMemo(() =>
    cooks.map((cook) => {
      const dishesStr = getCookDishes(cook).map((d) => `${d.name} (${d.price})`).join(', ');
      return `${cook.name} (${cook.culture}, ${cook.location}) | Dishes: ${dishesStr} | Tags: ${(cook.tags || []).join(', ')} | Preorder: ${cook.preOrderHours}h`;
    }).join('\n'), [cooks]);

  const selectedChef = useMemo(() => cooks.find((c) => c.id === selectedChefId) || null, [cooks, selectedChefId]);

  const getAssistantReply = async (message) => {
    if (!OPENAI_API_KEY) return 'Missing OpenAI key. Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file.';
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: 'You are HomeTable Assistant. Give concise food and preorder guidance based only on listed cooks.' }] },
          { role: 'user', content: [{ type: 'input_text', text: `Cook catalog:\n${cookContext}\n\nUser question: ${message}` }] },
        ],
        max_output_tokens: 240,
      }),
    });
    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json();
    const text = extractAssistantText(data);
    if (text) return text;
    throw new Error('No text returned');
  };

  const sendMessage = async () => {
    const msg = chatInput.trim();
    if (!msg || isAssistantLoading) return;
    setChatInput('');
    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: msg }]);
    setIsAssistantLoading(true);
    try {
      const reply = await getAssistantReply(msg);
      setChatMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: reply }]);
    } catch (e) {
      setChatMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: 'I can help with recommendations, dietary filters, and preorder timing.' }]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>HomeTable</Text>
          <Text style={s.headerSub}>Los Angeles preorder marketplace</Text>
        </View>
        <View style={s.headerDot} />
      </View>

      {/* ── Screens ── */}
      <View style={s.screenContent}>

        {/* DISCOVER */}
        {activeTab === 'discover' && (
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

            {!selectedChef && (
              <>
                {/* Hero banner */}
                <View style={s.heroBanner}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80' }} style={s.heroBannerImage} />
                  <View style={s.heroBannerOverlay} />
                  <View style={s.heroBannerContent}>
                    <Text style={s.heroBannerEye}>AUTHENTIC · HOMEMADE</Text>
                    <Text style={s.heroBannerTitle}>Food made with{'\n'}love & culture</Text>
                    <View style={s.heroBannerStats}>
                      <View style={s.heroBannerStat}>
                        <Text style={s.heroBannerStatNum}>{filteredCooks.length}</Text>
                        <Text style={s.heroBannerStatLbl}>Chefs</Text>
                      </View>
                      <View style={s.heroBannerStatDivider} />
                      <View style={s.heroBannerStat}>
                        <Text style={s.heroBannerStatNum}>24h+</Text>
                        <Text style={s.heroBannerStatLbl}>Preorder</Text>
                      </View>
                      <View style={s.heroBannerStatDivider} />
                      <View style={s.heroBannerStat}>
                        <Text style={s.heroBannerStatNum}>LA</Text>
                        <Text style={s.heroBannerStatLbl}>Delivery</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Filter bar */}
                <View style={s.filterSection}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterBarRow}>
                    {['culture', 'location', 'dietary', 'price', 'more'].map((key) => (
                      <Pressable
                        key={key}
                        style={[s.filterBtn, activeFilterMenu === key && s.filterBtnActive]}
                        onPress={() => setActiveFilterMenu((cur) => cur === key ? '' : key)}
                      >
                        <Text style={[s.filterBtnText, activeFilterMenu === key && s.filterBtnTextActive]}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        <Ionicons name="chevron-down" size={12} color={activeFilterMenu === key ? C.bg : C.creamDim} style={{ marginLeft: 4 }} />
                      </Pressable>
                    ))}
                  </ScrollView>

                  {activeFilterMenu === 'culture' && (
                    <FilterChips options={CUISINES} active={activeCuisine} onSelect={setActiveCuisine} />
                  )}
                  {activeFilterMenu === 'location' && (
                    <FilterChips options={locationOptions} active={activeLocation} onSelect={setActiveLocation} />
                  )}
                  {activeFilterMenu === 'dietary' && (
                    <FilterChips options={DIETARY_OPTIONS} active={activeDietary} onSelect={setActiveDietary} />
                  )}
                  {activeFilterMenu === 'price' && (
                    <FilterChips options={PRICE_OPTIONS} active={activePrice} onSelect={setActivePrice} />
                  )}
                  {activeFilterMenu === 'more' && (
                    <View style={s.moreRow}>
                      {RATING_OPTIONS.map((r) => (
                        <Pressable key={r} onPress={() => setActiveRating(r)} style={[s.smallChip, activeRating === r && s.smallChipActive]}>
                          <Text style={[s.smallChipText, activeRating === r && s.smallChipTextActive]}>{r}</Text>
                        </Pressable>
                      ))}
                      <Pressable onPress={() => setEcoOnly((v) => !v)} style={[s.smallChip, ecoOnly && s.smallChipActive]}>
                        <Text style={[s.smallChipText, ecoOnly && s.smallChipTextActive]}>🌿 Eco only</Text>
                      </Pressable>
                    </View>
                  )}
                </View>

                {/* Cook cards */}
                <View style={s.cardsSection}>
                  <Text style={s.sectionHeading}>Featured cooks</Text>
                  {filteredCooks.length === 0 ? (
                    <View style={s.emptyCard}>
                      <Text style={s.emptyTitle}>No chefs match those filters</Text>
                      <Text style={s.emptySub}>Try broadening your selection.</Text>
                    </View>
                  ) : (
                    filteredCooks.map((cook) => (
                      <CookCard key={cook.id} cook={cook} onRequest={openRequest} onProfile={() => setSelectedChefId(cook.id)} />
                    ))
                  )}
                </View>
              </>
            )}

            {/* Chef profile */}
            {selectedChef && (
              <View style={s.cardsSection}>
                <Pressable onPress={() => setSelectedChefId(null)} style={s.backBtn}>
                  <Ionicons name="chevron-back" size={16} color={C.accent} />
                  <Text style={s.backBtnText}>All chefs</Text>
                </Pressable>
                <ChefProfile chef={selectedChef} onRequest={openRequest} />
              </View>
            )}
          </ScrollView>
        )}

        {/* SIGN UP */}
        {activeTab === 'signup' && (
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
            <View style={s.cardsSection}>
              <View style={s.signupHero}>
                <Text style={s.signupHeroEye}>JOIN THE TABLE</Text>
                <Text style={s.signupHeroTitle}>Share your{'\n'}culinary story</Text>
                <Text style={s.signupHeroCopy}>Cook authentic meals for your community. Set your own prices. Own your brand.</Text>
              </View>
              <View style={s.formCard}>
                <FormField label="Your name" value={signupForm.name} onChangeText={(t) => setSignupForm({ ...signupForm, name: t })} placeholder="Chef name" />
                <FormField label="Cuisine / region" value={signupForm.culture} onChangeText={(t) => setSignupForm({ ...signupForm, culture: t })} placeholder="Burmese, Puerto Rican, etc." />
                <FormField label="Neighborhood" value={signupForm.location} onChangeText={(t) => setSignupForm({ ...signupForm, location: t })} placeholder="Leimert Park" />
                <FormField label="Short story" value={signupForm.story} onChangeText={(t) => setSignupForm({ ...signupForm, story: t })} placeholder="Why you cook..." multiline />
                <FormField label="Signature dishes (comma separated)" value={signupForm.dishes} onChangeText={(t) => setSignupForm({ ...signupForm, dishes: t })} placeholder="Jollof rice, suya, puff puff" />
                <PrimaryButton label="Submit application" onPress={submitSignup} />
              </View>
            </View>
          </ScrollView>
        )}

        {/* ASSISTANT */}
        {activeTab === 'assistant' && (
          <View style={s.assistantWrap}>
            <ScrollView contentContainerStyle={s.assistantMessages} showsVerticalScrollIndicator={false}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={[s.bubble, msg.role === 'user' ? s.bubbleUser : s.bubbleAssistant]}>
                  {msg.role === 'assistant' && <Text style={s.bubbleLabel}>HomeTable AI</Text>}
                  <Text style={[s.bubbleText, msg.role === 'user' ? s.bubbleTextUser : s.bubbleTextAssistant]}>{msg.text}</Text>
                </View>
              ))}
              {isAssistantLoading && (
                <View style={[s.bubble, s.bubbleAssistant]}>
                  <Text style={s.bubbleLabel}>HomeTable AI</Text>
                  <Text style={s.bubbleTextAssistant}>Thinking…</Text>
                </View>
              )}
            </ScrollView>
            <View style={s.chatInputRow}>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask about dishes, diets, timing…"
                placeholderTextColor={C.textMuted}
                style={s.chatInput}
                onSubmitEditing={sendMessage}
              />
              <Pressable onPress={sendMessage} disabled={isAssistantLoading} style={[s.sendBtn, isAssistantLoading && { opacity: 0.5 }]}>
                <Ionicons name="arrow-up" size={18} color={C.bg} />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* ── Bottom Nav ── */}
      <View style={s.bottomNav}>
        {TAB_ITEMS.map((item) => (
          <TabButton key={item.key} item={item} active={activeTab === item.key} onPress={() => setActiveTab(item.key)} />
        ))}
      </View>

      {/* ── Order Modal ── */}
      <Modal visible={requestOpen} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Request order</Text>
            <Text style={s.modalSub}>{selectedCook?.name} · {selectedCook?.culture}</Text>

            <Text style={s.modalLabel}>SELECT DISH</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10, paddingRight: 10 }}>
              {getCookDishes(selectedCook).map((dish) => (
                <Pressable key={dish.name} onPress={() => setSelectedDish(dish.name)} style={[s.dishChip, selectedDish === dish.name && s.dishChipActive]}>
                  <Text style={[s.dishChipText, selectedDish === dish.name && s.dishChipTextActive]}>{dish.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FormField label="Your name" value={requestForm.name} onChangeText={(t) => setRequestForm({ ...requestForm, name: t })} placeholder="Customer name" />
              <FormField label="Phone or email" value={requestForm.contact} onChangeText={(t) => setRequestForm({ ...requestForm, contact: t })} placeholder="name@email.com" />
              <FormField label="Delivery address" value={requestForm.address} onChangeText={(t) => setRequestForm({ ...requestForm, address: t })} placeholder="Street, city" />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}><FormField label="Date" value={requestForm.date} onChangeText={(t) => setRequestForm({ ...requestForm, date: t })} placeholder="YYYY-MM-DD" /></View>
                <View style={{ flex: 1 }}><FormField label="Time window" value={requestForm.timeWindow} onChangeText={(t) => setRequestForm({ ...requestForm, timeWindow: t })} placeholder="5–7 PM" /></View>
              </View>
              <FormField label="Servings" value={requestForm.quantity} onChangeText={(t) => setRequestForm({ ...requestForm, quantity: t })} placeholder="2" keyboardType="number-pad" />
              <FormField label="Notes" value={requestForm.notes} onChangeText={(t) => setRequestForm({ ...requestForm, notes: t })} placeholder="Allergies, spice level, etc." multiline />
            </ScrollView>

            <View style={s.modalActions}>
              <Pressable onPress={() => setRequestOpen(false)} style={s.modalCancel}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submitRequest} style={s.modalConfirm}>
                <Text style={s.modalConfirmText}>Send request</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Cook Card ───────────────────────────────────────────────────────────────
function CookCard({ cook, onRequest, onProfile }) {
  const dishes = getCookDishes(cook);
  return (
    <View style={s.cookCard}>
      {/* Full-bleed hero image */}
      <View style={s.cookCardHero}>
        <SmartImage uri={cook.chefImage} fallbackUri={FALLBACK_DISH_IMAGE} style={s.cookCardHeroImg} />
        <View style={s.cookCardHeroOverlay} />
        {/* Rating badge */}
        <View style={s.ratingBadge}>
          <Text style={s.ratingBadgeStar}>★</Text>
          <Text style={s.ratingBadgeNum}>{cook.rating.toFixed(1)}</Text>
        </View>
        {/* Culture pill */}
        <View style={s.culturePill}>
          <Text style={s.culturePillText}>{cook.culture}</Text>
        </View>
        {/* Chef avatar */}
        <View style={s.chefAvatar}>
          <SmartImage uri={cook.profileImage} fallbackUri={FALLBACK_PROFILE_IMAGE} style={s.chefAvatarImg} />
        </View>
      </View>

      {/* Card body */}
      <View style={s.cookCardBody}>
        <View style={s.cookCardRow}>
          <View>
            <Text style={s.cookName}>{cook.name}</Text>
            <Text style={s.cookMeta}>📍 {cook.location} · {cook.priceRange}</Text>
          </View>
          <Text style={s.preorderBadge}>{cook.preOrderHours}h notice</Text>
        </View>

        <Text style={s.cookStory}>{cook.story}</Text>

        {/* Tags */}
        <View style={s.tagRow}>
          {(cook.tags || []).map((tag) => (
            <Text key={tag} style={s.tag}>{tag}</Text>
          ))}
          {cook.ecoFriendly && <Text style={s.ecoTag}>🌿 Eco</Text>}
        </View>

        {/* Divider */}
        <View style={s.divider} />

        {/* Dish list */}
        <Text style={s.dishSectionLabel}>Popular dishes</Text>
        {dishes.map((dish) => (
          <Pressable key={dish.name} onPress={() => onRequest(cook, dish.name)} style={s.dishRow}>
            <SmartImage uri={dish.image} fallbackUri={FALLBACK_DISH_IMAGE} style={s.dishThumb} />
            <View style={s.dishInfo}>
              <Text style={s.dishName}>{dish.name}</Text>
              {!!dish.description && <Text style={s.dishDesc}>{dish.description}</Text>}
            </View>
            <View style={s.dishRight}>
              <Text style={s.dishPrice}>{dish.price}</Text>
              <View style={s.requestPill}>
                <Text style={s.requestPillText}>Order</Text>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Profile button */}
        <Pressable onPress={onProfile} style={s.profileBtn}>
          <Text style={s.profileBtnText}>View full profile</Text>
          <Ionicons name="arrow-forward" size={14} color={C.accent} />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Chef Profile ─────────────────────────────────────────────────────────────
function ChefProfile({ chef, onRequest }) {
  const dishes = getCookDishes(chef);
  return (
    <View style={s.cookCard}>
      <View style={[s.cookCardHero, { height: 260 }]}>
        <SmartImage uri={chef.chefImage} fallbackUri={FALLBACK_DISH_IMAGE} style={s.cookCardHeroImg} />
        <View style={s.cookCardHeroOverlay} />
        <View style={s.ratingBadge}>
          <Text style={s.ratingBadgeStar}>★</Text>
          <Text style={s.ratingBadgeNum}>{chef.rating.toFixed(1)}</Text>
        </View>
        <View style={s.culturePill}><Text style={s.culturePillText}>{chef.culture}</Text></View>
        <View style={s.chefAvatar}><SmartImage uri={chef.profileImage} fallbackUri={FALLBACK_PROFILE_IMAGE} style={s.chefAvatarImg} /></View>
      </View>
      <View style={s.cookCardBody}>
        <Text style={s.cookName}>{chef.name}</Text>
        <Text style={s.cookMeta}>📍 {chef.location} · {chef.priceRange} · {chef.preOrderHours}h notice</Text>
        <Text style={[s.cookStory, { marginTop: 10 }]}>{chef.story}</Text>
        <View style={s.divider} />
        <Text style={s.dishSectionLabel}>Full menu</Text>
        {dishes.map((dish) => (
          <View key={dish.name} style={s.profileDishCard}>
            <SmartImage uri={dish.image} fallbackUri={FALLBACK_DISH_IMAGE} style={s.profileDishImg} />
            <View style={s.profileDishBody}>
              <Text style={s.dishName}>{dish.name}</Text>
              {!!dish.description && <Text style={s.dishDesc}>{dish.description}</Text>}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <Text style={s.dishPrice}>{dish.price}</Text>
                <Pressable onPress={() => onRequest(chef, dish.name)} style={s.requestPill}>
                  <Text style={s.requestPillText}>Request this</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Filter Chips ─────────────────────────────────────────────────────────────
function FilterChips({ options, active, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 2 }}>
      {options.map((opt) => (
        <Pressable key={opt} onPress={() => onSelect(opt)} style={[s.chip, active === opt && s.chipActive]}>
          <Text style={[s.chipText, active === opt && s.chipTextActive]}>{opt}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabButton({ item, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.tabBtn, active && s.tabBtnActive]}>
      <Ionicons name={active ? item.iconActive : item.icon} size={20} color={active ? C.accent : C.textMuted} />
      <Text style={[s.tabBtnText, active && s.tabBtnTextActive]}>{item.label}</Text>
    </Pressable>
  );
}

// ─── SmartImage ───────────────────────────────────────────────────────────────
function SmartImage({ uri, fallbackUri, style }) {
  const [src, setSrc] = useState(uri || fallbackUri || '');
  useEffect(() => { setSrc(uri || fallbackUri || ''); }, [uri, fallbackUri]);
  return (
    <Image
      source={src ? { uri: src } : require('./assets/icon.png')}
      style={style}
      onError={() => { if (fallbackUri && src !== fallbackUri) setSrc(fallbackUri); }}
    />
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────
function FormField({ label, value, onChangeText, placeholder, multiline, keyboardType }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[s.input, multiline && s.inputMulti]}
      />
    </View>
  );
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
function PrimaryButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={s.primaryBtn}>
      <Text style={s.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.cardBorder,
    backgroundColor: C.surface,
  },
  headerTitle: { fontFamily: serifFont, fontSize: 26, color: C.cream, letterSpacing: 0.5 },
  headerSub: { fontSize: 11, color: C.textSecondary, marginTop: 2, letterSpacing: 0.5 },
  headerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent },

  screenContent: { flex: 1 },
  scroll: { paddingBottom: 32 },

  // Hero banner
  heroBanner: { height: 260, position: 'relative', marginBottom: 0 },
  heroBannerImage: { width: '100%', height: '100%' },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,4,2,0.62)',
  },
  heroBannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  heroBannerEye: { color: C.accent, fontSize: 10, fontWeight: '700', letterSpacing: 2.5, marginBottom: 6 },
  heroBannerTitle: { fontFamily: serifFont, fontSize: 30, color: C.cream, lineHeight: 36, marginBottom: 16 },
  heroBannerStats: { flexDirection: 'row', alignItems: 'center' },
  heroBannerStat: { alignItems: 'center' },
  heroBannerStatNum: { color: C.gold, fontSize: 18, fontWeight: '700' },
  heroBannerStatLbl: { color: C.creamDim, fontSize: 10, letterSpacing: 0.5, marginTop: 2 },
  heroBannerStatDivider: { width: 1, height: 28, backgroundColor: C.cardBorder, marginHorizontal: 16 },

  // Filters
  filterSection: { backgroundColor: C.surface, paddingTop: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.cardBorder },
  filterBarRow: { paddingBottom: 2 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  filterBtnText: { color: C.creamDim, fontSize: 13, fontWeight: '500' },
  filterBtnTextActive: { color: C.bg },
  chip: { backgroundColor: C.card, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8, borderWidth: 1, borderColor: C.cardBorder },
  chipActive: { backgroundColor: C.accent, borderColor: C.accent },
  chipText: { color: C.textSecondary, fontSize: 13 },
  chipTextActive: { color: C.bg, fontWeight: '600' },
  moreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 12 },
  smallChip: { backgroundColor: C.card, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: C.cardBorder },
  smallChipActive: { backgroundColor: C.accent, borderColor: C.accent },
  smallChipText: { color: C.textSecondary, fontSize: 12 },
  smallChipTextActive: { color: C.bg, fontWeight: '600' },

  // Cards section
  cardsSection: { padding: 16 },
  sectionHeading: { fontFamily: serifFont, fontSize: 20, color: C.cream, marginBottom: 14 },

  // Cook card
  cookCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  cookCardHero: { height: 200, position: 'relative' },
  cookCardHeroImg: { width: '100%', height: '100%' },
  cookCardHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,5,2,0.4)',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,5,2,0.75)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.gold,
  },
  ratingBadgeStar: { color: C.gold, fontSize: 12, marginRight: 3 },
  ratingBadgeNum: { color: C.gold, fontWeight: '700', fontSize: 13 },
  culturePill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: C.accent,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  culturePillText: { color: C.bg, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  chefAvatar: {
    position: 'absolute',
    bottom: -20,
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: C.accent,
    overflow: 'hidden',
    backgroundColor: C.card,
  },
  chefAvatarImg: { width: '100%', height: '100%' },
  cookCardBody: { padding: 16, paddingTop: 24 },
  cookCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cookName: { fontFamily: serifFont, fontSize: 20, color: C.cream },
  cookMeta: { color: C.textSecondary, fontSize: 12, marginTop: 3 },
  preorderBadge: { color: C.gold, fontSize: 11, fontWeight: '600', backgroundColor: 'rgba(212,168,83,0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  cookStory: { color: C.textSecondary, fontSize: 13, lineHeight: 19 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
  tag: { backgroundColor: 'rgba(232,99,58,0.12)', color: C.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, fontSize: 11, borderWidth: 1, borderColor: 'rgba(232,99,58,0.2)' },
  ecoTag: { backgroundColor: 'rgba(80,180,80,0.12)', color: '#6CC86C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, fontSize: 11, borderWidth: 1, borderColor: 'rgba(80,180,80,0.2)' },
  divider: { height: 1, backgroundColor: C.cardBorder, marginVertical: 14 },
  dishSectionLabel: { color: C.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' },

  // Dish rows
  dishRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dishThumb: { width: 56, height: 56, borderRadius: 12, marginRight: 12, backgroundColor: C.surface },
  dishInfo: { flex: 1, marginRight: 8 },
  dishName: { color: C.cream, fontWeight: '600', fontSize: 14 },
  dishDesc: { color: C.textSecondary, fontSize: 12, marginTop: 2, lineHeight: 17 },
  dishRight: { alignItems: 'flex-end', gap: 6 },
  dishPrice: { color: C.gold, fontWeight: '700', fontSize: 14 },
  requestPill: { backgroundColor: C.accent, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  requestPillText: { color: C.bg, fontWeight: '700', fontSize: 11 },

  // Profile button
  profileBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.accent },
  profileBtnText: { color: C.accent, fontWeight: '600', fontSize: 14 },

  // Chef profile dish cards
  profileDishCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: C.cardBorder, backgroundColor: C.surface },
  profileDishImg: { width: '100%', height: 150 },
  profileDishBody: { padding: 12 },

  // Back button
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backBtnText: { color: C.accent, fontWeight: '600', marginLeft: 4 },

  // Empty state
  emptyCard: { backgroundColor: C.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.cardBorder, alignItems: 'center' },
  emptyTitle: { color: C.cream, fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptySub: { color: C.textSecondary, fontSize: 13 },

  // Sign up
  signupHero: { marginBottom: 20 },
  signupHeroEye: { color: C.accent, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 6 },
  signupHeroTitle: { fontFamily: serifFont, fontSize: 28, color: C.cream, lineHeight: 34, marginBottom: 8 },
  signupHeroCopy: { color: C.textSecondary, fontSize: 14, lineHeight: 20 },
  formCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.cardBorder },

  // Form fields
  field: { marginBottom: 14 },
  fieldLabel: { color: C.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: C.cardBorder, color: C.cream, fontSize: 14 },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
  primaryBtn: { backgroundColor: C.accent, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: C.bg, fontWeight: '700', fontSize: 15 },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.navBg,
    borderTopWidth: 1,
    borderTopColor: C.cardBorder,
  },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, gap: 3 },
  tabBtnActive: { backgroundColor: 'rgba(232,99,58,0.12)' },
  tabBtnText: { color: C.textMuted, fontSize: 10, fontWeight: '600' },
  tabBtnTextActive: { color: C.accent },

  // Assistant
  assistantWrap: { flex: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  assistantMessages: { paddingBottom: 16 },
  bubble: { maxWidth: '82%', borderRadius: 16, padding: 12, marginBottom: 10 },
  bubbleAssistant: { alignSelf: 'flex-start', backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: C.accent },
  bubbleLabel: { color: C.accent, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextAssistant: { color: C.cream },
  bubbleTextUser: { color: C.bg },
  chatInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 8 },
  chatInput: { flex: 1, backgroundColor: C.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: C.cardBorder, color: C.cream, fontSize: 14 },
  sendBtn: { backgroundColor: C.accent, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '88%', borderTopWidth: 1, borderColor: C.cardBorder },
  modalHandle: { width: 36, height: 4, backgroundColor: C.cardBorder, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  modalTitle: { fontFamily: serifFont, fontSize: 22, color: C.cream },
  modalSub: { color: C.textSecondary, marginTop: 4, marginBottom: 8, fontSize: 13 },
  modalLabel: { color: C.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 8 },
  dishChip: { backgroundColor: C.card, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, borderWidth: 1, borderColor: C.cardBorder },
  dishChipActive: { backgroundColor: C.accent, borderColor: C.accent },
  dishChipText: { color: C.textSecondary, fontSize: 13 },
  dishChipTextActive: { color: C.bg, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalCancel: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: C.cardBorder },
  modalCancelText: { color: C.textSecondary, fontWeight: '600' },
  modalConfirm: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: C.accent },
  modalConfirmText: { color: C.bg, fontWeight: '700' },
});