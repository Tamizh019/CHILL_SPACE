// Enhanced Question Pools - Completely Separate for Each Difficulty
const allQuestions = {
    easy: [
      { question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], correct: 1 },
      { question: "Who was the first President of India?", options: ["Mahatma Gandhi", "Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Patel"], correct: 1 },
      { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
      { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correct: 1 },
      { question: "How many continents are there?", options: ["5", "6", "7", "8"], correct: 2 },
      { question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2 },
      { question: "Which is the smallest country in the world?", options: ["Monaco", "Vatican City", "Liechtenstein", "San Marino"], correct: 1 },
      { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
      { question: "Which animal is known as the King of the Jungle?", options: ["Tiger", "Lion", "Elephant", "Leopard"], correct: 1 },
      { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
      { question: "How many days are there in a leap year?", options: ["365", "366", "367", "364"], correct: 1 },
      { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
      { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
      { question: "Which is the fastest land animal?", options: ["Lion", "Cheetah", "Horse", "Gazelle"], correct: 1 },
      { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Silver"], correct: 2 },
      { question: "Which country is famous for the Taj Mahal?", options: ["Pakistan", "India", "Bangladesh", "Nepal"], correct: 1 },
      { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Antarctica", "Arabian"], correct: 2 },
      { question: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3 },
      { question: "What is the smallest unit of matter?", options: ["Molecule", "Atom", "Cell", "Electron"], correct: 1 },
      { question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Ganges", "Mississippi"], correct: 1 },
      { question: "What color do you get when you mix red and white?", options: ["Orange", "Pink", "Purple", "Yellow"], correct: 1 },
      { question: "Which organ in the human body produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Heart"], correct: 2 },
      { question: "What is the chemical symbol for gold?", options: ["Gd", "Go", "Au", "Ag"], correct: 2 },
      { question: "Which is the highest mountain peak in the world?", options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"], correct: 1 },
      { question: "What is the main language spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], correct: 1 },
      { question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], correct: 1 },
      { question: "What is the largest bird in the world?", options: ["Eagle", "Ostrich", "Albatross", "Condor"], correct: 1 },
      { question: "Which metal is liquid at room temperature?", options: ["Lead", "Mercury", "Tin", "Zinc"], correct: 1 },
      { question: "What is the capital of France?", options: ["Lyon", "Marseille", "Paris", "Nice"], correct: 2 },
      { question: "Which is the smallest planet in our solar system?", options: ["Mars", "Mercury", "Venus", "Pluto"], correct: 1 },
      { question: "What do bees produce?", options: ["Milk", "Honey", "Silk", "Wax"], correct: 1 },
      { question: "Which continent is known as the Dark Continent?", options: ["Asia", "Africa", "South America", "Australia"], correct: 1 },
      { question: "What is the freezing point of water?", options: ["0°C", "-1°C", "1°C", "32°C"], correct: 0 },
      { question: "Which is the largest country by area?", options: ["China", "Canada", "Russia", "USA"], correct: 2 },
      { question: "What is the study of earthquakes called?", options: ["Geology", "Seismology", "Meteorology", "Astronomy"], correct: 1 },
      { question: "Which blood group is known as the universal donor?", options: ["A", "B", "AB", "O"], correct: 3 },
      { question: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Giza", "Luxor"], correct: 1 },
      { question: "Which is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2 },
      { question: "What is the largest flower in the world?", options: ["Sunflower", "Rafflesia", "Lotus", "Rose"], correct: 1 },
      { question: "Which country invented paper?", options: ["India", "Egypt", "China", "Greece"], correct: 2 },
      { question: "What is the main ingredient in bread?", options: ["Rice", "Wheat", "Corn", "Barley"], correct: 1 },
      { question: "Which is the fastest bird in the world?", options: ["Eagle", "Falcon", "Hawk", "Peregrine Falcon"], correct: 3 },
      { question: "What is the largest island in the world?", options: ["Australia", "Greenland", "Madagascar", "Borneo"], correct: 1 },
      { question: "Which vitamin is also known as Ascorbic Acid?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 2 },
      { question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], correct: 2 },
      { question: "Which is the longest bone in the human body?", options: ["Tibia", "Femur", "Humerus", "Radius"], correct: 1 },
      { question: "What is the study of plants called?", options: ["Zoology", "Botany", "Biology", "Ecology"], correct: 1 },
      { question: "Which is the deepest ocean trench?", options: ["Java Trench", "Mariana Trench", "Puerto Rico Trench", "Peru-Chile Trench"], correct: 1 },
      { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "H2SO4"], correct: 0 },
      { question: "Which is the largest lake in the world?", options: ["Lake Superior", "Caspian Sea", "Lake Victoria", "Lake Baikal"], correct: 1 },
      { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], correct: 0 },
      { question: "Which country has the most time zones?", options: ["Russia", "USA", "China", "France"], correct: 3 },
      { question: "What is the largest mammal that ever lived?", options: ["Mammoth", "Blue Whale", "T-Rex", "Elephant"], correct: 1 },
      { question: "Which is the hottest planet in our solar system?", options: ["Mercury", "Venus", "Mars", "Jupiter"], correct: 1 },
      { question: "What is the main component of the Sun?", options: ["Helium", "Hydrogen", "Oxygen", "Carbon"], correct: 1 },
      { question: "Which is the largest butterfly in the world?", options: ["Monarch", "Queen Alexandra's Birdwing", "Swallowtail", "Blue Morpho"], correct: 1 },
      { question: "What is the currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Franc"], correct: 2 },
      { question: "Which is the tallest waterfall in the world?", options: ["Niagara Falls", "Angel Falls", "Victoria Falls", "Iguazu Falls"], correct: 1 },
      { question: "What is the largest rainforest in the world?", options: ["Congo Rainforest", "Amazon Rainforest", "Taiga", "Daintree Rainforest"], correct: 1 },
      { question: "Which element has the chemical symbol 'Fe'?", options: ["Fluorine", "Iron", "Francium", "Fermium"], correct: 1 },
      { question: "What is the capital of Russia?", options: ["St. Petersburg", "Moscow", "Kiev", "Minsk"], correct: 1 }
    ],
  
    medium: [
      { question: "Which company developed the world's first foldable smartphone?", options: ["Samsung", "Huawei", "Royole", "Motorola"], correct: 2 },
      { question: "Who founded Tesla Inc.?", options: ["Elon Musk", "Martin Eberhard & Marc Tarpenning", "Jeff Bezos", "Steve Jobs"], correct: 1 },
      { question: "Which company created the world's first smartphone?", options: ["Nokia", "IBM", "Apple", "Motorola"], correct: 1 },
      { question: "What does the SIM in SIM card stand for?", options: ["Subscriber Identity Module", "Signal Identification Mechanism", "Secure Internal Memory", "Satellite Information Monitor"], correct: 0 },
      { question: "Who is considered the father of Artificial Intelligence?", options: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Geoffrey Hinton"], correct: 1 },
      { question: "Which layer of the OSI model is responsible for error detection?", options: ["Network Layer", "Data Link Layer", "Transport Layer", "Application Layer"], correct: 1 },
      { question: "What is ChatGPT developed by?", options: ["Google", "Meta", "OpenAI", "IBM"], correct: 2 },
      { question: "Which Indian city is called the 'Silicon Valley of India'?", options: ["Hyderabad", "Mumbai", "Bengaluru", "Chennai"], correct: 2 },
      { question: "Which country was formerly known as Persia?", options: ["Turkey", "Iran", "Iraq", "Syria"], correct: 1 },
      { question: "Which country has no rivers at all?", options: ["Saudi Arabia", "Egypt", "Libya", "Kuwait"], correct: 0 },
      { question: "Which is the oldest known civilization in the world?", options: ["Mesopotamia", "Indus Valley", "Ancient Egypt", "Maya Civilization"], correct: 0 },
      { question: "Which mountain grows about 1 cm taller every year?", options: ["Kilimanjaro", "Everest", "Denali", "Mont Blanc"], correct: 1 },
      { question: "Which country officially has no capital city?", options: ["Australia", "Switzerland", "Canada", "New Zealand"], correct: 1 },
      { question: "What was Sony's first product?", options: ["Radio", "Television", "Tape recorder", "Camera"], correct: 2 },
      { question: "Which company introduced the first modern smartwatch?", options: ["Apple", "Samsung", "Pebble", "Sony"], correct: 2 },
      { question: "Which metal is used in batteries for phones & EVs?", options: ["Lithium", "Aluminum", "Zinc", "Copper"], correct: 0 },
      { question: "Which is the lightest element in the universe?", options: ["Helium", "Hydrogen", "Oxygen", "Carbon"], correct: 1 },
      { question: "Who is called the 'Architect of the Indian Constitution'?", options: ["Mahatma Gandhi", "B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], correct: 1 },
      { question: "Which Indian city is called the 'City of Palaces'?", options: ["Mysuru", "Udaipur", "Lucknow", "Jaipur"], correct: 0 },
      { question: "Who is known as the 'Iron Man of India'?", options: ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Bhimrao Ambedkar", "Subhas Chandra Bose"], correct: 1 },
      { question: "Which is the tallest statue in the world, located in India?", options: ["Buddha Statue, Bodh Gaya", "Statue of Unity, Gujarat", "Hanuman Statue, Shimla", "Shivaji Statue, Mumbai"], correct: 1 },
      { question: "Which tech giant owns Instagram and WhatsApp?", options: ["Google", "Meta", "Twitter", "Microsoft"], correct: 1 },
      { question: "What was Google's first smartphone called?", options: ["Pixel", "Nexus One", "Android One", "Motorola Droid"], correct: 1 },
      { question: "Which AI technology allows self-driving cars to 'see'?", options: ["Computer Vision", "Deepfake AI", "Voice recognition", "NLP"], correct: 0 },
      { question: "Which sensor detects phone orientation for gaming & screen rotation?", options: ["Gyroscope", "Proximity sensor", "Ambient light sensor", "Magnetometer"], correct: 0 },
      { question: "Which company created the first commercially success VR headset?", options: ["Oculus", "Sony", "HTC", "Valve"], correct: 0 },
      { question: "Which element is known as the 'King of Chemicals'?", options: ["Sulfur", "Hydrogen", "Nitrogen", "Carbon"], correct: 0 },
      { question: "What innovation uses 'E Ink' technology?", options: ["OLED TV", "Electric Cars", "Smartwatches", "Kindle e-Readers"], correct: 3 },
      { question: "Which ancient library was one of the largest in history?", options: ["Library of Babylon", "Library of Alexandria", "Library of Pergamon", "Vatican Library"], correct: 1 },
      { question: "Which is the deepest place on Earth?", options: ["Mariana Trench", "Java Trench", "Puerto Rico Trench", "Tonga Trench"], correct: 0 },
      { question: "Which city is sinking by nearly 30 cm per year?", options: ["Jakarta", "Venice", "Bangkok", "Lagos"], correct: 0 },
      { question: "Which is the flattest country on Earth?", options: ["Netherlands", "Maldives", "Denmark", "Bangladesh"], correct: 1 },
      { question: "Which planets rain diamonds?", options: ["Neptune & Uranus", "Saturn", "Jupiter", "Pluto"], correct: 0 },
      { question: "What is the largest thing in the universe?", options: ["Galaxy", "Black Hole", "Supercluster", "The Hercules–Corona Borealis Great Wall"], correct: 3 },
      { question: "What is absolute zero?", options: ["0°C", "-100°C", "-273.15°C", "-459.67°C"], correct: 2 },
      { question: "What's the weakest force in nature?", options: ["Gravity", "Electromagnetism", "Strong nuclear force", "Weak nuclear force"], correct: 0 },
      { question: "Which GPU brand dominates gaming consoles?", options: ["Intel", "NVIDIA", "AMD", "Qualcomm"], correct: 2 },
      { question: "Which processor architecture powers most smartphones?", options: ["x86", "ARM", "RISC-V", "MIPS"], correct: 1 },
      { question: "Which company owns the most undersea internet cables?", options: ["Google", "Meta", "Microsoft", "Amazon"], correct: 0 },
      { question: "Which OS powers the world's fastest supercomputers?", options: ["Windows", "Linux", "macOS", "Unix"], correct: 1 },
      { question: "What is a 'ping' in networking?", options: ["A gaming notification", "A tool to test network connection", "A Wi-Fi booster", "A data packet"], correct: 1 },
      { question: "Which cable carries data using light?", options: ["Copper cable", "Fiber-optic cable", "Coaxial cable", "Ethernet cable"], correct: 1 },
      { question: "What is the smallest unit of digital data?", options: ["Byte", "Bit", "Kilobyte", "Nibble"], correct: 1 },
      { question: "Which city is nicknamed 'The City That Never Sleeps'?", options: ["Las Vegas", "New York City", "Miami", "Los Angeles"], correct: 1 },
      { question: "Which company built the Burj Khalifa?", options: ["Samsung C&T", "Bechtel", "Larsen & Toubro", "Skanska"], correct: 0 },
      { question: "Which startup launched the first flying electric car prototype?", options: ["Tesla", "Kitty Hawk", "PAL-V", "Alef Aeronautics"], correct: 3 },
      { question: "Which country has no mosquitoes at all?", options: ["Iceland", "Finland", "Norway", "Canada"], correct: 0 },
      { question: "Which country moves 7cm closer to Europe every year?", options: ["Australia", "New Zealand", "Iceland", "Greenland"], correct: 0 },
      { question: "Which Indian city hosts a 'Robot Restaurant'?", options: ["Mumbai", "Bengaluru", "Chennai", "Delhi"], correct: 2 },
      { question: "What was Samsung's first electronic product?", options: ["TV", "Refrigerator", "Black & white TV", "Microwave"], correct: 2 },
      { question: "Which country has no McDonald's restaurants?", options: ["Iceland", "North Korea", "Bhutan", "All of the above"], correct: 3 }
    ],
  
    hard: [
      { question: "What is the core idea behind Deep Learning?", options: ["Symbolic reasoning", "Decision trees", "Neural networks with multiple layers", "Genetic algorithms"], correct: 2 },
      { question: "Which company developed the first commercially available microprocessor?", options: ["IBM", "Intel", "AMD", "Motorola"], correct: 1 },
      { question: "Which display technology is most commonly used in modern smartphones?", options: ["LCD", "CRT", "OLED", "Plasma"], correct: 2 },
      { question: "Which device converts digital signals into analog for display?", options: ["Router", "Decoder", "Modulator", "DAC"], correct: 3 },
      { question: "Who is the current President of the World Bank (as of 2025)?", options: ["Ajay Banga", "Kristalina Georgieva", "Ngozi Okonjo-Iweala", "David Malpass"], correct: 0 },
      { question: "Which country recently joined BRICS in 2024?", options: ["Argentina", "Indonesia", "Egypt", "Vietnam"], correct: 2 },
      { question: "Which company became the world's most valuable by market cap in 2024?", options: ["Microsoft", "Apple", "Saudi Aramco", "NVIDIA"], correct: 0 },
      { question: "Who is the current CEO of OpenAI (as of 2025)?", options: ["Elon Musk", "Satya Nadella", "Sam Altman", "Demis Hassabis"], correct: 2 },
      { question: "Which Indian state has the highest GDP?", options: ["Maharashtra", "Tamil Nadu", "Gujarat", "Karnataka"], correct: 0 },
      { question: "Who authored 'The Psychology of Money'?", options: ["Robert Kiyosaki", "Morgan Housel", "Yuval Noah Harari", "Nassim Taleb"], correct: 1 },
      { question: "What does a GPU primarily do?", options: ["Process audio signals", "Render images & graphics", "Boost network speed", "Compress data"], correct: 1 },
      { question: "Which is the most expensive part of an EV?", options: ["Battery", "Motor", "Infotainment system", "Chassis"], correct: 0 },
      { question: "Which OS is used in PlayStation gaming consoles?", options: ["Android", "Orbis OS (based on FreeBSD)", "Windows", "Linux"], correct: 1 },
      { question: "Which invention is Galileo Galilei known for improving?", options: ["Microscope", "Calculator", "Thermometer", "Telescope"], correct: 3 },
      { question: "Who invented the electric light bulb?", options: ["Alexander Graham Bell", "Michael Faraday", "Isaac Newton", "Thomas Edison"], correct: 3 },
      { question: "Which company developed the world's first AI-generated news anchor?", options: ["BBC", "OpenAI", "Xinhua (China)", "Reuters"], correct: 2 },
      { question: "What is the name of Apple's first mixed-reality headset launched in 2024?", options: ["iLens", "Apple AR+", "Vision Pro", "Apple VRX"], correct: 2 },
      { question: "Which is heavier: 1 kg of iron or 1 kg of cotton?", options: ["Iron", "Cotton", "Same weight", "Depends on temperature"], correct: 2 },
      { question: "In quantum mechanics, what is Schrödinger's cat thought experiment about?", options: ["Animal behavior", "Quantum superposition", "Time travel", "Gravity"], correct: 1 },
      { question: "What is the Planck constant used for?", options: ["Measuring gravity", "Quantum mechanics", "Speed of light", "Atomic mass"], correct: 1 },
      { question: "Which programming paradigm does Haskell primarily use?", options: ["Object-oriented", "Functional", "Procedural", "Logic"], correct: 1 },
      { question: "What is the time complexity of QuickSort in the worst case?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 2 },
      { question: "In machine learning, what does 'overfitting' mean?", options: ["Model is too simple", "Model memorizes training data", "Model runs too fast", "Model uses too much memory"], correct: 1 },
      { question: "What is the halting problem in computer science?", options: ["Memory allocation issue", "Undecidable problem", "Network latency", "Database optimization"], correct: 1 },
      { question: "Which cryptographic algorithm is used in Bitcoin?", options: ["AES", "RSA", "SHA-256", "MD5"], correct: 2 },
      { question: "What is the Byzantine Generals Problem in distributed systems?", options: ["Leader election", "Consensus with unreliable nodes", "Load balancing", "Data replication"], correct: 1 },
      { question: "In relativity theory, what happens to time at high speeds?", options: ["Speeds up", "Slows down", "Stays the same", "Becomes negative"], correct: 1 },
      { question: "What is dark matter in cosmology?", options: ["Black holes", "Unknown matter affecting gravity", "Empty space", "Dead stars"], correct: 1 },
      { question: "Which mathematical concept describes the shape of spacetime?", options: ["Euclidean geometry", "Riemannian geometry", "Topology", "Algebra"], correct: 1 },
      { question: "What is the P vs NP problem in computational complexity?", options: ["Memory vs Speed", "Polynomial vs Exponential time", "Parallel vs Sequential", "Public vs Private key"], correct: 1 },
      { question: "In biochemistry, what is the role of ATP?", options: ["Protein synthesis", "Energy currency", "DNA replication", "Cell division"], correct: 1 },
      { question: "What is CRISPR-Cas9 used for?", options: ["Data storage", "Gene editing", "Image processing", "Network security"], correct: 1 },
      { question: "Which economic theory explains stagflation?", options: ["Keynesian", "Classical", "Supply-side", "Monetarist"], correct: 3 },
      { question: "What is the Gini coefficient used to measure?", options: ["Economic growth", "Income inequality", "Inflation rate", "Employment"], correct: 1 },
      { question: "In philosophy, what is the 'hard problem of consciousness'?", options: ["Sleep patterns", "Subjective experience", "Memory formation", "Brain structure"], correct: 1 },
      { question: "What is the Ship of Theseus paradox about?", options: ["Navigation", "Identity over time", "Maritime law", "Ancient history"], correct: 1 },
      { question: "In linguistics, what is the Sapir-Whorf hypothesis?", options: ["Language evolution", "Language affects thought", "Grammar rules", "Sound changes"], correct: 1 },
      { question: "What is the anthropic principle in cosmology?", options: ["Human evolution", "Universe fine-tuned for life", "Alien existence", "Planet formation"], correct: 1 },
      { question: "Which mathematical theorem proves the impossibility of trisecting an angle?", options: ["Pythagorean theorem", "Galois theory", "Fermat's last theorem", "Gödel's theorem"], correct: 1 },
      { question: "In game theory, what is a Nash equilibrium?", options: ["Maximum profit", "Stable strategy profile", "Zero-sum game", "Perfect information"], correct: 1 },
      { question: "What is the Riemann Hypothesis about?", options: ["Prime number distribution", "Geometry", "Calculus", "Statistics"], correct: 0 },
      { question: "In particle physics, what is the Higgs mechanism?", options: ["Mass generation", "Force unification", "Particle decay", "Energy conservation"], correct: 0 },
      { question: "What is quantum entanglement?", options: ["Particle collision", "Correlated quantum states", "Wave interference", "Energy transfer"], correct: 1 },
      { question: "In thermodynamics, what is entropy?", options: ["Heat capacity", "Energy conservation", "Measure of disorder", "Temperature change"], correct: 2 },
      { question: "What is the many-worlds interpretation in quantum mechanics?", options: ["Parallel universes", "Wave collapse", "Hidden variables", "Observer effect"], correct: 0 },
      { question: "Which complexity class does the traveling salesman problem belong to?", options: ["P", "NP", "NP-complete", "PSPACE"], correct: 2 },
      { question: "What is the difference between syntax and semantics in programming?", options: ["Speed vs Memory", "Form vs Meaning", "Input vs Output", "Local vs Global"], correct: 1 },
      { question: "In category theory, what is a functor?", options: ["Data structure", "Mapping between categories", "Algorithm", "Database operation"], correct: 1 },
      { question: "What is the Church-Turing thesis about?", options: ["Computer architecture", "Computability theory", "Programming languages", "Data structures"], correct: 1 },
      { question: "In topology, what is a homeomorphism?", options: ["Continuous bijection", "Linear transformation", "Metric space", "Vector field"], correct: 0 }
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
  
  // Submit current answer
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
    
    toggleOptions(false);
    updateNavigation();
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
  