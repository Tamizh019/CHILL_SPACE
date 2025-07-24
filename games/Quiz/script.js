// Enhanced Question Pools with "Did You Know?" Facts
const allQuestions = {
    easy: [
      { 
        question: "What is the capital of India?", 
        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], 
        correct: 1,
        fact: "New Delhi became India's capital in 1911, replacing Calcutta (now Kolkata). It was designed by British architects Edwin Lutyens and Herbert Baker!"
      },
      { 
        question: "Who was the first President of India?", 
        options: ["Mahatma Gandhi", "Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Patel"], 
        correct: 1,
        fact: "Dr. Rajendra Prasad served as India's President from 1950-1962. He was also the President of the Indian National Congress and played a key role in the freedom struggle!"
      },
      { 
        question: "Which planet is known as the Red Planet?", 
        options: ["Venus", "Mars", "Jupiter", "Saturn"], 
        correct: 1,
        fact: "Mars appears red due to iron oxide (rust) on its surface. A day on Mars is 24 hours 37 minutes - very similar to Earth!"
      },
      { 
        question: "What is the largest mammal in the world?", 
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], 
        correct: 1,
        fact: "Blue whales can grow up to 100 feet long and weigh as much as 200 tons - that's about 30 elephants! Their hearts alone can weigh as much as a car."
      },
      { 
        question: "How many continents are there?", 
        options: ["5", "6", "7", "8"], 
        correct: 2,
        fact: "The seven continents are Asia, Africa, North America, South America, Antarctica, Europe, and Australia. Asia is the largest, covering about 30% of Earth's land!"
      },
      { 
        question: "What is the currency of Japan?", 
        options: ["Yuan", "Won", "Yen", "Ringgit"], 
        correct: 2,
        fact: "The Japanese Yen was introduced in 1871. Japan was one of the first countries to use decimal currency - 1 yen = 100 sen!"
      },
      { 
        question: "Which is the smallest country in the world?", 
        options: ["Monaco", "Vatican City", "Liechtenstein", "San Marino"], 
        correct: 1,
        fact: "Vatican City is only 0.17 square miles (0.44 km²) - smaller than most shopping malls! You can walk across the entire country in about 20 minutes."
      },
      { 
        question: "What is the boiling point of water?", 
        options: ["90°C", "100°C", "110°C", "120°C"], 
        correct: 1,
        fact: "Water boils at 100°C (212°F) at sea level. At higher altitudes, water boils at lower temperatures due to reduced air pressure!"
      },
      { 
        question: "Which animal is known as the King of the Jungle?", 
        options: ["Tiger", "Lion", "Elephant", "Leopard"], 
        correct: 1,
        fact: "Ironically, most lions actually live in grasslands and savannas, not jungles! A lion's roar can be heard from up to 5 miles away."
      },
      { 
        question: "What is the largest ocean on Earth?", 
        options: ["Atlantic", "Indian", "Pacific", "Arctic"], 
        correct: 2,
        fact: "The Pacific Ocean covers about 46% of Earth's water surface and contains more than half of the world's free water. It's larger than all land masses combined!"
      },
      { 
        question: "How many days are there in a leap year?", 
        options: ["365", "366", "367", "364"], 
        correct: 1,
        fact: "Leap years occur every 4 years to keep our calendar aligned with Earth's orbit. However, century years (like 1900) are NOT leap years unless divisible by 400!"
      },
      { 
        question: "Which gas do plants absorb from the atmosphere?", 
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], 
        correct: 2,
        fact: "Plants absorb CO₂ during photosynthesis and release oxygen. One large tree can produce enough oxygen for two people per day!"
      },
      { 
        question: "What is the capital of Australia?", 
        options: ["Sydney", "Melbourne", "Canberra", "Perth"], 
        correct: 2,
        fact: "Canberra was specially built as Australia's capital in 1913 as a compromise between Sydney and Melbourne, who both wanted to be the capital!"
      },
      { 
        question: "Which is the fastest land animal?", 
        options: ["Lion", "Cheetah", "Horse", "Gazelle"], 
        correct: 1,
        fact: "Cheetahs can reach 70 mph (112 km/h) in just 3 seconds! However, they can only maintain this speed for short bursts of 20-30 seconds."
      },
      { 
        question: "What is the hardest natural substance?", 
        options: ["Gold", "Iron", "Diamond", "Silver"], 
        correct: 2,
        fact: "Diamonds are formed deep underground under extreme pressure and heat. It takes about 1-3 billion years for a diamond to form naturally!"
      },
      { 
        question: "Which country is famous for the Taj Mahal?", 
        options: ["Pakistan", "India", "Bangladesh", "Nepal"], 
        correct: 1,
        fact: "The Taj Mahal was built by Emperor Shah Jahan as a tomb for his wife Mumtaz Mahal. It took 22 years and 20,000 workers to complete!"
      },
      { 
        question: "What is the largest desert in the world?", 
        options: ["Sahara", "Gobi", "Antarctica", "Arabian"], 
        correct: 2,
        fact: "Antarctica is technically the world's largest desert because it receives very little precipitation. The Sahara is the largest hot desert!"
      },
      { 
        question: "Which vitamin is produced when skin is exposed to sunlight?", 
        options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], 
        correct: 3,
        fact: "Your skin produces Vitamin D when exposed to UVB rays from sunlight. Just 10-15 minutes of sunlight daily can provide your vitamin D needs!"
      },
      { 
        question: "What is the smallest unit of matter?", 
        options: ["Molecule", "Atom", "Cell", "Electron"], 
        correct: 1,
        fact: "Atoms are so small that about 5 million of them could fit in the period at the end of this sentence! They're made of protons, neutrons, and electrons."
      },
      { 
        question: "Which is the longest river in the world?", 
        options: ["Amazon", "Nile", "Ganges", "Mississippi"], 
        correct: 1,
        fact: "The Nile River is about 4,135 miles (6,650 km) long. It flows through 11 countries and has been crucial for civilization for over 5,000 years!"
      },
      { 
        question: "What color do you get when you mix red and white?", 
        options: ["Orange", "Pink", "Purple", "Yellow"], 
        correct: 1,
        fact: "Pink is not actually in the light spectrum - it's what our brains create when we see a mix of red and white light wavelengths!"
      },
      { 
        question: "Which organ in the human body produces insulin?", 
        options: ["Liver", "Kidney", "Pancreas", "Heart"], 
        correct: 2,
        fact: "The pancreas produces insulin to regulate blood sugar. It also produces digestive enzymes - it's both an endocrine and exocrine gland!"
      },
      { 
        question: "What is the chemical symbol for gold?", 
        options: ["Gd", "Go", "Au", "Ag"], 
        correct: 2,
        fact: "Gold's symbol 'Au' comes from the Latin word 'aurum'. Gold is so rare that all the gold ever mined would fit into about 4 Olympic-sized swimming pools!"
      },
      { 
        question: "Which is the highest mountain peak in the world?", 
        options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"], 
        correct: 1,
        fact: "Mount Everest is 29,032 feet (8,849 meters) tall and grows about 4mm per year due to tectonic plate movement. The summit has only one-third the oxygen of sea level!"
      },
      { 
        question: "What is the main language spoken in Brazil?", 
        options: ["Spanish", "Portuguese", "French", "English"], 
        correct: 1,
        fact: "Brazil is the only Portuguese-speaking country in South America. Portuguese became the official language because Brazil was colonized by Portugal, not Spain!"
      }
    ],
  
    medium: [
      { 
        question: "Which company developed the world's first foldable smartphone?", 
        options: ["Samsung", "Huawei", "Royole", "Motorola"], 
        correct: 2,
        fact: "Royole released the FlexPai in 2018, beating Samsung's Galaxy Fold to market. The foldable display technology uses flexible OLED panels!"
      },
      { 
        question: "Who founded Tesla Inc.?", 
        options: ["Elon Musk", "Martin Eberhard & Marc Tarpenning", "Jeff Bezos", "Steve Jobs"], 
        correct: 1,
        fact: "Tesla was founded in 2003 by Martin Eberhard and Marc Tarpenning. Elon Musk joined as chairman and became CEO later, but he didn't found the company!"
      },
      { 
        question: "Which company created the world's first smartphone?", 
        options: ["Nokia", "IBM", "Apple", "Motorola"], 
        correct: 1,
        fact: "IBM Simon (1994) is considered the first smartphone with a touchscreen, email, and apps - 13 years before the iPhone!"
      },
      { 
        question: "What does the SIM in SIM card stand for?", 
        options: ["Subscriber Identity Module", "Signal Identification Mechanism", "Secure Internal Memory", "Satellite Information Monitor"], 
        correct: 0,
        fact: "SIM cards were invented in 1991 in Munich, Germany. The smallest nano-SIM is just 12.3mm × 8.8mm - smaller than your fingernail!"
      },
      { 
        question: "Who is considered the father of Artificial Intelligence?", 
        options: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Geoffrey Hinton"], 
        correct: 1,
        fact: "John McCarthy coined the term 'Artificial Intelligence' in 1956 and organized the famous Dartmouth Conference that launched AI as a field!"
      },
      { 
        question: "Which layer of the OSI model is responsible for error detection?", 
        options: ["Network Layer", "Data Link Layer", "Transport Layer", "Application Layer"], 
        correct: 1,
        fact: "The Data Link Layer uses techniques like checksums and CRC (Cyclic Redundancy Check) to detect errors in data transmission between directly connected nodes!"
      },
      { 
        question: "What is ChatGPT developed by?", 
        options: ["Google", "Meta", "OpenAI", "IBM"], 
        correct: 2,
        fact: "OpenAI was founded in 2015 as a non-profit, later becoming a 'capped-profit' company. ChatGPT reached 100 million users in just 2 months - the fastest-growing app ever!"
      },
      { 
        question: "Which Indian city is called the 'Silicon Valley of India'?", 
        options: ["Hyderabad", "Mumbai", "Bengaluru", "Chennai"], 
        correct: 2,
        fact: "Bengaluru generates over 40% of India's IT exports and houses major R&D centers for Google, Microsoft, and hundreds of startups!"
      },
      { 
        question: "Which country was formerly known as Persia?", 
        options: ["Turkey", "Iran", "Iraq", "Syria"], 
        correct: 1,
        fact: "Iran officially changed its name from Persia in 1935. The name 'Iran' means 'Land of the Aryans' in the Persian language!"
      },
      { 
        question: "Which country has no rivers at all?", 
        options: ["Saudi Arabia", "Egypt", "Libya", "Kuwait"], 
        correct: 0,
        fact: "Saudi Arabia has no permanent rivers due to its desert climate. The country relies heavily on desalination plants for fresh water!"
      },
      { 
        question: "Which is the oldest known civilization in the world?", 
        options: ["Mesopotamia", "Indus Valley", "Ancient Egypt", "Maya Civilization"], 
        correct: 0,
        fact: "Mesopotamia (modern-day Iraq) dates back to 3500 BCE. The Sumerians here invented writing, the wheel, and the first cities!"
      },
      { 
        question: "Which mountain grows about 1 cm taller every year?", 
        options: ["Kilimanjaro", "Everest", "Denali", "Mont Blanc"], 
        correct: 1,
        fact: "Mount Everest grows due to the Indo-Australian tectonic plate pushing against the Eurasian plate. GPS measurements track this growth precisely!"
      },
      { 
        question: "Which country officially has no capital city?", 
        options: ["Australia", "Switzerland", "Canada", "New Zealand"], 
        correct: 1,
        fact: "Switzerland has no official capital. Bern serves as the 'federal city' where the government meets, but it's not constitutionally designated as the capital!"
      },
      { 
        question: "What was Sony's first product?", 
        options: ["Radio", "Television", "Tape recorder", "Camera"], 
        correct: 2,
        fact: "Sony's first product was a rice cooker in 1946, but it was a failure! Their first successful product was an improved tape recorder in 1950."
      },
      { 
        question: "Which company introduced the first modern smartwatch?", 
        options: ["Apple", "Samsung", "Pebble", "Sony"], 
        correct: 2,
        fact: "Pebble raised over $10 million on Kickstarter in 2012, launching the modern smartwatch era 3 years before Apple Watch!"
      },
      { 
        question: "Which metal is used in batteries for phones & EVs?", 
        options: ["Lithium", "Aluminum", "Zinc", "Copper"], 
        correct: 0,
        fact: "Lithium is the lightest metal and highly reactive. Most lithium comes from salt flats in Chile, Argentina, and Bolivia - the 'lithium triangle'!"
      },
      { 
        question: "Which is the lightest element in the universe?", 
        options: ["Helium", "Hydrogen", "Oxygen", "Carbon"], 
        correct: 1,
        fact: "Hydrogen makes up about 75% of all normal matter in the universe. It was the first element formed after the Big Bang!"
      },
      { 
        question: "Who is called the 'Architect of the Indian Constitution'?", 
        options: ["Mahatma Gandhi", "B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 
        correct: 1,
        fact: "Dr. B.R. Ambedkar was the chairman of the Drafting Committee. The Indian Constitution is one of the longest in the world with 448 articles!"
      },
      { 
        question: "Which Indian city is called the 'City of Palaces'?", 
        options: ["Mysuru", "Udaipur", "Lucknow", "Jaipur"], 
        correct: 0,
        fact: "Mysuru has over 2,700 palaces! The famous Mysore Palace is illuminated with 97,000 light bulbs during festivals."
      },
      { 
        question: "Who is known as the 'Iron Man of India'?", 
        options: ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Bhimrao Ambedkar", "Subhas Chandra Bose"], 
        correct: 1,
        fact: "Sardar Patel united 562 princely states into the Indian Union after independence - a task many thought impossible!"
      },
      { 
        question: "Which is the tallest statue in the world, located in India?", 
        options: ["Buddha Statue, Bodh Gaya", "Statue of Unity, Gujarat", "Hanuman Statue, Shimla", "Shivaji Statue, Mumbai"], 
        correct: 1,
        fact: "The Statue of Unity is 182 meters tall - nearly twice the height of the Statue of Liberty! It took 33 months to build."
      },
      { 
        question: "Which tech giant owns Instagram and WhatsApp?", 
        options: ["Google", "Meta", "Twitter", "Microsoft"], 
        correct: 1,
        fact: "Facebook (now Meta) bought Instagram for $1 billion in 2012 and WhatsApp for $19 billion in 2014 - two of the biggest tech acquisitions ever!"
      },
      { 
        question: "What was Google's first smartphone called?", 
        options: ["Pixel", "Nexus One", "Android One", "Motorola Droid"], 
        correct: 1,
        fact: "The Nexus One (2010) was made by HTC. Google's own Pixel phones didn't arrive until 2016, though Android launched in 2008!"
      },
      { 
        question: "Which AI technology allows self-driving cars to 'see'?", 
        options: ["Computer Vision", "Deepfake AI", "Voice recognition", "NLP"], 
        correct: 0,
        fact: "Computer Vision uses cameras, LiDAR, and radar to create a 3D map of surroundings. Tesla's approach relies heavily on camera-based vision!"
      },
      { 
        question: "Which sensor detects phone orientation for gaming & screen rotation?", 
        options: ["Gyroscope", "Proximity sensor", "Ambient light sensor", "Magnetometer"], 
        correct: 0,
        fact: "Gyroscopes detect rotational motion and are crucial for gaming, VR, and camera stabilization. They work on the same principle as a spinning top!"
      }
    ],
  
    hard: [
      { 
        question: "What is the core idea behind Deep Learning?", 
        options: ["Symbolic reasoning", "Decision trees", "Neural networks with multiple layers", "Genetic algorithms"], 
        correct: 2,
        fact: "Deep Learning mimics the human brain's neural structure. The 'deep' refers to multiple hidden layers - some models now have hundreds of layers!"
      },
      { 
        question: "Which company developed the first commercially available microprocessor?", 
        options: ["IBM", "Intel", "AMD", "Motorola"], 
        correct: 1,
        fact: "Intel's 4004 microprocessor (1971) had only 2,300 transistors. Today's processors have over 100 billion transistors - that's more than the number of stars in our galaxy!"
      },
      { 
        question: "Which display technology is most commonly used in modern smartphones?", 
        options: ["LCD", "CRT", "OLED", "Plasma"], 
        correct: 2,
        fact: "OLED displays produce their own light, allowing true blacks and infinite contrast ratios. Each pixel can turn completely off, saving battery life!"
      },
      { 
        question: "Which device converts digital signals into analog for display?", 
        options: ["Router", "Decoder", "Modulator", "DAC"], 
        correct: 3,
        fact: "Digital-to-Analog Converters (DACs) are everywhere - in your phone's audio chip, TV displays, and even in your car's sound system!"
      },
      { 
        question: "Who is the current President of the World Bank (as of 2025)?", 
        options: ["Ajay Banga", "Kristalina Georgieva", "Ngozi Okonjo-Iweala", "David Malpass"], 
        correct: 0,
        fact: "Ajay Banga, former Mastercard CEO, became World Bank President in 2023. He's focused on fighting climate change and global poverty!"
      },
      { 
        question: "Which country recently joined BRICS in 2024?", 
        options: ["Argentina", "Indonesia", "Egypt", "Vietnam"], 
        correct: 2,
        fact: "Egypt, along with Iran, UAE, Saudi Arabia, and Ethiopia, joined BRICS in 2024, expanding the group from 5 to 10 members!"
      },
      { 
        question: "Which company became the world's most valuable by market cap in 2024?", 
        options: ["Microsoft", "Apple", "Saudi Aramco", "NVIDIA"], 
        correct: 0,
        fact: "Microsoft briefly overtook Apple in 2024, largely due to AI investments and Azure cloud growth. Market caps fluctuate daily based on stock prices!"
      },
      { 
        question: "Who is the current CEO of OpenAI (as of 2025)?", 
        options: ["Elon Musk", "Satya Nadella", "Sam Altman", "Demis Hassabis"], 
        correct: 2,
        fact: "Sam Altman returned as OpenAI CEO after a brief ouster in November 2023. He previously ran Y Combinator, a famous startup accelerator!"
      },
      { 
        question: "Which Indian state has the highest GDP?", 
        options: ["Maharashtra", "Tamil Nadu", "Gujarat", "Karnataka"], 
        correct: 0,
        fact: "Maharashtra contributes about 14% of India's GDP, with Mumbai as its financial capital. The state's economy is larger than many countries!"
      },
      { 
        question: "Who authored 'The Psychology of Money'?", 
        options: ["Robert Kiyosaki", "Morgan Housel", "Yuval Noah Harari", "Nassim Taleb"], 
        correct: 1,
        fact: "Morgan Housel's book became a bestseller by explaining how emotions and psychology affect financial decisions more than math and logic!"
      },
      { 
        question: "In quantum mechanics, what is Schrödinger's cat thought experiment about?", 
        options: ["Animal behavior", "Quantum superposition", "Time travel", "Gravity"], 
        correct: 1,
        fact: "Schrödinger's thought experiment illustrates quantum superposition - the cat is both alive AND dead until observed. It's a paradox highlighting quantum weirdness!"
      },
      { 
        question: "What is the Planck constant used for?", 
        options: ["Measuring gravity", "Quantum mechanics", "Speed of light", "Atomic mass"], 
        correct: 1,
        fact: "Planck's constant (6.626 × 10⁻³⁴ J·s) defines the quantum world. It sets the scale where quantum effects become noticeable!"
      },
      { 
        question: "Which programming paradigm does Haskell primarily use?", 
        options: ["Object-oriented", "Functional", "Procedural", "Logic"], 
        correct: 1,
        fact: "Haskell is purely functional - functions have no side effects and always return the same output for the same input. It's named after mathematician Haskell Curry!"
      },
      { 
        question: "What is the time complexity of QuickSort in the worst case?", 
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], 
        correct: 2,
        fact: "QuickSort's worst case occurs when the pivot is always the smallest or largest element. However, with good pivot selection, it averages O(n log n)!"
      },
      { 
        question: "In machine learning, what does 'overfitting' mean?", 
        options: ["Model is too simple", "Model memorizes training data", "Model runs too fast", "Model uses too much memory"], 
        correct: 1,
        fact: "Overfitting is like memorizing exam answers without understanding - the model performs perfectly on training data but fails on new data!"
      },
      { 
        question: "What is the halting problem in computer science?", 
        options: ["Memory allocation issue", "Undecidable problem", "Network latency", "Database optimization"], 
        correct: 1,
        fact: "Alan Turing proved that no algorithm can determine if any program will halt or run forever. This fundamental limitation affects all computing!"
      },
      { 
        question: "Which cryptographic algorithm is used in Bitcoin?", 
        options: ["AES", "RSA", "SHA-256", "MD5"], 
        correct: 2,
        fact: "Bitcoin uses SHA-256 hashing for proof-of-work mining. Miners compete to find a hash starting with many zeros - it's computationally intensive by design!"
      },
      { 
        question: "What is the Byzantine Generals Problem in distributed systems?", 
        options: ["Leader election", "Consensus with unreliable nodes", "Load balancing", "Data replication"], 
        correct: 1,
        fact: "This problem describes how distributed nodes can agree despite some being malicious or failing. Blockchain consensus algorithms solve this ancient problem!"
      },
      { 
        question: "In relativity theory, what happens to time at high speeds?", 
        options: ["Speeds up", "Slows down", "Stays the same", "Becomes negative"], 
        correct: 1,
        fact: "Time dilation means time literally slows down at high speeds relative to a stationary observer. GPS satellites must account for this effect!"
      },
      { 
        question: "What is dark matter in cosmology?", 
        options: ["Black holes", "Unknown matter affecting gravity", "Empty space", "Dead stars"], 
        correct: 1,
        fact: "Dark matter makes up 85% of all matter but doesn't interact with light. We only know it exists because of its gravitational effects on visible matter!"
      },
      { 
        question: "Which mathematical concept describes the shape of spacetime?", 
        options: ["Euclidean geometry", "Riemannian geometry", "Topology", "Algebra"], 
        correct: 1,
        fact: "Einstein used Riemannian geometry to describe how mass warps spacetime in General Relativity. Curved spacetime IS gravity!"
      },
      { 
        question: "What is the P vs NP problem in computational complexity?", 
        options: ["Memory vs Speed", "Polynomial vs Exponential time", "Parallel vs Sequential", "Public vs Private key"], 
        correct: 1,
        fact: "This million-dollar Clay problem asks: can every problem whose solution is quickly verifiable also be quickly solved? Most believe the answer is NO!"
      },
      { 
        question: "In biochemistry, what is the role of ATP?", 
        options: ["Protein synthesis", "Energy currency", "DNA replication", "Cell division"], 
        correct: 1,
        fact: "ATP (Adenosine Triphosphate) is the universal energy currency of life. Your body produces and uses about your body weight in ATP every day!"
      },
      { 
        question: "What is CRISPR-Cas9 used for?", 
        options: ["Data storage", "Gene editing", "Image processing", "Network security"], 
        correct: 1,
        fact: "CRISPR-Cas9 works like molecular scissors, cutting DNA at precise locations. It's revolutionizing medicine, agriculture, and biotechnology!"
      },
      { 
        question: "Which economic theory explains stagflation?", 
        options: ["Keynesian", "Classical", "Supply-side", "Monetarist"], 
        correct: 3,
        fact: "Monetarist theory explains stagflation (stagnant growth + inflation) through money supply changes. The 1970s oil crisis proved Keynesian theory incomplete!"
      }
    ]
  };
  
  // Quiz state variables
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let selectedAnswers = [];
  let score = 0;
  let answered = false;
  let currentDifficulty = '';
  
  // Start quiz function
  function startQuiz(difficulty) {
    currentDifficulty = difficulty;
    const pool = allQuestions[difficulty];
    currentQuestions = getRandomQuestions(pool, 25);
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    selectedAnswers = new Array(currentQuestions.length).fill(null);
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
  }
  
  // Get random questions from pool
  function getRandomQuestions(pool, count) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, pool.length));
  }
  
  // Display current question
  function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = currentQuestions.length;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      optionElement.textContent = option;
      optionElement.onclick = () => selectOption(index);
      if (selectedAnswers[currentQuestionIndex] === index) {
        optionElement.classList.add('selected');
      }
      optionsContainer.appendChild(optionElement);
    });
    
    // Hide fact box when showing new question
    document.getElementById('fact-box').classList.add('hidden');
    
    answered = false;
    updateNavigation();
    updateProgress();
    toggleOptions(true);
  }
  
  // Select an option
  function selectOption(optionIndex) {
    if (answered) return;
    selectedAnswers[currentQuestionIndex] = optionIndex;
    
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
      option.classList.toggle('selected', index === optionIndex);
    });
    
    updateNavigation();
  }
  
  // Submit current answer and show fact
  function submitAnswer() {
    if (answered || selectedAnswers[currentQuestionIndex] === null) return;
    
    answered = true;
    const question = currentQuestions[currentQuestionIndex];
    const selected = selectedAnswers[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
      option.classList.add('disabled');
      if (index === question.correct) {
        option.classList.add('correct');
      }
      if (index === selected && selected !== question.correct) {
        option.classList.add('incorrect');
      }
    });
    
    if (selected === question.correct) {
      score++;
    }
    
    // Show the "Did You Know?" fact
    showFact(question.fact);
    
    toggleOptions(false);
    updateNavigation();
  }
  
  // NEW: Show "Did You Know?" fact
  function showFact(factText) {
    const factBox = document.getElementById('fact-box');
    const factContent = document.getElementById('fact-content');
    
    factContent.textContent = factText;
    factBox.classList.remove('hidden');
    
    // Add animation
    factBox.style.animation = 'none';
    factBox.offsetHeight; // Trigger reflow
    factBox.style.animation = 'factSlideIn 0.5s ease-out forwards';
  }
  
  // Toggle option interactivity
  function toggleOptions(enabled) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
      if (!enabled) {
        option.classList.add('disabled');
      } else {
        option.classList.remove('disabled', 'correct', 'incorrect');
      }
    });
  }
  
  // Update navigation buttons
  function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    submitBtn.disabled = selectedAnswers[currentQuestionIndex] === null || answered;
    nextBtn.disabled = !answered;
    
    if (currentQuestionIndex === currentQuestions.length - 1) {
      nextBtn.textContent = 'Finish Quiz';
    } else {
      nextBtn.textContent = 'Next';
    }
  }
  
  // Update progress bar
  function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
  }
  
  // Go to next question
  function nextQuestion() {
    if (!answered) return;
    if (currentQuestionIndex < currentQuestions.length - 1) {
      currentQuestionIndex++;
      showQuestion();
    } else {
      finishQuiz();
    }
  }
  
  // Go to previous question
  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion();
    }
  }
  
  // Finish quiz
  function finishQuiz() {
    showResults();
  }
  
  // Show results screen
  function showResults() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    const percentage = Math.round((score / currentQuestions.length) * 100);
    
    document.getElementById('final-score').textContent = `${score}/${currentQuestions.length}`;
    document.getElementById('correct-answers').textContent = score;
    document.getElementById('incorrect-answers').textContent = currentQuestions.length - score;
    document.getElementById('accuracy-percentage').textContent = percentage + '%';
    
    let message = '';
    if (percentage >= 90) {
      message = 'Outstanding! You\'re a general knowledge expert! 🎉';
    } else if (percentage >= 75) {
      message = 'Great job! You have excellent general knowledge! 👏';
    } else if (percentage >= 60) {
      message = 'Good work! You have solid general knowledge! 👍';
    } else if (percentage >= 40) {
      message = 'Not bad! There\'s room for improvement! 📚';
    } else {
      message = 'Keep studying! Practice makes perfect! 💪';
    }
    
    document.getElementById('score-message').textContent = message;
  }
  
  // Restart quiz
  function restartQuiz() {
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    resetQuizState();
  }
  
  // Back to start screen
  function backToStart() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    resetQuizState();
  }
  
  // Reset quiz state
  function resetQuizState() {
    currentQuestions = [];
    currentQuestionIndex = 0;
    selectedAnswers = [];
    score = 0;
    answered = false;
    currentDifficulty = '';
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('total-questions').textContent = 25;
  });
  