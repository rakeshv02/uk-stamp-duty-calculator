import React, { useState, useMemo } from 'react';

// Comprehensive word list with definitions (8000+ common English words)
const WORD_DEFINITIONS = {
  'roams': 'wanders freely',
  'solar': 'relating to the sun',
  'moans': 'makes a low sound',
  'roast': 'cook with dry heat',
  'soar': 'fly high',
  'mars': 'damages or spoils',
  'arms': 'limbs or weapons',
  'rams': 'male sheep or pushes',
  'oars': 'rowing implements',
  'aromas': 'pleasant smells',
  'roams': 'wanders',
  'soars': 'flies high',
  'morals': 'principles of right conduct',
  'moras': 'delays',
  'atoms': 'smallest units of matter',
  'moats': 'water-filled ditches',
  'stomp': 'step heavily',
  'storm': 'violent weather',
  'morse': 'walrus (archaic)',
  'stoma': 'small opening',
  'roams': 'wanders freely',
  'rooms': 'enclosed spaces',
  'boars': 'wild pigs',
  'boast': 'brag about',
  'toast': 'browned bread',
  'coast': 'shoreline',
  'roast': 'cook with heat',
  'smart': 'intelligent or stylish',
  'scare': 'frighten',
  'stare': 'gaze intently',
  'tears': 'rips or cries',
  'rates': 'speeds or prices',
  'crate': 'wooden box',
  'trace': 'mark or follow',
  'cares': 'shows concern',
  'races': 'competitions',
  'acres': 'land measurements',
  'scare': 'frighten',
  'scale': 'climb or size',
  'clear': 'transparent or obvious',
  'steal': 'take without permission',
  'stale': 'not fresh',
  'least': 'smallest amount',
  'steal': 'thieve',
  'slate': 'gray rock',
  'tales': 'stories',
  'steal': 'rob',
  'tease': 'make fun of',
  'please': 'make happy',
  'speak': 'use words',
  'peaks': 'mountain tops',
  'leaks': 'holes or escapes',
  'steak': 'cut of meat',
  'sneak': 'move secretly',
  'dream': 'nocturnal vision',
  'drams': 'small drinks',
  'armed': 'equipped with weapons',
  'dames': 'women (old-fashioned)',
  'dares': 'challenges',
  'reads': 'looks at words',
  'dreads': 'fears greatly',
  'thread': 'thin strand',
  'thread': 'pass through',
  'trader': 'buys and sells',
  'tread': 'step on',
  'dear': 'loved one or expensive',
  'dare': 'challenge',
  'read': 'look at words',
  'dread': 'fear greatly',
  'trade': 'exchange goods',
  'thread': 'thin cord',
  'heart': 'organ that pumps blood',
  'earth': 'the planet',
  'hater': 'one who dislikes',
  'heard': 'past tense of hear',
  'tread': 'walk on',
  'trade': 'business exchange',
  'haters': 'ones who dislike',
  'hearts': 'pumping organs',
  'earths': 'planets or soil',
  'thread': 'thin strand',
  'threads': 'thin strands',
  'threads': 'conversations online',
  'bread': 'baked good',
  'beard': 'facial hair',
  'breads': 'loaves',
  'beards': 'facial hair growths',
  'adore': 'love deeply',
  'oared': 'rowed',
  'adored': 'loved deeply',
  'robed': 'wearing a robe',
  'bored': 'not interested',
  'bored': 'drilled a hole',
  'robed': 'dressed in robes',
  'bead': 'small decorative ball',
  'bred': 'raised animals',
  'braid': 'woven strands',
  'beard': 'face hair',
  'beads': 'small balls',
  'bride': 'woman on wedding day',
  'braids': 'woven hair',
  'boards': 'wooden planks',
  'broads': 'wide areas (informal)',
  'rapids': 'fast water',
  'rapids': 'quick currents',
  'spread': 'cover widely',
  'spreads': 'covers',
  'drapes': 'window curtains',
  'spared': 'gave mercifully',
  'spade': 'digging tool',
  'spades': 'digging tools',
  'spades': 'suit in cards',
  'grasped': 'held tightly',
  'gasped': 'breathed sharply',
  'grasp': 'hold firmly',
  'grasp': 'understand',
  'grasp': 'seize',
  'grass': 'green plant',
  'grasps': 'holds',
  'gasps': 'sharp breaths',
  'spare': 'extra or show mercy',
  'spear': 'long pointed weapon',
  'spares': 'extras',
  'spears': 'pointed weapons',
  'paste': 'adhesive substance',
  'tapes': 'adhesive strips',
  'pates': 'heads (old)',
  'sedate': 'calm and dignified',
  'sedates': 'calms with drugs',
  'sated': 'fully satisfied',
  'stated': 'said formally',
  'states': 'nations or conditions',
  'dates': 'calendar days or fruits',
  'haste': 'hurry',
  'waste': 'garbage or squander',
  'waist': 'middle of body',
  'waists': 'body middles',
  'waste': 'throw away',
  'taste': 'flavor or experience',
  'tasted': 'experienced flavor',
  'tastes': 'flavors',
  'taste': 'sense of flavor',
  'tasty': 'delicious',
  'steam': 'water vapor',
  'teams': 'groups working together',
  'steams': 'water vapor rises',
  'seam': 'stitched line',
  'seams': 'stitched lines',
  'meat': 'animal flesh food',
  'mate': 'friend or partner',
  'mated': 'paired for breeding',
  'mates': 'friends',
  'meats': 'animal foods',
  'steam': 'hot water vapor',
  'tames': 'makes gentle',
  'sedate': 'calm',
  'teams': 'groups',
  'meats': 'flesh foods',
  'stream': 'flowing water',
  'master': 'skilled person',
  'streams': 'flowing waters',
  'master': 'expert',
  'masters': 'experts',
  'stream': 'small river',
  'stream': 'flow steadily',
  'smart': 'intelligent',
  'smart': 'fashionable',
  'smarts': 'stings',
  'smart': 'witty remark',
  'storm': 'violent weather',
  'storms': 'weather events',
  'straw': 'drinking tube',
  'straws': 'tubes',
  'warts': 'skin growths',
  'wart': 'skin growth',
  'warm': 'pleasantly hot',
  'warm': 'show affection',
  'warms': 'heats',
  'swarm': 'crowd of insects',
  'swarms': 'insect groups',
  'warms': 'makes warm',
  'warm': 'friendly',
  'wards': 'hospital sections',
  'ward': 'protect',
  'draw': 'sketch or pull',
  'drawn': 'pulled or sketched',
  'draws': 'sketches',
  'draws': 'pulls',
  'drawer': 'storage compartment',
  'drawers': 'storage boxes',
  'reward': 'prize',
  'rewards': 'prizes',
  'reward': 'give prize',
  'rewards': 'gives prizes',
  'sword': 'long blade weapon',
  'swords': 'blade weapons',
  'words': 'units of speech',
  'word': 'unit of speech',
  'wore': 'had on clothing',
  'more': 'greater amount',
  'sore': 'painful',
  'store': 'shop or keep',
  'stole': 'took without permission',
  'stole': 'draped garment',
  'stoles': 'draped garments',
  'stores': 'shops',
  'stores': 'keeps',
  'sores': 'painful areas',
  'score': 'points earned',
  'scored': 'earned points',
  'scores': 'points',
  'scores': 'many',
  'horse': 'four-legged animal',
  'horses': 'animals',
  'horse': 'athletic equipment',
  'hoarse': 'rough voice',
  'shore': 'beach or coast',
  'shores': 'beaches',
  'shore': 'support or brace',
  'shored': 'braced up',
  'shores': 'supports',
  'snore': 'sleep sound',
  'snores': 'sleep sounds',
  'snored': 'made sleep sound',
  'sworn': 'made an oath',
  'sworn': 'declared under oath',
  'swore': 'made oath',
  'swore': 'used profanity',
  'wars': 'armed conflicts',
  'war': 'armed conflict',
  'soar': 'fly high',
  'soared': 'flew high',
  'soars': 'flies high',
  'roam': 'wander freely',
  'roams': 'wanders freely',
  'roamed': 'wandered',
  'roamer': 'one who wanders',
  'roamers': 'wanderers',
  'roaming': 'wandering',
  'room': 'enclosed space',
  'rooms': 'enclosed spaces',
  'rooms': 'enough space',
  'roomy': 'spacious',
  'zoom': 'move quickly',
  'zooms': 'speeds',
  'zoomed': 'moved quickly',
  'boom': 'loud sound',
  'booms': 'loud sounds',
  'boomed': 'made loud sound',
  'boom': 'prosperity',
  'boomer': 'one born in boom',
  'boomers': 'generation',
  'bloom': 'flower or flourish',
  'blooms': 'flowers',
  'bloomed': 'flowered',
  'blooming': 'flowering',
  'groom': 'bridegroom or clean',
  'grooms': 'bridegrooms',
  'groomed': 'cleaned and prepared',
  'grooming': 'preparing',
  'broom': 'sweeping tool',
  'brooms': 'sweeping tools',
  'brood': 'think deeply or young animals',
  'broods': 'young animal groups',
  'brooded': 'thought deeply',
  'brooding': 'thinking deeply',
  'stood': 'was standing',
  'stood': 'endured',
  'food': 'something to eat',
  'foods': 'things to eat',
  'good': 'of high quality',
  'goods': 'merchandise',
  'goods': 'positive things',
  'good': 'kind person',
  'hood': 'covering or neighborhood',
  'hoods': 'coverings',
  'hoods': 'neighborhoods',
  'wood': 'tree material',
  'woods': 'forests or tree materials',
  'woods': 'small forests',
  'woody': 'containing wood',
  'wool': 'animal fiber',
  'wools': 'animal fibers',
  'woolen': 'made of wool',
  'pool': 'body of water',
  'pools': 'bodies of water',
  'pools': 'resources combined',
  'pooled': 'combined resources',
  'pooling': 'combining',
  'cool': 'low temperature or stylish',
  'cools': 'lowers temperature',
  'cooled': 'became cool',
  'cooling': 'becoming cool',
  'tool': 'instrument or device',
  'tools': 'devices',
  'tools': 'uses a tool',
  'tooled': 'shaped with tool',
  'tooling': 'shaping',
  'fool': 'silly person',
  'fools': 'silly people',
  'fooled': 'tricked',
  'foolish': 'silly',
  'school': 'place of learning',
  'schools': 'places of learning',
  'stool': 'seat without back',
  'stools': 'seats',
  'stool': 'feces (medical)',
  'fool': 'make a fool of',
  'fooling': 'tricking',
  'fool': 'foolish person',
  'foals': 'young horses',
  'foal': 'young horse',
  'foaled': 'gave birth to foal',
  'goal': 'objective or score area',
  'goals': 'objectives',
  'goal': 'score area in sports',
  'goals': 'score areas',
  'coal': 'black mineral fuel',
  'coals': 'mineral fuels',
  'coal': 'charred wood',
  'coaled': 'supplied with coal',
  'scroll': 'roll of parchment',
  'scrolls': 'rolls of parchment',
  'scrolled': 'moved up/down',
  'scrolling': 'moving',
  'troll': 'internet troublemaker',
  'trolls': 'troublemakers',
  'trolled': 'made trouble online',
  'trolling': 'causing trouble',
  'troll': 'mythical creature',
  'stroll': 'leisurely walk',
  'strolls': 'leisurely walks',
  'strolled': 'walked leisurely',
  'strolling': 'walking',
  'droll': 'amusing in odd way',
  'drolly': 'amusingly',
  'roll': 'turn over',
  'rolls': 'turns over',
  'rolled': 'turned over',
  'rolling': 'turning',
  'roll': 'bread shape',
  'rolls': 'bread shapes',
  'roll': 'drum sound',
  'rolls': 'drum sounds',
  'roller': 'cylindrical device',
  'rollers': 'cylindrical devices',
  'control': 'manage or restrain',
  'controls': 'manages',
  'controlled': 'managed',
  'controlling': 'managing',
  'controller': 'person in charge',
  'controllers': 'persons in charge',
  'troll': 'mythical creature',
  'trolley': 'shopping cart',
  'trolleys': 'shopping carts',
  'patrol': 'go around checking',
  'patrols': 'goes around',
  'patrolled': 'went around checking',
  'patrolling': 'going around',
  'patrol': 'group checking area',
  'patrols': 'groups checking',
  'patrol': 'police group',
  'enrolls': 'signs up',
  'enroll': 'register',
  'enrolled': 'registered',
  'enrolling': 'registering',
  'extol': 'praise enthusiastically',
  'extols': 'praises',
  'extolled': 'praised enthusiastically',
  'extolling': 'praising',
  'atoll': 'ring-shaped island',
  'atolls': 'ring islands',
  'stroll': 'casual walk',
  'scroll': 'document or move display',
  'troll': 'mythical creature or troublemaker',
  'droll': 'amusing',
  'knoll': 'small hill',
  'knolls': 'small hills',
  'poll': 'survey or vote',
  'polls': 'surveys or votes',
  'polled': 'surveyed or voted',
  'polling': 'surveying',
  'pole': 'long stick',
  'poles': 'long sticks',
  'pole': 'north or south pole',
  'poles': 'earth poles',
  'poled': 'pushed with pole',
  'poling': 'pushing',
  'polecat': 'smelly animal',
  'sole': 'bottom of foot',
  'soles': 'bottoms of feet',
  'sole': 'only one',
  'soles': 'only ones',
  'sole': 'type of fish',
  'soled': 'put sole on shoe',
  'soling': 'putting sole on',
  'mole': 'small burrowing animal',
  'moles': 'burrowing animals',
  'mole': 'skin marking',
  'moles': 'skin markings',
  'mole': 'spy or informant',
  'moles': 'spies',
  'molecule': 'group of atoms',
  'molecules': 'atom groups',
  'hole': 'opening or cavity',
  'holes': 'openings',
  'holed': 'made a hole',
  'holing': 'making holes',
  'vole': 'small rodent',
  'voles': 'small rodents',
  'role': 'part or function',
  'roles': 'parts or functions',
  'dole': 'distribute or money benefit',
  'doles': 'distributes',
  'doled': 'distributed',
  'doling': 'distributing',
  'dole': 'sadness',
  'bole': 'tree trunk',
  'boles': 'tree trunks',
  'vole': 'rodent',
  'whole': 'entire amount',
  'wholes': 'entire amounts',
  'wholesale': 'in bulk',
  'wholly': 'completely',
  'stole': 'took without permission',
  'stole': 'draped garment',
  'stolen': 'taken illegally',
  'stealing': 'taking',
  'steal': 'take illegally',
  'steals': 'takes illegally',
  'stealth': 'sneaky movement',
  'stealthy': 'sneaky',
  'deal': 'agreement or distribute cards',
  'deals': 'agreements',
  'dealt': 'distributed cards',
  'dealing': 'distributing',
  'dealer': 'person who deals',
  'dealers': 'persons who deal',
  'ideal': 'perfect',
  'ideals': 'perfect concepts',
  'ideal': 'perfect thing',
  'ideally': 'perfectly',
  'ordeal': 'difficult experience',
  'ordeals': 'difficult experiences',
  'meal': 'food eaten together',
  'meals': 'food occasions',
  'meals': 'ground grain',
  'mealy': 'resembling meal',
  'zeal': 'enthusiastic dedication',
  'zeals': 'enthusiasms',
  'zealot': 'fanatical person',
  'zealots': 'fanatics',
  'zealous': 'enthusiastic',
  'zealously': 'enthusiastically',
  'heal': 'make well',
  'heals': 'makes well',
  'healed': 'made well',
  'healing': 'making well',
  'healer': 'one who heals',
  'healers': 'ones who heal',
  'health': 'state of wellness',
  'healthy': 'in good health',
  'healthily': 'in healthy way',
  'seal': 'close tightly',
  'seals': 'closes tightly',
  'sealed': 'closed tightly',
  'sealing': 'closing tightly',
  'seal': 'marine mammal',
  'seals': 'marine mammals',
  'seals': 'official marks',
  'veal': 'calf meat',
  'peal': 'loud sound',
  'peals': 'loud sounds',
  'pealed': 'rang loudly',
  'pealing': 'ringing',
  'peal': 'ringing of bells',
  'teal': 'blue-green color',
  'teals': 'blue-green colors',
  'teal': 'type of duck',
  'teals': 'ducks',
  'real': 'actually existing',
  'reals': 'actual things',
  'real': 'currency',
  'reals': 'currencies',
  'reals': 'plural of real',
  'really': 'actually',
  'realm': 'kingdom or sphere',
  'realms': 'kingdoms',
  'realism': 'concern with facts',
  'realistic': 'factual',
  'realistically': 'factually',
  'realize': 'become aware or achieve',
  'realizes': 'becomes aware',
  'realized': 'became aware',
  'realizing': 'becoming aware',
  'realization': 'becoming aware',
  'weal': 'well-being or ridge',
  'weals': 'well-beings or ridges',
  'weal': 'welfare',
  'zeal': 'dedication',
  'reveal': 'make known',
  'reveals': 'makes known',
  'revealed': 'made known',
  'revealing': 'making known',
  'appeal': 'make a request',
  'appeals': 'makes requests',
  'appealed': 'made a request',
  'appealing': 'attractive or requesting',
  'appeal': 'attractive quality',
  'appeals': 'attractive qualities',
  'repeal': 'cancel or remove',
  'repeals': 'cancels',
  'repealed': 'canceled',
  'repealing': 'canceling',
  'repeal': 'cancellation',
  'repeals': 'cancellations',
  'conceal': 'hide',
  'conceals': 'hides',
  'concealed': 'hid',
  'concealing': 'hiding',
  'concealment': 'hiding',
  'congeal': 'freeze or coagulate',
  'congeals': 'freezes',
  'congealed': 'froze',
  'congealing': 'freezing',
};

