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
} from 'react-native';

const ANY_FILTER = 'Any';

const CUISINES = [
  ANY_FILTER,
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

const DIETARY_OPTIONS = [ANY_FILTER, 'Vegetarian', 'Vegan', 'Gluten-free', 'Seafood'];
const PRICE_OPTIONS = [ANY_FILTER, '$', '$$', '$$$'];
const RATING_OPTIONS = ['Any', '4.5+', '4.8+', '5.0'];

const SEED_COOKS = [
  {
    id: 'cook-1',
    name: 'Marisol Ruiz',
    culture: 'Oaxacan',
    location: 'Echo Park',
    chefImage: 'https://loremflickr.com/1200/900/mexican,food?lock=101',
    profileImage: 'https://i.pravatar.cc/200?img=32',
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
    dishes: [
      {
        name: 'Mole negro plate',
        image: 'https://loremflickr.com/1200/900/mole,food?lock=111',
        description: 'Chicken in rich mole with sesame rice.',
      },
      {
        name: 'Tlayudas',
        image: 'https://loremflickr.com/1200/900/taco,food?lock=112',
        description: 'Crispy Oaxacan tortilla with beans and quesillo.',
      },
      {
        name: 'Hoja santa tamales',
        image: 'https://loremflickr.com/1200/900/tamales,food?lock=113',
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
    chefImage: 'https://loremflickr.com/1200/900/curry,food?lock=201',
    profileImage: 'https://i.pravatar.cc/200?img=15',
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
    dishes: [
      {
        name: 'Mustard fish curry',
        image: 'https://loremflickr.com/1200/900/fish,curry,food?lock=211',
        description: 'Salmon in mustard gravy with steamed rice.',
      },
      {
        name: 'Khichuri feast',
        image: 'https://loremflickr.com/1200/900/rice,curry,food?lock=212',
        description: 'Rainy-day lentil rice meal with pickles and sides.',
      },
      {
        name: 'Mishti doi',
        image: 'https://loremflickr.com/1200/900/dessert,food?lock=213',
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
    chefImage: 'https://loremflickr.com/1200/900/ethiopian,food?lock=301',
    profileImage: 'https://i.pravatar.cc/200?img=48',
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
    dishes: [
      {
        name: 'Doro wat platter',
        image: 'https://loremflickr.com/1200/900/stew,food?lock=311',
        description: 'Slow cooked chicken stew with eggs and injera.',
      },
      {
        name: 'Vegan injera set',
        image: 'https://loremflickr.com/1200/900/vegan,platter,food?lock=312',
        description: 'Colorful vegan combos for sharing.',
      },
      {
        name: 'Shiro stew',
        image: 'https://loremflickr.com/1200/900/chickpea,stew,food?lock=313',
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
    chefImage: 'https://loremflickr.com/1200/900/persian,food?lock=401',
    profileImage: 'https://i.pravatar.cc/200?img=20',
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
    dishes: [
      {
        name: 'Ghormeh sabzi',
        image: 'https://loremflickr.com/1200/900/herb,stew,food?lock=411',
        description: 'Herb stew with kidney beans and dried lime.',
      },
      {
        name: 'Zereshk polo',
        image: 'https://loremflickr.com/1200/900/rice,plate,food?lock=412',
        description: 'Saffron rice with barberries and roasted chicken.',
      },
      {
        name: 'Kashk-e bademjan',
        image: 'https://loremflickr.com/1200/900/eggplant,dip,food?lock=413',
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
const FALLBACK_DISH_IMAGE = 'https://loremflickr.com/1200/900/food?lock=999';
const FALLBACK_PROFILE_IMAGE = 'https://i.pravatar.cc/200?img=11';

const getMinRatingFromFilter = (ratingFilter) => {
  if (ratingFilter === '4.5+') return 4.5;
  if (ratingFilter === '4.8+') return 4.8;
  if (ratingFilter === '5.0') return 5.0;
  return 0;
};

const normalizeDish = (cook, dish) => {
  if (typeof dish === 'string') {
    return {
      name: dish,
      image: FALLBACK_DISH_IMAGE,
      description: '',
      price: getDishPrice(cook, dish),
    };
  }
  const name = dish?.name || 'Signature dish';
  return {
    ...dish,
    name,
    image: dish?.image || FALLBACK_DISH_IMAGE,
    description: dish?.description || '',
    price: dish?.price || getDishPrice(cook, name),
  };
};

const getCookDishes = (cook) => (cook?.dishes || []).map((dish) => normalizeDish(cook, dish));

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

  const locationOptions = useMemo(() => {
    const uniqueLocations = [...new Set(cooks.map((cook) => cook.location))];
    return [ANY_FILTER, ...uniqueLocations];
  }, [cooks]);

  const filteredCooks = useMemo(() => {
    const minRating = getMinRatingFromFilter(activeRating);
    return cooks.filter((cook) => {
      const matchesCuisine = activeCuisine === ANY_FILTER || cook.culture === activeCuisine;
      const matchesLocation = activeLocation === ANY_FILTER || cook.location === activeLocation;
      const matchesDietary =
        activeDietary === ANY_FILTER ||
        (cook.dietary || []).some((tag) => tag.toLowerCase().includes(activeDietary.toLowerCase()));
      const matchesPrice = activePrice === ANY_FILTER || cook.priceRange === activePrice;
      const matchesRating = cook.rating >= minRating;
      const matchesEco = !ecoOnly || Boolean(cook.ecoFriendly);
      return matchesCuisine && matchesLocation && matchesDietary && matchesPrice && matchesRating && matchesEco;
    });
  }, [activeCuisine, activeLocation, activeDietary, activePrice, activeRating, ecoOnly, cooks]);

  const openRequest = (cook, dish) => {
    setSelectedCook(cook);
    setSelectedDish(dish || getCookDishes(cook)[0]?.name || '');
    setRequestOpen(true);
  };

  const toggleFilterMenu = (menuKey) => {
    setActiveFilterMenu((current) => (current === menuKey ? '' : menuKey));
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
        chefImage: FALLBACK_DISH_IMAGE,
        profileImage: FALLBACK_PROFILE_IMAGE,
        story: signup.story || 'New HomeTable cook profile pending full bio.',
        priceRange: '$$',
        rating: 5.0,
        preOrderHours: 24,
        dishes: signup.dishes ? signup.dishes.split(',').map((d) => d.trim()) : ['Signature dish'],
        dishPrices: {},
        tags: ['New cook'],
        dietary: [],
        ecoFriendly: false,
      },
      ...prev,
    ]);
  };

  const cookContext = useMemo(() => {
    return cooks
      .map((cook) => {
        const dishesWithPrices = getCookDishes(cook)
          .map((dish) => `${dish.name} (${dish.price})`)
          .join(', ');
        return `${cook.name} (${cook.culture}, ${cook.location}) | Dishes: ${dishesWithPrices} | Tags: ${(cook.tags || []).join(', ')} | Preorder: ${cook.preOrderHours}h`;
      })
      .join('\n');
  }, [cooks]);
  const selectedChef = useMemo(
    () => cooks.find((cook) => cook.id === selectedChefId) || null,
    [cooks, selectedChefId]
  );

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
            <View pointerEvents="none" style={styles.decorWrap}>
              <View style={styles.decorBlobPrimary} />
              <View style={styles.decorBlobSecondary} />
            </View>
            {!selectedChef && (
              <>
                <View style={styles.checkoutHeader}>
                  <Text style={styles.checkoutEyebrow}>Meal Plans</Text>
                  <Text style={styles.sectionTitle}>Plan your weekly drop-off</Text>
                  <Text style={styles.sectionCopy}>
                    Browse chefs, pick dishes with photos, and request your delivery window.
                  </Text>
                  <View style={styles.checkoutStatsRow}>
                    <View style={styles.checkoutStat}>
                      <Text style={styles.checkoutStatNumber}>{filteredCooks.length}</Text>
                      <Text style={styles.checkoutStatLabel}>Chefs available</Text>
                    </View>
                    <View style={styles.checkoutStat}>
                      <Text style={styles.checkoutStatNumber}>24h+</Text>
                      <Text style={styles.checkoutStatLabel}>Preorder notice</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBarRow}>
                    <Pressable
                      style={[styles.filterBarButton, activeFilterMenu === 'location' && styles.filterBarButtonActive]}
                      onPress={() => toggleFilterMenu('location')}
                    >
                      <View style={styles.filterBarInner}>
                        <Text style={[styles.filterBarLabelSingle, activeFilterMenu === 'location' && styles.filterBarLabelSingleActive]}>
                          Location
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={activeFilterMenu === 'location' ? '#FFFDF8' : '#102A43'} />
                      </View>
                    </Pressable>
                    <Pressable
                      style={[styles.filterBarButton, activeFilterMenu === 'dietary' && styles.filterBarButtonActive]}
                      onPress={() => toggleFilterMenu('dietary')}
                    >
                      <View style={styles.filterBarInner}>
                        <Text style={[styles.filterBarLabelSingle, activeFilterMenu === 'dietary' && styles.filterBarLabelSingleActive]}>
                          Dietary
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={activeFilterMenu === 'dietary' ? '#FFFDF8' : '#102A43'} />
                      </View>
                    </Pressable>
                    <Pressable
                      style={[styles.filterBarButton, activeFilterMenu === 'culture' && styles.filterBarButtonActive]}
                      onPress={() => toggleFilterMenu('culture')}
                    >
                      <View style={styles.filterBarInner}>
                        <Text style={[styles.filterBarLabelSingle, activeFilterMenu === 'culture' && styles.filterBarLabelSingleActive]}>
                          Culture
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={activeFilterMenu === 'culture' ? '#FFFDF8' : '#102A43'} />
                      </View>
                    </Pressable>
                    <Pressable
                      style={[styles.filterBarButton, activeFilterMenu === 'price' && styles.filterBarButtonActive]}
                      onPress={() => toggleFilterMenu('price')}
                    >
                      <View style={styles.filterBarInner}>
                        <Text style={[styles.filterBarLabelSingle, activeFilterMenu === 'price' && styles.filterBarLabelSingleActive]}>
                          Price
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={activeFilterMenu === 'price' ? '#FFFDF8' : '#102A43'} />
                      </View>
                    </Pressable>
                    <Pressable
                      style={[styles.filterBarButton, activeFilterMenu === 'more' && styles.filterBarButtonActive]}
                      onPress={() => toggleFilterMenu('more')}
                    >
                      <View style={styles.filterBarInner}>
                        <Text style={[styles.filterBarLabelSingle, activeFilterMenu === 'more' && styles.filterBarLabelSingleActive]}>
                          More
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={activeFilterMenu === 'more' ? '#FFFDF8' : '#102A43'} />
                      </View>
                    </Pressable>
                  </ScrollView>

                  {activeFilterMenu === 'location' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                      {locationOptions.map((location) => (
                        <Pressable
                          key={location}
                          onPress={() => setActiveLocation(location)}
                          style={[styles.chip, activeLocation === location && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, activeLocation === location && styles.chipTextActive]}>{location}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}

                  {activeFilterMenu === 'dietary' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                      {DIETARY_OPTIONS.map((dietary) => (
                        <Pressable
                          key={dietary}
                          onPress={() => setActiveDietary(dietary)}
                          style={[styles.chip, activeDietary === dietary && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, activeDietary === dietary && styles.chipTextActive]}>{dietary}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}

                  {activeFilterMenu === 'culture' && (
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
                  )}

                  {activeFilterMenu === 'price' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                      {PRICE_OPTIONS.map((price) => (
                        <Pressable
                          key={price}
                          onPress={() => setActivePrice(price)}
                          style={[styles.chip, activePrice === price && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, activePrice === price && styles.chipTextActive]}>{price}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}

                  {activeFilterMenu === 'more' && (
                    <View style={styles.moreFilterRow}>
                      {RATING_OPTIONS.map((ratingOption) => (
                        <Pressable
                          key={ratingOption}
                          onPress={() => setActiveRating(ratingOption)}
                          style={[styles.smallChip, activeRating === ratingOption && styles.smallChipActive]}
                        >
                          <Text style={[styles.smallChipText, activeRating === ratingOption && styles.smallChipTextActive]}>
                            {ratingOption}
                          </Text>
                        </Pressable>
                      ))}
                      <Pressable
                        onPress={() => setEcoOnly((current) => !current)}
                        style={[styles.smallChip, ecoOnly && styles.smallChipActive]}
                      >
                        <Text style={[styles.smallChipText, ecoOnly && styles.smallChipTextActive]}>Eco-friendly only</Text>
                      </Pressable>
                    </View>
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Featured home cooks</Text>
                  {filteredCooks.length === 0 && (
                    <View style={styles.emptyStateCard}>
                      <Text style={styles.emptyStateTitle}>No chefs match those filters yet</Text>
                      <Text style={styles.emptyStateCopy}>Try opening another filter and broadening your selection.</Text>
                    </View>
                  )}
                  {filteredCooks.map((cook) => {
                    const dishes = getCookDishes(cook);
                    return (
                      <View key={cook.id} style={styles.card}>
                        <View style={styles.heroImageWrap}>
                          <SmartImage uri={cook.chefImage} fallbackUri={FALLBACK_DISH_IMAGE} style={styles.cardHeroImage} />
                          <View style={styles.heroOverlay} />
                          <View style={styles.heroBadge}>
                            <Text style={styles.heroBadgeText}>{cook.culture}</Text>
                          </View>
                          <View style={styles.profileBubble}>
                            <SmartImage
                              uri={cook.profileImage}
                              fallbackUri={FALLBACK_PROFILE_IMAGE}
                              style={styles.profileBubbleImage}
                            />
                          </View>
                        </View>
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
                          {(cook.tags || []).map((tag) => (
                            <Text key={tag} style={styles.tag}>{tag}</Text>
                          ))}
                        </View>
                        <Text style={styles.dishLabel}>Popular dishes</Text>
                        {dishes.map((dish) => (
                          <Pressable key={dish.name} onPress={() => openRequest(cook, dish.name)} style={styles.dishRow}>
                            <View style={styles.dishIdentity}>
                              <SmartImage uri={dish.image} fallbackUri={FALLBACK_DISH_IMAGE} style={styles.dishThumb} />
                              <View>
                                <Text style={styles.dishName}>{dish.name}</Text>
                                {!!dish.description && <Text style={styles.dishDescription}>{dish.description}</Text>}
                              </View>
                            </View>
                            <View style={styles.dishMeta}>
                              <Text style={styles.dishPrice}>{dish.price}</Text>
                              <Text style={styles.dishAction}>Request</Text>
                            </View>
                          </Pressable>
                        ))}
                        <View style={styles.cardFooter}>
                          <Text style={styles.preorder}>Preorder {cook.preOrderHours}h notice</Text>
                          <Text style={styles.price}>{cook.priceRange}</Text>
                        </View>
                        <Pressable style={styles.profileButton} onPress={() => setSelectedChefId(cook.id)}>
                          <Text style={styles.profileButtonText}>View chef profile</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {selectedChef && (
              <View style={styles.section}>
                <Pressable onPress={() => setSelectedChefId(null)} style={styles.backButton}>
                  <Ionicons name="chevron-back" size={18} color="#102A43" />
                  <Text style={styles.backButtonText}>Back to all chefs</Text>
                </Pressable>

                <View style={styles.profileCard}>
                  <View style={styles.heroImageWrap}>
                    <SmartImage uri={selectedChef.chefImage} fallbackUri={FALLBACK_DISH_IMAGE} style={styles.profileHeroImage} />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeText}>{selectedChef.culture}</Text>
                    </View>
                    <View style={styles.profileBubbleLarge}>
                      <SmartImage
                        uri={selectedChef.profileImage}
                        fallbackUri={FALLBACK_PROFILE_IMAGE}
                        style={styles.profileBubbleLargeImage}
                      />
                    </View>
                  </View>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{selectedChef.name}</Text>
                      <Text style={styles.cardMeta}>{selectedChef.culture} • {selectedChef.location}</Text>
                    </View>
                    <View style={styles.ratingPill}>
                      <Text style={styles.ratingText}>{selectedChef.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardStory}>{selectedChef.story}</Text>
                  <Text style={styles.profileSectionTitle}>Menu photos</Text>
                  {getCookDishes(selectedChef).map((dish) => (
                    <View key={dish.name} style={styles.profileDishCard}>
                      <SmartImage uri={dish.image} fallbackUri={FALLBACK_DISH_IMAGE} style={styles.profileDishImage} />
                      <View style={styles.profileDishContent}>
                        <Text style={styles.dishName}>{dish.name}</Text>
                        {!!dish.description && <Text style={styles.dishDescription}>{dish.description}</Text>}
                        <View style={styles.profileDishFooter}>
                          <Text style={styles.dishPrice}>{dish.price}</Text>
                          <Pressable onPress={() => openRequest(selectedChef, dish.name)}>
                            <Text style={styles.dishAction}>Request this</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
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
              {getCookDishes(selectedCook).map((dish) => (
                <Pressable
                  key={dish.name}
                  onPress={() => setSelectedDish(dish.name)}
                  style={[styles.dishChip, selectedDish === dish.name && styles.dishChipActive]}
                >
                  <Text style={[styles.dishChipText, selectedDish === dish.name && styles.dishChipTextActive]}>
                    {dish.name}
                  </Text>
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
              <Pressable onPress={() => setRequestOpen(false)} style={styles.modalSecondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submitRequest} style={styles.modalPrimaryButton}>
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
      <Ionicons name={iconName} size={20} color={active ? '#102A43' : '#7A5A60'} />
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SmartImage({ uri, fallbackUri, style }) {
  const [currentUri, setCurrentUri] = useState(uri || fallbackUri || '');

  useEffect(() => {
    setCurrentUri(uri || fallbackUri || '');
  }, [uri, fallbackUri]);

  const source = currentUri ? { uri: currentUri } : require('./assets/icon.png');

  return (
    <Image
      source={source}
      style={style}
      onError={() => {
        if (fallbackUri && currentUri !== fallbackUri) {
          setCurrentUri(fallbackUri);
          return;
        }
        setCurrentUri('');
      }}
    />
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
    backgroundColor: '#FFF7F0',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E3D3',
    backgroundColor: '#FFFDF8',
  },
  title: {
    fontSize: 30,
    fontFamily: serifFont,
    color: '#1F2A44',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#8B6C5A',
    marginTop: 4,
  },
  screenContent: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFDF8',
    borderTopWidth: 1,
    borderTopColor: '#F3E3D3',
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
    backgroundColor: '#FFEAD9',
  },
  tabButtonText: {
    color: '#8B6C5A',
    fontSize: 11,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#1F2A44',
  },
  content: {
    padding: 20,
    paddingBottom: 0,
  },
  decorWrap: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 220,
    zIndex: -1,
  },
  decorBlobPrimary: {
    position: 'absolute',
    right: -35,
    top: 0,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFE1BF',
    opacity: 0.55,
  },
  decorBlobSecondary: {
    position: 'absolute',
    left: -50,
    top: 26,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFD3CE',
    opacity: 0.4,
  },
  section: {
    marginBottom: 24,
  },
  checkoutHeader: {
    backgroundColor: '#FFFDF8',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3E3D3',
    marginBottom: 22,
    shadowColor: '#3A2613',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  checkoutEyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontSize: 11,
    color: '#D16634',
    fontWeight: '700',
    marginBottom: 4,
  },
  checkoutStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  checkoutStat: {
    flex: 1,
    backgroundColor: '#FFF2E7',
    borderRadius: 12,
    padding: 12,
  },
  checkoutStatNumber: {
    fontSize: 20,
    color: '#1F2A44',
    fontWeight: '700',
  },
  checkoutStatLabel: {
    color: '#8B6C5A',
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: serifFont,
    color: '#1F2A44',
  },
  sectionCopy: {
    color: '#8B6C5A',
    marginTop: 8,
    marginBottom: 12,
  },
  filterBarRow: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  filterBarButton: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#EDD9C6',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    shadowColor: '#3A2613',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  filterBarButtonActive: {
    backgroundColor: '#1F2A44',
    borderColor: '#1F2A44',
  },
  filterBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterBarLabelSingle: {
    color: '#1F2A44',
    fontSize: 13,
    fontWeight: '600',
  },
  filterBarLabelSingleActive: {
    color: '#FFFDF8',
  },
  chipRow: {
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FAE6DA',
    borderRadius: 20,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: '#D16634',
  },
  chipText: {
    color: '#8B6C5A',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#FFFDFC',
    fontWeight: '600',
  },
  moreFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  smallChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FAE6DA',
  },
  smallChipActive: {
    backgroundColor: '#1F2A44',
  },
  smallChipText: {
    color: '#8B6C5A',
    fontSize: 12,
  },
  smallChipTextActive: {
    color: '#FFFDFC',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: 20,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F2DEC9',
    shadowColor: '#3A2613',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeroImage: {
    width: '100%',
    height: 176,
    borderRadius: 14,
    marginBottom: 0,
  },
  heroImageWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 16, 12, 0.18)',
    borderRadius: 14,
  },
  heroBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 253, 248, 0.9)',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2A44',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  profileBubble: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFDF8',
    overflow: 'hidden',
    shadowColor: '#3A2613',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  profileBubbleImage: {
    width: '100%',
    height: '100%',
  },
  profileBubbleLarge: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#FFFDFC',
    overflow: 'hidden',
  },
  profileBubbleLargeImage: {
    width: '100%',
    height: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: serifFont,
    color: '#1F2A44',
  },
  cardMeta: {
    color: '#8B6C5A',
    fontSize: 12,
    marginTop: 2,
  },
  ratingPill: {
    backgroundColor: '#2E8A68',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#FFFDF8',
    fontWeight: '600',
  },
  cardStory: {
    color: '#755D50',
    marginTop: 12,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#F6E7DC',
    color: '#755D50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    fontSize: 11,
    marginRight: 8,
    marginBottom: 6,
  },
  dishLabel: {
    marginTop: 10,
    color: '#8B6C5A',
    fontSize: 12,
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F4E3D4',
  },
  dishIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  dishThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 10,
  },
  dishMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dishPrice: {
    color: '#755D50',
    fontWeight: '600',
  },
  dishName: {
    color: '#1F2A44',
    fontWeight: '600',
  },
  dishDescription: {
    color: '#8B6C5A',
    fontSize: 12,
    marginTop: 2,
    maxWidth: 180,
  },
  dishAction: {
    color: '#C9572F',
    fontWeight: '600',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  preorder: {
    color: '#8B6C5A',
    fontSize: 12,
  },
  price: {
    color: '#1F2A44',
    fontWeight: '600',
  },
  profileButton: {
    marginTop: 12,
    backgroundColor: '#1F2A44',
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#FFFDFC',
    fontWeight: '600',
    fontSize: 13,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backButtonText: {
    color: '#102A43',
    fontWeight: '600',
    marginLeft: 4,
  },
  profileCard: {
    backgroundColor: '#FFFDF8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2DEC9',
    padding: 14,
    overflow: 'hidden',
  },
  profileHeroImage: {
    width: '100%',
    height: 224,
    borderRadius: 14,
    marginBottom: 0,
  },
  profileSectionTitle: {
    color: '#102A43',
    fontFamily: serifFont,
    fontSize: 18,
    marginTop: 14,
    marginBottom: 10,
  },
  profileDishCard: {
    borderWidth: 1,
    borderColor: '#F2DEC9',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  profileDishImage: {
    width: '100%',
    height: 160,
  },
  profileDishContent: {
    padding: 12,
  },
  profileDishFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#7A5A60',
    marginBottom: 6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#FFFDF8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F2DEC9',
    color: '#1F2A44',
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#C9572F',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFDFC',
    fontWeight: '600',
  },
  subhead: {
    fontSize: 16,
    marginTop: 16,
    color: '#102A43',
    fontFamily: serifFont,
  },
  adminCard: {
    backgroundColor: '#FFFDFC',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F1D9D8',
  },
  adminName: {
    fontSize: 16,
    color: '#102A43',
  },
  adminMeta: {
    color: '#7A5A60',
    marginTop: 4,
  },
  adminStory: {
    color: '#7A5A60',
    marginTop: 6,
  },
  emptyText: {
    color: '#A07980',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 18, 12, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFDF8',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: serifFont,
    color: '#1F2A44',
  },
  modalSubtitle: {
    color: '#8B6C5A',
    marginTop: 4,
  },
  modalLabel: {
    marginTop: 12,
    color: '#8B6C5A',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dishPicker: {
    paddingVertical: 10,
  },
  dishChip: {
    backgroundColor: '#F6E7DC',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  dishChipActive: {
    backgroundColor: '#1F2A44',
  },
  dishChipText: {
    color: '#8B6C5A',
    fontSize: 12,
  },
  dishChipTextActive: {
    color: '#FFFDF8',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#C9572F',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C9572F',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF8',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#D8453D',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#C9572F',
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
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#F2DEC9',
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#1F2A44',
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatTextAssistant: {
    color: '#1F2A44',
  },
  chatTextUser: {
    color: '#FFFDFC',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 'auto',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#FFFDF8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2DEC9',
    color: '#1F2A44',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chatSendButton: {
    backgroundColor: '#C9572F',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chatSendButtonDisabled: {
    opacity: 0.6,
  },
  chatSendText: {
    color: '#FFFDF8',
    fontWeight: '600',
  },
  emptyStateCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#F2DEC9',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 14,
  },
  emptyStateTitle: {
    color: '#1F2A44',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateCopy: {
    color: '#8B6C5A',
    marginTop: 6,
    lineHeight: 20,
  },
});
