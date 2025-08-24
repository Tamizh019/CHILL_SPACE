// ===== EMOJI.JS - COMPLETE EMOJI SYSTEM =====

// ===== COMPREHENSIVE EMOJI SEARCH DATABASE =====
const emojiSearchData = {
    // Smileys & Emotions
    '😀': ['grinning', 'face', 'smile', 'happy', 'joy', 'grin', 'cheerful'],
    '😃': ['grinning', 'face', 'happy', 'smile', 'joy', 'excited'],
    '😄': ['grinning', 'face', 'smile', 'happy', 'joy', 'laugh', 'cheerful'],
    '😁': ['beaming', 'face', 'smile', 'happy', 'joy', 'kawaii', 'grin'],
    '😅': ['grinning', 'face', 'sweat', 'smile', 'happy', 'relief', 'nervous'],
    '😂': ['face', 'tears', 'joy', 'laugh', 'happy', 'cry', 'lol', 'funny'],
    '🤣': ['rolling', 'floor', 'laughing', 'face', 'rotfl', 'lol', 'hilarious'],
    '😊': ['smiling', 'face', 'blush', 'happy', 'shy', 'cute'],
    '😇': ['smiling', 'face', 'halo', 'angel', 'innocent', 'pure'],
    '🙂': ['slightly', 'smiling', 'face', 'happy', 'content'],
    '🙃': ['upside', 'down', 'face', 'flipped', 'silly', 'sarcastic'],
    '😉': ['winking', 'face', 'happy', 'mischievous', 'secret', 'flirt'],
    '😌': ['relieved', 'face', 'happy', 'relax', 'blissful', 'peaceful'],
    '😍': ['smiling', 'face', 'heart', 'eyes', 'love', 'crush', 'adore'],
    '🥰': ['smiling', 'face', 'hearts', 'love', 'affection', 'adorable'],
    '😘': ['face', 'blowing', 'kiss', 'love', 'like', 'romance'],
    '😗': ['kissing', 'face', 'love', 'like', 'affection', 'romance'],
    '😙': ['kissing', 'face', 'smiling', 'eyes', 'affection', 'love'],
    '😚': ['kissing', 'face', 'closed', 'eyes', 'love', 'romance'],
    '😋': ['face', 'savoring', 'delicious', 'food', 'yum', 'tasty', 'hungry'],
    '😛': ['face', 'tongue', 'playful', 'mischievous', 'silly'],
    '😝': ['face', 'tongue', 'winking', 'eye', 'joke', 'playful', 'silly'],
    '😜': ['winking', 'face', 'tongue', 'playful', 'silly', 'crazy'],
    '🤪': ['zany', 'face', 'goofy', 'wacky', 'crazy', 'wild'],
    '🤨': ['face', 'raised', 'eyebrow', 'suspicious', 'sceptical'],
    '🧐': ['face', 'monocle', 'stuffy', 'wealthy', 'posh'],
    '🤓': ['nerd', 'face', 'geek', 'smart', 'clever'],
    '😎': ['smiling', 'face', 'sunglasses', 'cool', 'summer'],
    '🤩': ['grinning', 'face', 'star', 'eyes', 'starry'],
    '🥳': ['partying', 'face', 'celebration', 'birthday', 'party'],
    '😏': ['smirking', 'face', 'flirt', 'sexual', 'suggestive'],
    '😒': ['unamused', 'face', 'indifference', 'bored', 'straight'],
    '😞': ['disappointed', 'face', 'sad', 'upset', 'depressed'],
    '😔': ['pensive', 'face', 'sad', 'depressed', 'upset'],
    '😟': ['worried', 'face', 'concern', 'nervous', 'sad'],
    '😕': ['confused', 'face', 'indifference', 'huh', 'weird'],
    '🙁': ['slightly', 'frowning', 'face', 'sad', 'disappointed'],
    '☹️': ['frowning', 'face', 'sad', 'upset', 'depressed'],
    '😣': ['persevering', 'face', 'sick', 'no', 'upset'],
    '😖': ['confounded', 'face', 'confused', 'sick', 'unwell'],
    '😫': ['tired', 'face', 'sick', 'whine', 'upset'],
    '😩': ['weary', 'face', 'tired', 'sleepy', 'sad'],
    '🥺': ['pleading', 'face', 'puppy', 'eyes', 'begging'],
    '😢': ['crying', 'face', 'tears', 'sad', 'depressed'],
    '😭': ['loudly', 'crying', 'face', 'tears', 'sad'],
    '😤': ['face', 'steam', 'nose', 'gas', 'proud'],
    '😠': ['angry', 'face', 'mad', 'annoyed', 'upset'],
    '😡': ['pouting', 'face', 'angry', 'mad', 'hate'],
    '🤬': ['face', 'symbols', 'mouth', 'swearing', 'cursing'],
    '🤯': ['exploding', 'head', 'mind', 'blown', 'amazed'],
    '😳': ['flushed', 'face', 'blush', 'shy', 'flattered'],
    '🥵': ['hot', 'face', 'heat', 'sweating', 'fever'],
    '🥶': ['cold', 'face', 'blue', 'freezing', 'frozen'],
    '😱': ['face', 'screaming', 'fear', 'horror', 'shock'],
    '😨': ['fearful', 'face', 'scared', 'terrified', 'nervous'],
    '😰': ['anxious', 'face', 'sweat', 'nervous', 'scared'],
    '😥': ['sad', 'relieved', 'face', 'phew', 'sweat'],
    '😓': ['downcast', 'face', 'sweat', 'tired', 'exercise'],
    '🤗': ['hugging', 'face', 'hug', 'thank', 'you'],
    '🤔': ['thinking', 'face', 'hm', 'think', 'consider'],
    '🤭': ['face', 'hand', 'mouth', 'quiet', 'whoops'],
    '🤫': ['shushing', 'face', 'quiet', 'shhh', 'discretion'],
    '🤥': ['lying', 'face', 'liar', 'pinocchio', 'dishonesty'],
    '🫡': ['bow', 'face', 'respect', 'thank', 'you' , 'salute'],
  
    // Animals
    '🐶': ['dog', 'face', 'pet', 'puppy', 'woof', 'loyal'],
    '🐱': ['cat', 'face', 'pet', 'kitten', 'meow', 'feline'],
    '🐭': ['mouse', 'face', 'pet', 'rodent'],
    '🐹': ['hamster', 'face', 'pet', 'cute'],
    '🐰': ['rabbit', 'face', 'pet', 'spring', 'bunny'],
    '🦊': ['fox', 'face', 'animal', 'nature'],
    '🐻': ['bear', 'face', 'animal', 'nature'],
    '🐼': ['panda', 'face', 'animal', 'nature', 'china'],
    '🐨': ['koala', 'face', 'animal', 'nature', 'australia'],
    '🐯': ['tiger', 'face', 'animal', 'cat', 'danger'],
    '🦁': ['lion', 'face', 'animal', 'cat', 'king'],
    '🐮': ['cow', 'face', 'animal', 'milk', 'moo'],
    '🐷': ['pig', 'face', 'animal', 'oink'],
    '🐸': ['frog', 'face', 'animal', 'croak', 'toad'],
    '🐵': ['monkey', 'face', 'animal', 'nature', 'circus'],
  
    // Food & Drink
    '🍎': ['apple', 'fruit', 'red', 'food', 'healthy'],
    '🍐': ['pear', 'fruit', 'food', 'green'],
    '🍊': ['orange', 'fruit', 'food', 'citrus'],
    '🍋': ['lemon', 'fruit', 'food', 'sour', 'citrus'],
    '🍌': ['banana', 'fruit', 'food', 'potassium', 'yellow'],
    '🍉': ['watermelon', 'fruit', 'food', 'summer', 'red'],
    '🍇': ['grapes', 'fruit', 'food', 'wine', 'purple'],
    '🍓': ['strawberry', 'fruit', 'food', 'berry', 'red'],
    '🍒': ['cherries', 'fruit', 'food', 'pair', 'red'],
    '🍑': ['peach', 'fruit', 'food', 'fuzzy'],
    '🥭': ['mango', 'fruit', 'food', 'tropical'],
    '🍍': ['pineapple', 'fruit', 'food', 'tropical'],
    '🥥': ['coconut', 'fruit', 'food', 'tropical'],
    '🥝': ['kiwi', 'fruit', 'food', 'green'],
    '🍅': ['tomato', 'fruit', 'vegetable', 'food', 'red'],
    '🥑': ['avocado', 'fruit', 'food', 'green', 'healthy'],
    '🍔': ['burger', 'food', 'fast', 'hamburger'],
    '🍟': ['fries', 'food', 'fast', 'potato'],
    '🍕': ['pizza', 'food', 'italian', 'slice'],
    '🌭': ['hotdog', 'food', 'sausage'],
    '🥪': ['sandwich', 'food', 'lunch'],
    '🌮': ['taco', 'food', 'mexican'],
    '🌯': ['burrito', 'food', 'mexican', 'wrap'],
  
    // Activities & Sports
    '⚽': ['soccer', 'football', 'ball', 'sport'],
    '🏀': ['basketball', 'ball', 'sport'],
    '🏈': ['football', 'american', 'ball', 'sport'],
    '⚾': ['baseball', 'ball', 'sport'],
    '🎾': ['tennis', 'ball', 'sport'],
    '🏐': ['volleyball', 'ball', 'sport'],
    '🏉': ['rugby', 'ball', 'sport'],
    '🎱': ['pool', 'billiards', 'eight', 'ball'],
    '🎮': ['video', 'game', 'controller', 'gaming'],
    '🎯': ['dart', 'target', 'bullseye'],
    '🎲': ['dice', 'game', 'luck'],
    '🎪': ['circus', 'tent', 'entertainment'],
    '🎭': ['theater', 'drama', 'masks'],
    '🎨': ['art', 'palette', 'paint', 'creative'],
    '🎬': ['movie', 'film', 'cinema'],
    '🎤': ['microphone', 'sing', 'music'],
    '🎧': ['headphones', 'music', 'listen'],
    '🎵': ['musical', 'note', 'music'],
    '🎶': ['musical', 'notes', 'music'],
  
    // Objects & Technology
    '💡': ['light', 'bulb', 'idea', 'thinking', 'eureka'],
    '🔦': ['flashlight', 'light', 'camping', 'torch'],
    '💻': ['laptop', 'computer', 'technology'],
    '🖥️': ['desktop', 'computer', 'monitor'],
    '⌨️': ['keyboard', 'typing', 'computer'],
    '🖱️': ['mouse', 'computer', 'click'],
    '🖨️': ['printer', 'document', 'office'],
    '📱': ['mobile', 'phone', 'smartphone'],
    '☎️': ['telephone', 'phone', 'call'],
    '📞': ['phone', 'receiver', 'call'],
    '📟': ['pager', 'communication'],
    '📠': ['fax', 'machine', 'document'],
    '📺': ['television', 'tv', 'screen'],
    '📻': ['radio', 'music', 'broadcast'],
    '🎙️': ['microphone', 'studio', 'recording'],
    '⏰': ['alarm', 'clock', 'time'],
    '⌚': ['watch', 'time', 'wrist'],
    '📡': ['satellite', 'antenna', 'signal'],
    '🔋': ['battery', 'power', 'energy'],
    '🔌': ['plug', 'electric', 'power'],
  
    // Symbols & Hearts
    '❤️': ['heart', 'love', 'like', 'affection', 'valentines'],
    '🧡': ['orange', 'heart', 'love', 'like', 'affection'],
    '💛': ['yellow', 'heart', 'love', 'like', 'affection'],
    '💚': ['green', 'heart', 'love', 'like', 'affection'],
    '💙': ['blue', 'heart', 'love', 'like', 'affection'],
    '💜': ['purple', 'heart', 'love', 'like', 'affection'],
    '🖤': ['black', 'heart', 'evil', 'wicked'],
    '🤍': ['white', 'heart', 'pure', 'love'],
    '🤎': ['brown', 'heart', 'love'],
    '💔': ['broken', 'heart', 'sad', 'sorry', 'break'],
    '💕': ['two', 'hearts', 'love', 'like', 'affection'],
    '💖': ['sparkling', 'heart', 'love', 'like', 'affection'],
    '💗': ['growing', 'heart', 'love', 'like', 'affection'],
    '💘': ['heart', 'arrow', 'love', 'like', 'heart'],
    '💝': ['heart', 'box', 'love', 'like', 'affection'],
    '✨': ['sparkles', 'magic', 'clean'],
    '⭐': ['star', 'favorite', 'good'],
    '🌟': ['glowing', 'star', 'sparkle'],
    '💫': ['star', 'dizzy', 'sparkle'],
    '⚡': ['lightning', 'zap', 'electric', 'fast'],
    '🔥': ['fire', 'flame', 'hot', 'lit'],
    '💯': ['hundred', 'points', 'perfect', 'score'],
    '💢': ['anger', 'symbol', 'comic'],
    '💥': ['collision', 'explosion', 'boom'],
    '💦': ['sweat', 'droplets', 'water'],
    '💨': ['dash', 'symbol', 'wind', 'fast'],
  
    // Weather & Nature
    '☀️': ['sun', 'sunny', 'hot', 'weather'],
    '🌤️': ['sun', 'behind', 'small', 'cloud'],
    '⛅': ['sun', 'behind', 'cloud', 'partly'],
    '☁️': ['cloud', 'weather', 'sky'],
    '🌧️': ['rain', 'cloud', 'weather'],
    '⛈️': ['thunderstorm', 'lightning', 'weather'],
    '🌩️': ['lightning', 'cloud', 'thunder'],
    '🌨️': ['snow', 'cloud', 'weather'],
    '❄️': ['snowflake', 'cold', 'winter'],
    '☃️': ['snowman', 'winter', 'cold'],
    '⛄': ['snowman', 'without', 'snow'],
    '🌊': ['water', 'wave', 'ocean', 'sea'],
    '🌈': ['rainbow', 'colors', 'pride'],
    '🌙': ['crescent', 'moon', 'night'],
    '🌛': ['first', 'quarter', 'moon', 'face'],
    '🌜': ['last', 'quarter', 'moon', 'face'],
    '🌝': ['full', 'moon', 'face'],
    '🌞': ['sun', 'with', 'face'],
  
    // Flags (popular ones)
    '🏁': ['chequered', 'flag', 'racing', 'finish'],
    '🚩': ['triangular', 'flag', 'red'],
    '🎌': ['crossed', 'flags', 'japan'],
    '🏴': ['black', 'flag', 'pirate'],
    '🏳️': ['white', 'flag', 'surrender'],
    '🏳️‍🌈': ['rainbow', 'flag', 'pride', 'lgbt'],
    '🇺🇸': ['usa', 'america', 'flag', 'united', 'states'],
    '🇬🇧': ['uk', 'britain', 'flag', 'united', 'kingdom'],
    '🇮🇳': ['india', 'flag', 'indian'],
    '🇯🇵': ['japan', 'flag', 'japanese'],
    '🇰🇷': ['korea', 'flag', 'korean'],
    '🇨🇳': ['china', 'flag', 'chinese'],
    '🇫🇷': ['france', 'flag', 'french'],
    '🇩🇪': ['germany', 'flag', 'german'],
  
    // Additional popular emojis
    '👍': ['thumbs', 'up', 'like', 'good', 'yes', 'approve'],
    '👎': ['thumbs', 'down', 'dislike', 'bad', 'no', 'disapprove'],
    '👏': ['clapping', 'hands', 'applause', 'congrats'],
    '🙏': ['folded', 'hands', 'prayer', 'please', 'thanks'],
    '✅': ['checkmark', 'tick', 'yes', 'approve' ,'correct'],
    '✌️': ['victory', 'hand', 'peace', 'two'],
    '🤞': ['crossed', 'fingers', 'luck', 'hope'],
    '🤟': ['love', 'you', 'gesture', 'sign'],
    '🤘': ['sign', 'horns', 'rock', 'metal'],
    '👌': ['ok', 'hand', 'perfect', 'good'],
    '🤏': ['pinching', 'hand', 'small'],
    '✊': ['raised', 'fist', 'power'],
    '👊': ['oncoming', 'fist', 'punch'],
    '🤛': ['left', 'facing', 'fist'],
    '🤜': ['right', 'facing', 'fist'],
    '👋': ['waving', 'hand', 'hello', 'goodbye'],
    '🤚': ['raised', 'back', 'hand'],
    '🖐️': ['hand', 'with', 'fingers', 'splayed'],
    '✋': ['raised', 'hand', 'stop'],
    '🖖': ['vulcan', 'salute', 'spock'],
    '👶': ['baby', 'child', 'infant'],
    '🧒': ['child', 'young'],
    '👦': ['boy', 'male', 'child'],
    '👧': ['girl', 'female', 'child'],
    '🧑': ['person', 'adult'],
    '👱': ['person', 'blond', 'hair'],
    '👨': ['man', 'male', 'adult'],
    '🧔': ['man', 'beard'],
    '👩': ['woman', 'female', 'adult'],
    '🧓': ['older', 'person', 'adult'],
    '👴': ['old', 'man', 'elderly'],
    '👵': ['old', 'woman', 'elderly']
  };
  
  // ===== BASIC EMOJI CATEGORIES =====
  const emojiData = {
    recent: ['😊', '👍', '❤️', '😂', '🎉', '🔥', '💯', '👏', '🙏', '✨' , '✅'],
    smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎵', '🎶'],
    travel: ['✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏰', '⏱️', '⏲️', '🕰️', '🌍', '🌎', '🌏', '☀️', '🌤️', '⛅', '☁️', '🌧️', '⛈️', '🌊'],
    objects: ['💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📱', '☎️', '📞', '📺', '📻'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '✨', '⭐', '🌟', '💫', '⚡', '🔥', '💯', '👍', '👎', '👏', '🙏'],
    flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇫🇷', '🇩🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇮🇳', '🇧🇷', '🇲🇽', '🇷🇺', '🇪🇸', '🇮🇹']
  };
  
  // ===== ENHANCED EMOJI SEARCH FUNCTION =====
  function searchEmojis(query) {
    const emojiGrid = document.getElementById('emojiGrid');
    
    if (!query || query.trim() === '') {
      loadEmojis('recent');
      return;
    }
  
    // Convert query to lowercase for case-insensitive search
    const searchTerm = query.toLowerCase().trim();
    
    // Find matching emojis with relevance scoring
    const matchingEmojis = [];
    
    // Search through all emojis and their keywords
    Object.entries(emojiSearchData).forEach(([emoji, keywords]) => {
      let relevanceScore = 0;
      let hasMatch = false;
      
      // Check for exact keyword match (highest priority)
      keywords.forEach(keyword => {
        if (keyword.toLowerCase() === searchTerm) {
          relevanceScore += 100;
          hasMatch = true;
        } else if (keyword.toLowerCase().startsWith(searchTerm)) {
          relevanceScore += 50;
          hasMatch = true;
        } else if (keyword.toLowerCase().includes(searchTerm)) {
          relevanceScore += 25;
          hasMatch = true;
        }
      });
      
      if (hasMatch) {
        matchingEmojis.push({ emoji, score: relevanceScore });
      }
    });
    
    // Sort by relevance score (highest first)
    matchingEmojis.sort((a, b) => b.score - a.score);
    
    // Also search in your existing emoji data for broader coverage
    const allEmojis = Object.values(emojiData).flat();
    allEmojis.forEach(emoji => {
      // Add emojis that aren't already in results
      if (!matchingEmojis.find(item => item.emoji === emoji)) {
        // Simple fallback matching for emojis without detailed keywords
        matchingEmojis.push({ emoji, score: 1 });
      }
    });
    
    // Clear and populate grid
    emojiGrid.innerHTML = '';
    
    if (matchingEmojis.length === 0) {
      emojiGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--gray); padding: 2rem;">
          <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>No emojis found for "${query}"</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.7;">
            Try searching for: <strong>happy</strong>, <strong>sad</strong>, <strong>love</strong>, <strong>food</strong>, <strong>animals</strong>
          </p>
        </div>
      `;
      return;
    }
    
    // Limit results to prevent overwhelming UI
    const displayEmojis = matchingEmojis.slice(0, 48);
    
    displayEmojis.forEach(({ emoji }) => {
      const button = document.createElement('button');
      button.className = 'emoji-item';
      button.textContent = emoji;
      button.onclick = () => insertEmoji(emoji);
      
      // Add hover effect showing keywords (optional)
      const keywords = emojiSearchData[emoji];
      if (keywords) {
        button.title = keywords.slice(0, 3).join(', ');
      }
      
      emojiGrid.appendChild(button);
    });
    
    console.log(`🔍 Found ${matchingEmojis.length} emojis for "${query}"`);
  }
  
  // ===== EMOJI PICKER FUNCTIONS =====
  function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    const emojiToggle = document.getElementById('emojiToggle');
    
    if (emojiPicker.style.display === 'none') {
      emojiPicker.style.display = 'block';
      emojiToggle.classList.add('active');
      loadEmojis('recent');
      
      // Add quick search buttons
      addQuickSearchButtons();
      
      // Focus search input
      setTimeout(() => {
        document.getElementById('emojiSearch').focus();
      }, 100);
    } else {
      emojiPicker.style.display = 'none';
      emojiToggle.classList.remove('active');
      document.getElementById('chatInput').focus();
    }
  }
  
  function loadEmojis(category) {
    const emojiGrid = document.getElementById('emojiGrid');
    const emojis = emojiData[category] || emojiData.recent;
    
    emojiGrid.innerHTML = '';
    emojis.forEach(emoji => {
      const button = document.createElement('button');
      button.className = 'emoji-item';
      button.textContent = emoji;
      button.onclick = () => insertEmoji(emoji);
      emojiGrid.appendChild(button);
    });
  }
  
  function insertEmoji(emoji) {
    const chatInput = document.getElementById('chatInput');
    const codeInput = document.getElementById('codeInput');
    const codeToggle = document.getElementById('codeToggle');
    
    if (codeToggle && codeToggle.classList.contains('active')) {
      const start = codeInput.selectionStart;
      const end = codeInput.selectionEnd;
      const text = codeInput.value;
      codeInput.value = text.substring(0, start) + emoji + text.substring(end);
      codeInput.setSelectionRange(start + emoji.length, start + emoji.length);
      codeInput.focus();
    } else {
      const start = chatInput.selectionStart;
      const end = chatInput.selectionEnd;
      const text = chatInput.value;
      chatInput.value = text.substring(0, start) + emoji + text.substring(end);
      chatInput.setSelectionRange(start + emoji.length, start + emoji.length);
      chatInput.focus();
    }
  }
  
  // ===== QUICK SEARCH BUTTONS =====
  function addQuickSearchButtons() {
    const emojiPickerHeader = document.querySelector('.emoji-picker-header');
    
    if (emojiPickerHeader && !document.getElementById('quickSearchButtons')) {
      const quickSearchDiv = document.createElement('div');
      quickSearchDiv.id = 'quickSearchButtons';
      quickSearchDiv.style.cssText = `
        display: flex; gap: 0.25rem; flex-wrap: wrap; 
        margin-top: 0.5rem; padding: 0.25rem 0;
      `;
      
      const quickTerms = ['happy', 'sad', 'love', 'food', 'animals', 'party', 'work', 'sports'];
      
      quickTerms.forEach(term => {
        const btn = document.createElement('button');
        btn.textContent = term;
        btn.type = 'button';
        btn.style.cssText = `
          background: var(--card-border); color: var(--gray);
          border: none; padding: 0.2rem 0.5rem; border-radius: 12px;
          font-size: 0.7rem; cursor: pointer; transition: all 0.2s;
        `;
        
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          document.getElementById('emojiSearch').value = term;
          searchEmojis(term);
        };
        
        btn.onmouseenter = () => {
          btn.style.background = 'var(--primary)';
          btn.style.color = 'white';
        };
        
        btn.onmouseleave = () => {
          btn.style.background = 'var(--card-border)';
          btn.style.color = 'var(--gray)';
        };
        
        quickSearchDiv.appendChild(btn);
      });
      
      emojiPickerHeader.appendChild(quickSearchDiv);
    }
  }
  
  // ===== ENHANCED SEARCH INPUT HANDLING =====
  function initializeEmojiSearchEvents() {
    const emojiSearch = document.getElementById('emojiSearch');
    
    if (emojiSearch) {
      // Add real-time search with debouncing
      let searchTimeout;
      
      emojiSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        // Debounce search to avoid too many calls
        searchTimeout = setTimeout(() => {
          searchEmojis(e.target.value);
        }, 300);
      });
      
      // Add placeholder suggestions
      emojiSearch.placeholder = "Search: happy, love, food, animals...";
      
      // Clear search on escape
      emojiSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          emojiSearch.value = '';
          loadEmojis('recent');
          emojiSearch.blur();
        }
      });
      
      // Enter on search to select first emoji
      emojiSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const firstEmoji = document.querySelector('.emoji-item');
          if (firstEmoji) {
            firstEmoji.click();
          }
        }
      });
    }
  }
  
  // ===== EMOJI CATEGORY EVENT LISTENERS =====
  function initializeEmojiCategoryEvents() {
    const emojiCategories = document.querySelectorAll('.emoji-category');
    if (emojiCategories.length > 0) {
      emojiCategories.forEach(button => {
        button.addEventListener('click', (e) => {
          document.querySelectorAll('.emoji-category').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          loadEmojis(e.target.dataset.category);
        });
      });
    }
  }
  
  // ===== KEYBOARD SHORTCUTS =====
  function initializeEmojiKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const emojiPicker = document.getElementById('emojiPicker');
      const isEmojiPickerOpen = emojiPicker && emojiPicker.style.display === 'block';
      
      // Ctrl/Cmd + ; to toggle emoji picker
      if ((e.ctrlKey || e.metaKey) && e.key === ';') {
        e.preventDefault();
        toggleEmojiPicker();
      }
      
      // Escape to close emoji picker
      if (e.key === 'Escape' && isEmojiPickerOpen) {
        toggleEmojiPicker();
      }
    });
  }
  
  // ===== AUTO-INITIALIZATION =====
  function initializeEmojiSystem() {
    console.log('🎭 Initializing emoji system...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initializeEmojiSearchEvents();
        initializeEmojiCategoryEvents();
        initializeEmojiKeyboardShortcuts();
        console.log('✅ Emoji system initialized');
      });
    } else {
      initializeEmojiSearchEvents();
      initializeEmojiCategoryEvents();
      initializeEmojiKeyboardShortcuts();
      console.log('✅ Emoji system initialized');
    }
  }
  
  // ===== CLOSE EMOJI PICKER ON OUTSIDE CLICK =====
  document.addEventListener('click', (e) => {
    const emojiPicker = document.getElementById('emojiPicker');
    const emojiToggleBtn = document.getElementById('emojiToggle');
  
    if (emojiPicker && emojiToggleBtn) {
      if (!emojiPicker.contains(e.target) && !emojiToggleBtn.contains(e.target)) {
        emojiPicker.style.display = 'none';
        emojiToggleBtn.classList.remove('active');
      }
    }
  });
  
  // ===== AUTO-START EMOJI SYSTEM =====
  initializeEmojiSystem();
  
  // ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====
  // Make functions available globally
  window.EmojiSystem = {
    searchEmojis,
    toggleEmojiPicker,
    loadEmojis,
    insertEmoji,
    addQuickSearchButtons,
    initializeEmojiSystem
  };
  
  console.log('🎭 Emoji.js loaded successfully!');
  