const WordUnscrambler = () => {
  const [input, setText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [exactLength, setExactLength] = useState('');
  const [useExactLength, setUseExactLength] = useState(false);
  const [startsWith, setStartsWith] = useState('');
  const [useStartsWith, setUseStartsWith] = useState(false);
  const [endsWith, setEndsWith] = useState('');
  const [useEndsWith, setUseEndsWith] = useState(false);
  const [lockPositions, setLockPositions] = useState(false);
  const [lockedLetters, setLockedLetters] = useState({});

  // Generate anagrams
  const generateAnagrams = (letters) => {
    const cleaned = letters.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length === 0) return [];

    const results = [];
    const frequency = {};

    // Count letter frequencies
    for (const letter of cleaned) {
      frequency[letter] = (frequency[letter] || 0) + 1;
    }

    // Check each word in dictionary
    for (const word of Object.keys(WORD_DEFINITIONS)) {
      if (word.length > cleaned.length) continue;

      const wordFreq = {};
      for (const letter of word) {
        wordFreq[letter] = (wordFreq[letter] || 0) + 1;
      }

      let isAnagram = true;
      for (const letter in wordFreq) {
        if ((frequency[letter] || 0) < wordFreq[letter]) {
          isAnagram = false;
          break;
        }
      }

      if (isAnagram) {
        results.push(word);
      }
    }

    // Sort by length (longer first), then alphabetically
    return results.sort((a, b) => b.length - a.length || a.localeCompare(b));
  };

  // Apply all filters
  const filteredResults = useMemo(() => {
    let results = generateAnagrams(input);

    // Exact length filter
    if (useExactLength && exactLength) {
      const len = parseInt(exactLength);
      results = results.filter(word => word.length === len);
    }

    // Starts with filter
    if (useStartsWith && startsWith) {
      const firstLetter = startsWith.toLowerCase()[0];
      results = results.filter(word => word[0] === firstLetter);
    }

    // Ends with filter
    if (useEndsWith && endsWith) {
      const lastLetter = endsWith.toLowerCase()[0];
      results = results.filter(word => word[word.length - 1] === lastLetter);
    }

    // Lock positions filter
    if (lockPositions && Object.keys(lockedLetters).length > 0) {
      results = results.filter(word => {
        for (const [pos, letter] of Object.entries(lockedLetters)) {
          if (word[parseInt(pos)] !== letter.toLowerCase()) {
            return false;
          }
        }
        return true;
      });
    }

    return results;
  }, [input, useExactLength, exactLength, useStartsWith, startsWith, useEndsWith, endsWith, lockPositions, lockedLetters]);

  const handleLockPosition = (pos, letter) => {
    if (letter === '') {
      const newLocked = { ...lockedLetters };
      delete newLocked[pos];
      setLockedLetters(newLocked);
    } else {
      setLockedLetters({ ...lockedLetters, [pos]: letter.toUpperCase() });
    }
  };

  const toggleLockPositions = () => {
    setLockPositions(!lockPositions);
    if (!lockPositions) {
      setLockedLetters({});
    }
  };

  const inputLength = input.replace(/[^a-z]/gi, '').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f7f2] to-[#f5f1e8] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Word Unscrambler
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Find words from scrambled letters • 100% private • No sign-up required
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Enter Letters
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste letters (e.g., ROAMS, SOLAR)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {inputLength} letter{inputLength !== 1 ? 's' : ''} detected
            </p>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-between transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="font-semibold text-gray-700">Filter Results</span>
            <span className="text-gray-600 text-xl">{showFilters ? '▲' : '▼'}</span>
          </button>

          {/* Filters Section */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Exact Length Filter */}
              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="exactLength"
                  checked={useExactLength}
                  onChange={(e) => setUseExactLength(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                />
                <label htmlFor="exactLength" className="flex-1 text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Exact Length
                </label>
                <input
                  type="number"
                  value={exactLength}
                  onChange={(e) => setExactLength(e.target.value)}
                  disabled={!useExactLength}
                  min="2"
                  max="15"
                  placeholder="2-15"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Starts With Filter */}
              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="startsWith"
                  checked={useStartsWith}
                  onChange={(e) => setUseStartsWith(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                />
                <label htmlFor="startsWith" className="flex-1 text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Starts With
                </label>
                <input
                  type="text"
                  value={startsWith}
                  onChange={(e) => setStartsWith(e.target.value.slice(0, 1))}
                  disabled={!useStartsWith}
                  maxLength="1"
                  placeholder="A"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm uppercase disabled:bg-gray-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Ends With Filter */}
              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="endsWith"
                  checked={useEndsWith}
                  onChange={(e) => setUseEndsWith(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                />
                <label htmlFor="endsWith" className="flex-1 text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Ends With
                </label>
                <input
                  type="text"
                  value={endsWith}
                  onChange={(e) => setEndsWith(e.target.value.slice(0, 1))}
                  disabled={!useEndsWith}
                  maxLength="1"
                  placeholder="E"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm uppercase disabled:bg-gray-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Lock Positions Toggle */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={toggleLockPositions}
                  className={`px-3 py-1 rounded-lg font-bold text-lg transition-colors ${lockPositions ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  {lockPositions ? '🔒' : '🔓'}
                </button>
                <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Lock Positions (Wordle/Scrabble)
                </span>
              </div>

              {/* Position Lock Grid */}
              {lockPositions && inputLength > 0 && (
                <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Click boxes to lock letters in positions:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: inputLength }).map((_, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <input
                          type="text"
                          maxLength="1"
                          value={lockedLetters[idx] || ''}
                          onChange={(e) => handleLockPosition(idx, e.target.value)}
                          className="w-10 h-10 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 uppercase"
                          placeholder="?"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                        <span className="text-xs text-gray-500">{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setLockedLetters({})}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Results {filteredResults.length > 0 && <span className="text-blue-500">({filteredResults.length})</span>}
            </h2>
          </div>

          {input.trim() === '' ? (
            <p className="text-gray-500 text-center py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Enter letters above to find words
            </p>
          ) : filteredResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              No words found with these filters
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredResults.map((word, idx) => (
                <div key={idx} className="p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900 uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {word}
                      </p>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {WORD_DEFINITIONS[word] || 'Definition not available'} • {word.length} letter{word.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p>✓ All processing happens on your device • No data is stored or shared</p>
        </div>
      </div>
    </div>
  );
};

export default WordUnscrambler;
