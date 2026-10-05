/* ═══════════════════════════════════════════════════════════════════════════
   CHARACTER GENERATOR (OC Idea Randomizer)
   Extracted & integrated into Home page sithichokjanto
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  // ===== DATA ARRAYS (ALL 100% PRESERVED) =====

  const animals = [
    "Fox", "Wolf", "Cat", "Dog", "Rabbit", "Crow", "Raven", "Sparrow", "Owl", "Hawk",
    "Eagle", "Falcon", "Peacock", "Swan", "Duck", "Goose", "Chicken", "Rooster", "Turkey", "Pigeon",
    "Seagull", "Penguin", "Parrot", "Cockatoo", "Canary", "Flamingo", "Crane", "Heron", "Stork", "Kiwi",
    "Cassowary", "Ostrich", "Bat", "Butterfly", "Moth", "Bee", "Wasp", "Hornet", "Ant", "Spider",
    "Scorpion", "Dragonfly", "Grasshopper", "Cricket", "Beetle", "Ladybug", "Firefly", "Centipede", "Millipede", "Snail",
    "Slug", "Jellyfish", "Octopus", "Squid", "Cuttlefish", "Seal", "Sea Lion", "Walrus", "Dolphin", "Whale",
    "Shark", "Hammerhead Shark", "Tiger Shark", "Great White Shark", "Manta Ray", "Stingray", "Swordfish", "Tuna", "Salmon", "Koi Fish",
    "Goldfish", "Catfish", "Pufferfish", "Eel", "Seahorse", "Clownfish", "Angelfish", "Betta Fish", "Guppy", "Piranha",
    "Carp", "Barracuda", "Lobster", "Crab", "Hermit Crab", "Shrimp", "Krill", "Starfish", "Sea Urchin", "Otter",
    "Beaver", "Raccoon", "Panda", "Red Panda", "Bear", "Polar Bear", "Grizzly Bear", "Koala", "Sloth", "Monkey",
    "Chimpanzee", "Gorilla", "Orangutan", "Baboon", "Lemur", "Tiger", "Lion", "Leopard", "Jaguar", "Cheetah",
    "Panther", "Lynx", "Bobcat", "Cougar", "Hyena", "Jackal", "Coyote", "Deer", "Elk", "Moose",
    "Reindeer", "Goat", "Sheep", "Ram", "Cow", "Bull", "Buffalo", "Bison", "Yak", "Horse",
    "Donkey", "Zebra", "Camel", "Llama", "Alpaca", "Pig", "Boar", "Hedgehog", "Porcupine", "Mole",
    "Rat", "Mouse", "Hamster", "Guinea Pig", "Squirrel", "Flying Squirrel", "Chipmunk", "Ferret", "Mink", "Weasel",
    "Badger", "Wolverine", "Armadillo", "Anteater", "Tapir", "Hippo", "Rhino", "Elephant", "Giraffe", "Kangaroo",
    "Wallaby", "Possum", "Wombat", "Platypus", "Tasmanian Devil", "Crocodile", "Alligator", "Komodo Dragon", "Lizard", "Gecko",
    "Iguana", "Chameleon", "Snake", "Cobra", "Python", "Viper", "Anaconda", "Turtle", "Tortoise", "Frog",
    "Toad", "Salamander", "Axolotl", "Newt", "Phoenix", "Dragon", "Unicorn", "Griffin", "Cerberus", "Hydra",
    "Kraken", "Mermaid", "Basilisk", "Manticore", "Yeti", "Loch Ness Monster", "Kitsune", "Tanuki", "Bakeneko", "Nekomata",
    "Qilin", "Kirin", "Pegasus", "Wyvern", "Leviathan", "Cockatrice", "Siren", "Harpy", "Minotaur", "Centaur",
    "Satyr"
  ];

  // ===== MONSTER GIRL ENCYCLOPEDIA (MGE) RACES (100 SPECIES) =====
  const mgeRaces = [
    "Lamia", "Harpy", "Mermaid", "Centaur", "Arachne", "Alraune", "Dullahan", "Scylla", "Sphinx", "Valkyrie",
    "Slime Girl", "Succubus", "Incubus", "Kitsune", "Nekomata", "Dragonewt", "Phoenix", "Siren", "Kobold", "Goblin",
    "Minotaur", "Gryphon", "Anubis", "Wendigo", "Cockatrice", "Echidna", "Medusa", "Karkadann", "Lich", "Banshee",
    "Gargoyle", "Dryad", "Nereid", "Nymph", "Devil", "Angel", "Yuki-onna", "Jorogumo", "Kasha", "Raiju",
    "Inugami", "Yamata no Orochi", "Holstaurus (Cow Girl)", "Baphomet", "Cait Sith", "Werewolf", "Vampire", "Ghoul", "Demon", "Salamander",
    "Undine", "Sylph", "Gnome", "Wyvern", "Leviathan", "Kraken", "Behemoth", "Chimera", "Orthrus", "Cerberus",
    "Pegasus", "Unicorn", "Hippogriff", "Mantis Girl", "Bee Girl (Apis)", "Ant Girl (Myrmex)", "Moth Girl", "Butterfly Girl", "Snail Girl", "Lindwurm",
    "Mandrake", "Flytrap Girl", "Treant Girl", "Mushroom Girl", "Jiangshi", "Mummy", "Skeleton Girl", "Phantom", "Poltergeist", "Shadow Girl",
    "Homunculus", "Automaton (Golem)", "Mimic", "Living Armor", "Doppelganger", "High Elf", "Dark Elf", "Orc Girl", "Oni (Ogre)", "Tengu",
    "Kappa", "Kamaitachi", "Mujina", "Nue", "Qilin", "Thunderbird", "Hydra", "Sea Bishop", "Beholder Girl", "Wererabbit"
  ];

  const objects = [
    "Lantern", "Mask", "Umbrella", "Mirror", "Clock", "Book", "Bell", "Sword", "Ribbon", "Teacup",
    "Candle", "Fan", "Chains", "Key", "Flowers", "Music Box", "Camera", "Scissors", "Notebook", "Pen",
    "Pencil", "Brush", "Paint", "Bottle", "Potion", "Crystal", "Gem", "Ring", "Necklace", "Bracelet",
    "Crown", "Cape", "Hat", "Shoes", "Boots", "Gloves", "Helmet", "Armor", "Shield", "Spear",
    "Bow", "Arrow", "Gun", "Dagger", "Knife", "Axe", "Hammer", "Staff", "Wand", "Orb",
    "Dice", "Card", "Chess Piece", "Coin", "Wallet", "Bag", "Backpack", "Suitcase", "Map", "Compass",
    "Binoculars", "Telescope", "Microscope", "Phone", "Tablet", "Laptop", "Computer", "Keyboard", "Mouse", "Headphones",
    "Speaker", "Microphone", "Radio", "Television", "Monitor", "Controller", "Joystick", "Drone", "Robot", "Gear",
    "Pipe", "Valve", "Engine", "Battery", "Lightbulb", "Neon Sign", "Flashlight", "Torch", "Firework", "Bomb",
    "Rocket", "Satellite", "Spaceship", "Train", "Car", "Bike", "Motorcycle", "Boat", "Ship", "Anchor",
    "Wheel", "Ticket", "Passport", "Stamp", "Envelope", "Letter", "Scroll", "Poster", "Painting", "Frame",
    "Canvas", "Statue", "Doll", "Puppet", "Marionette", "Toy", "Plushie", "Balloon", "Bubble", "Snow Globe",
    "Hourglass", "Pocket Watch", "Calendar", "Diary", "Bookmark", "Photo", "Polaroid", "Film Reel", "Cassette", "Vinyl",
    "CD", "DVD", "Projector", "Typewriter", "Printer", "Stamp Pad", "Sticker", "Badge", "Medal", "Trophy",
    "Cane", "Crutch", "Wheelchair", "Sunglasses", "Glasses", "Hairpin", "Comb", "Perfume", "Lipstick", "Mirror Compact",
    "Soap", "Towel", "Pillow", "Blanket", "Curtain", "Chair", "Table", "Desk", "Cabinet", "Shelf",
    "Drawer", "Bed", "Lamp", "Chandelier", "Window", "Door", "Fence", "Bridge", "Fountain", "Clock Tower",
    "Bird Cage", "Aquarium", "Terrarium", "Plant Pot", "Vase", "Bonsai", "Cactus", "Mushroom", "Feather", "Bone",
    "Skull", "Fossil", "Shell", "Pearl", "Coral", "Ice Cube", "Snowflake", "Cloud", "Star", "Moon",
    "Sun", "Planet", "Meteor", "Comet", "Galaxy", "Crystal Ball", "Tarot Card", "Ouija Board", "Dreamcatcher", "Totem",
    "Charm", "Talisman", "Seal Stamp", "Origami", "Paper Crane", "Kite", "Pinwheel", "Wind Chime", "Bellflower", "Lotus",
    "Cherry Blossom", "Rose", "Sunflower", "Lavender", "Violet", "Lily", "Daisy", "Tulip", "Hydrangea", "Spider Lily",
    "Maple Leaf", "Bamboo", "Pinecone", "Acorn", "Apple", "Orange", "Peach", "Strawberry", "Blueberry", "Cherry",
    "Grape", "Watermelon", "Cake", "Cookie", "Candy", "Chocolate", "Ice Cream", "Donut", "Cupcake", "Bread",
    "Croissant", "Pizza", "Burger", "Noodles", "Ramen", "Sushi", "Bento", "Teapot", "Coffee Cup", "Wine Glass",
    "Bottle Cap", "Fork", "Spoon", "Plate", "Bowl", "Tray", "Cooking Pot", "Pan", "Oven", "Stove",
    "Refrigerator", "Safe", "Treasure Chest", "Lock", "Padlock", "Chain", "Rope", "Net", "Hook", "Fishing Rod",
    "Bucket", "Shovel", "Pickaxe", "Lantern Pole", "Street Sign", "Traffic Light", "Mailbox", "Telephone Booth", "Vending Machine", "ATM",
    "Escalator", "Elevator", "Clockwork Gear", "Steam Engine", "Cyber Chip", "Hologram", "Neon Tube", "Pixel Cube", "Glitch Screen", "Data Disk",
    "Memory Card", "USB Drive", "VR Headset", "AI Core", "Energy Sword", "Mechanical Arm", "Hoverboard", "Jetpack", "Magic Scroll", "Rune Stone",
    "Ancient Tablet", "Sacred Relic", "Golden Apple", "Silver Key", "Black Feather", "White Rose", "Red Thread", "Blue Flame", "Broken Sword", "Cracked Mask",
    "Glass Eye", "Artificial Heart", "Music Sheet", "Violin", "Piano", "Guitar", "Flute", "Drum", "Accordion", "Harp",
    "Trumpet", "Saxophone", "Megaphone", "Whistle", "Bell Necklace", "Fox Mask", "Kitsune Mask", "Festival Lantern", "Torii Gate", "Shrine Charm",
    "Prayer Beads", "Incense", "Tatami", "Shoji Screen", "Kimono Sleeve", "Katana", "Naginata", "Kunai", "Shuriken", "Potion Bottle",
    "Alchemy Flask", "Magic Crystal", "Floating Candle", "Spirit Lantern", "Moon Mirror", "Dream Bottle", "Star Pendant", "Cloud Ribbon", "Ink Bottle", "Calligraphy Brush",
    "Wax Seal", "Porcelain Doll", "Clockwork Bird", "Mechanical Fish", "Paper Umbrella", "Golden Crown", "Silver Bell", "Bone Crown", "Spider Web", "Crystal Flower",
    "Hanging Charm", "Wind Bell", "Raincoat", "Bandage Roll", "Medical Syringe", "Heartbeat Monitor", "Lab Coat", "Test Tube", "DNA Capsule", "Floating Book",
    "Ancient Key", "Ghost Candle", "Eclipse Orb", "Galaxy Jar", "Void Cube", "Shadow Cloak", "Light Halo", "Spirit Chain", "Magic Door", "Floating Island",
    "Moon Clock", "Star Compass", "Fantasy Map", "Dragon Egg", "Phoenix Feather", "Mermaid Pearl", "Unicorn Horn", "Griffin Claw", "Kraken Tentacle", "Hydra Fang",
    "Crystal Sword", "Lava Lamp", "Ice Crown", "Thunder Drum", "Storm Lantern", "Ocean Bottle", "Forest Totem", "Desert Relic", "Royal Cape", "Pirate Flag",
    "Knight Shield", "Samurai Helmet", "Cyber Visor", "Steampunk Goggles", "Dream Mirror", "Night Lamp", "Sun Pendant", "Moon Necklace", "Star Earrings", "Cloud Pillow",
    "Rose Crown", "Butterfly Pin", "Spider Ring", "Crow Feather", "Wolf Fang", "Cat Bell", "Rabbit Doll", "Shark Tooth", "Jellyfish Lamp",
    "Seahorse", "Throne", "Flower Vase", "Confetti", "Blood Stain", "Old Photo", "Steam Pipe", "Halo", "White Feather", "Fairy Light", "Flower Crown", "Gas Mask", "Broken Mask", "Scrap Metal", "Laser Gun", "Relic", "Scarab", "Golden Mask", "Laurel Crown", "Column Fragment", "Banner", "Smoke Bomb", "Chip", "Cigarette", "Magnifying Glass", "Radar", "Camel Figurine", "Sand Bottle", "Ancient Relic", "Snake Idol", "Leaf", "Sea Shell", "Fish Tank", "Tentacle Relic", "Ancient Book", "Magic Book", "Castle Key", "Eye Photo", "Black Hole", "Shadow Orb", "Basket", "Tea Cup", "Light Orb", "Red Flame", "Dress", "Old TV", "Tape", "Arcade Machine", "VHS Tape", "Flip Phone", "Glitter Bag", "Utility Bag", "Graffiti Spray", "Broken Guitar", "Smoked Glass", "Black Rose", "Cute Plush", "Black White Photo", "Diamond Ring", "Gold Watch", "Prism", "Script", "Light Stick", "Flask", "Bone Staff", "Fire Flame", "Spirit Charm", "Sea Bottle", "Glow Orb", "Poison Bottle", "Green Liquid", "Glowing Crystal", "Warning Sign", "Robot Part", "Clock Gear", "Broken Monitor", "Game Controller", "Coffin Key", "Blood Bottle", "Broken Mirror", "Door Key", "Paper", "Fur Coat", "Flower"
  ];

  const themes = [
    "Japanese", "Cyberpunk", "Dreamcore", "Fantasy", "Ocean", "Royal", "Nature", "Festival", "Mystery", "Space",
    "Vintage", "Steampunk", "Yokai", "Street Fashion", "Angel", "Demon", "Fairy", "Ghost", "Post-Apocalyptic", "Sci-Fi",
    "Medieval", "Victorian", "Gothic", "Dark Fantasy", "Light Fantasy", "Mythology", "Ancient Egypt", "Ancient Greece", "Ancient China", "Ancient Japan",
    "Samurai", "Ninja", "Pirate", "Knight", "Circus", "Carnival", "Casino", "Mafia", "Detective", "Military",
    "Desert", "Arctic", "Jungle", "Underwater", "Sky Kingdom", "Cloudcore", "Lovecraftian", "Witchcore", "Fairytale", "Fairycore",
    "Kidcore", "Weirdcore", "Voidcore", "Cottagecore", "Angelcore", "Devilcore", "Princesscore", "Royalcore", "Retro", "80s Neon",
    "90s Anime", "Y2K", "Techwear", "Street Punk", "Grunge", "Emo", "Pastel", "Monochrome", "Luxury", "Crystal",
    "Glass", "Porcelain", "Paper", "Ink", "Music", "Theater", "Opera", "Idol", "Magic Academy", "Alchemy",
    "Necromancer", "Celestial", "Solar", "Lunar", "Astrology", "Tarot", "Dreamwalker", "Nightmare", "Heaven", "Hell",
    "Forest Spirit", "Deep Sea", "Bioluminescent", "Toxic", "Radioactive", "Mechanical", "Clockwork", "Digital", "Glitch", "Virtual Reality",
    "Arcade", "Zombie", "Vampire", "Werewolf", "Haunted Mansion",
    "Mystic", "Farm", "Urban", "Cute", "Tropical", "Elegant", "Comedy", "Wild", "Chaos", "River", "Swamp", "Streetwear", "Midnight Purple"
  ];

  const colors = [
    "Red", "Blue", "Yellow", "Green", "Orange", "Purple", "Pink", "Black", "White", "Gray",
    "Brown", "Cyan", "Magenta", "Gold", "Silver", "Crimson", "Scarlet", "Ruby Red", "Wine Red", "Cherry Red",
    "Rose Pink", "Pastel Pink", "Hot Pink", "Baby Blue", "Sky Blue", "Ocean Blue", "Navy Blue", "Royal Blue", "Teal", "Turquoise",
    "Mint", "Emerald Green", "Forest Green", "Olive", "Lime", "Lavender", "Violet", "Lilac", "Indigo", "Midnight Purple",
    "Peach", "Coral", "Salmon", "Cream", "Ivory", "Beige", "Sand", "Chocolate Brown", "Coffee Brown", "Amber",
    "Bronze", "Copper", "Pearl White", "Snow White", "Ash Gray", "Charcoal", "Jet Black", "Obsidian", "Neon Green", "Neon Blue",
    "Neon Pink", "Neon Purple", "Glowing Cyan", "Galaxy Purple", "Space Black", "Moonlight Silver", "Sunset Orange", "Sunrise Gold", "Storm Gray", "Rain Blue",
    "Cloud White", "Ice Blue", "Frost White", "Frozen Cyan", "Lava Red", "Fire Orange", "Flame Yellow", "Poison Green", "Toxic Purple", "Blood Red",
    "Ghost White", "Shadow Black", "Dream Pink", "Cotton Candy", "Bubblegum Pink", "Strawberry Milk", "Matcha Green", "Sakura Pink", "Cherry Blossom", "Maple Red",
    "Bamboo Green", "Lotus Pink", "Ocean Mint", "Deep Sea Blue", "Jellyfish Cyan", "Crystal Blue", "Diamond White", "Amethyst Purple", "Ruby Pink", "Sapphire Blue",
    "Emerald Cyan", "Black & Gold", "White & Silver", "Red & Black", "Pink & White", "Blue & Gold", "Purple & Black", "Mint & Cream", "Sky Blue & White", "Wine Red & Gold",
    "Emerald & Black", "Peach & Beige", "Lavender & Silver", "Cyan & Purple", "Orange & Brown", "Gray & Blue", "Sakura Pink & White", "Ice Blue & Silver", "Cream & Chocolate", "Neon Pink & Black",
    "Galaxy Purple & Cyan",
    "Neon Cyan", "Deep Teal", "Earth Brown", "Neon Orange", "Sepia", "Ink Black", "Monochrome", "Rust Brown", "Steel Gray", "Lapis Blue", "Jade Green", "Dark Crimson", "Bioluminescent Cyan", "Void Black", "Toxic Green", "Pastel Purple", "Soft Green", "Sage Green", "Warm Cream", "Soft Brown", "Pastel Yellow", "Soft Yellow", "Flame Orange", "High-vis Yellow", "Champagne", "Burgundy"
  ];

  const personalities = [
    "Elegant", "Quiet", "Chaotic", "Cute", "Cold", "Mysterious", "Sleepy", "Energetic", "Greedy", "Gentle",
    "Obsessive", "Playful", "Smart", "Shy", "Loyal", "Kind", "Aggressive", "Calm", "Emotional", "Romantic",
    "Tsundere", "Yandere", "Kuudere", "Dandere", "Sadistic", "Masochistic", "Curious", "Carefree", "Serious", "Childish",
    "Immature", "Wise", "Manipulative", "Cunning", "Flirty", "Friendly", "Awkward", "Lazy", "Hardworking", "Perfectionist",
    "Clumsy", "Confident", "Cowardly", "Brave", "Heroic", "Villainous", "Jealous", "Possessive", "Protective", "Motherly",
    "Fatherly", "Lonely", "Melancholic", "Cheerful", "Optimistic", "Pessimistic", "Hopeless", "Dreamy", "Delusional", "Insane",
    "Hyperactive", "Silent", "Talkative", "Polite", "Rude", "Sarcastic", "Sassy", "Stoic", "Sensitive", "Innocent",
    "Corrupted", "Naive", "Street Smart", "Book Smart", "Overprotective", "Reckless", "Chaotic Good", "Chaotic Evil", "Lawful Good", "Lawful Evil",
    "Neutral", "Independent", "Dependent", "Attention-Seeking", "Secretive", "Paranoid", "Overthinking", "Impulsive", "Competitive", "Selfish",
    "Selfless", "Elegant but Dangerous", "Cute but Violent", "Cold but Caring", "Quiet but Crazy", "Emotionless", "Unpredictable", "Mature", "Narcissistic", "Obsessed with Beauty",
    "Obsessed with Power", "Obsessed with Knowledge", "Soft-Spoken", "Broken", "Traumatized", "Emotionally Unstable", "Fake Smile", "Chaotic Artist", "Night Owl", "Sunshine Personality",
    "Gloomy", "Pure-hearted", "Corrupt Noble", "Royal and Arrogant", "Mischievous", "Feral", "Wild", "Graceful", "Elegant Monster", "Dangerously Curious",
    "Protective but Toxic", "Emotionally Detached", "Overly Honest", "People Pleaser", "Passive Aggressive", "Smooth Talker", "Hopeless Romantic", "Drama Queen", "Crybaby", "Stubborn",
    "Rebellious", "Adventurous", "Fearless", "Timid", "Cynical", "Genius", "Chaotic Genius", "Airheaded", "Overconfident", "Gentle Giant",
    "Tiny but Aggressive", "Elegant and Calm", "Cold and Elegant", "Sweet but Manipulative", "Soft but Dangerous", "Quiet Observer", "Emotionally Empty", "Lovesick", "Devoted", "Overattached",
    "Unhinged", "Detached", "Broken Hero", "Tragic Villain", "Silent Guardian", "Sleep-Deprived", "Socially Awkward", "Attention Hungry", "Chaotic Gremlin", "Angel-like",
    "Demon-like", "Monster-like", "Cat-like", "Fox-like", "Puppy-like", "Snake-like", "Crow-like", "Elegant Royalty", "Fake Innocence", "Emotionally Soft",
    "Mentally Unstable", "Extremely Loyal", "Possessively Loyal", "Violently Protective", "Morally Gray", "Sad but Gentle", "Happy but Empty", "Beautiful but Terrifying", "Charming", "Magnetic",
    "Cold-Blooded", "Emotionally Intelligent", "Unstable Genius", "Untrustworthy", "Chaotic Neutral", "Reserved", "Wholesome", "Weird", "Cryptic", "Mysteriously Calm",
    "Dreamlike", "Softhearted", "Heartless", "Obsessively Loving", "Hopelessly Devoted",
    "Serene", "Disciplined", "Tech-Savvy", "Cool", "Resourceful", "Whimsical", "Noble", "Mystic", "Free-Spirited", "Proud", "Dignified", "Majestic", "Ambitious", "Peaceful", "Nurturing", "Outgoing", "Lively", "Enigmatic", "Brooding", "Observant", "Solitary", "Philosophical", "Nostalgic", "Sophisticated", "Inventive", "Eccentric", "Determined", "Bold", "Sly", "Ancient", "Trendy", "Pure", "Compassionate", "Melancholy", "Ethereal", "Sorrowful", "Resilient", "Pragmatic", "Tough", "Cautious", "Logical", "Analytical", "Focused", "Honorable", "Chivalrous", "Stalwart", "Proper", "Grim", "Bright", "Powerful", "Artistic", "Poetic", "Fierce", "Stealthy", "Daring", "Charismatic", "Agile", "Intuitive", "Soft-spoken", "Unfathomable", "Clever", "Sweet", "Nature-Loving", "Warm", "Simple", "Soft-hearted", "Fiery", "Commanding", "Practical", "Calculated", "Outspoken", "Glamorous", "Studious", "Enthusiastic"
  ];

  const clothing = [
    "Kimono", "Oversized Hoodie", "Suit", "Streetwear", "Lolita Dress", "Techwear", "School Uniform", "Fantasy Armor", "Cape", "Winter Coat",
    "Bandages", "Maid Dress", "Priest Robe", "Nun Outfit", "Military Uniform", "Samurai Armor", "Ninja Outfit", "Pirate Coat", "Knight Armor", "Royal Dress",
    "Royal Suit", "Victorian Dress", "Victorian Suit", "Gothic Dress", "Gothic Lolita", "Punk Jacket", "Leather Jacket", "Bomber Jacket", "Denim Jacket", "Fur Coat",
    "Trench Coat", "Raincoat", "Lab Coat", "Doctor Uniform", "Nurse Outfit", "Chef Outfit", "Waiter Uniform", "Idol Costume", "Magician Outfit", "Witch Dress",
    "Wizard Robe", "Mage Cloak", "Alchemist Coat", "Cyber Suit", "Spacesuit", "Steampunk Outfit", "Clockwork Armor", "Battle Dress", "Tactical Gear", "Sniper Outfit",
    "Assassin Cloak", "Spy Outfit", "Detective Coat", "Mafia Suit", "Yakuza Outfit", "Festival Yukata", "Hanfu", "Cheongsam", "Qipao", "Shrine Maiden Outfit",
    "Monk Robe", "Traditional Robe", "Ancient Armor", "Tribal Outfit", "Desert Robe", "Arctic Coat", "Jungle Hunter Outfit", "Explorer Outfit", "Safari Outfit", "Travel Cloak",
    "Fisherman Outfit", "Farmer Clothes", "Mechanic Uniform", "Blacksmith Outfit", "Bartender Outfit", "Dancer Costume", "Ballet Dress", "Opera Outfit", "Performer Outfit", "Circus Costume",
    "Jester Outfit", "Pajamas", "Sleepwear", "Lingerie Style Outfit", "Elegant Dress", "Casual Wear", "Formal Suit", "Business Outfit", "Office Wear", "Beachwear",
    "Swimsuit", "Sport Outfit", "Track Jacket", "Basketball Jersey", "Volleyball Uniform", "Tennis Outfit", "Martial Arts Gi", "Boxing Outfit", "Fencing Uniform", "Racing Suit",
    "Pilot Uniform", "Flight Jacket", "Sailor Uniform", "Captain Coat", "Admiral Outfit", "Post-Apocalyptic Outfit", "Scavenger Outfit", "Zombie Survivor Outfit", "Apron Dress", "Corset Dress",
    "Layered Fashion", "Loose Sweater", "Turtleneck", "Crop Top", "Off-Shoulder Shirt", "Long Skirt", "Mini Skirt", "Pleated Skirt", "Cargo Pants", "Baggy Pants",
    "Skinny Jeans", "Shorts", "Fishnet Stockings", "Thigh High Socks", "Leg Warmers", "Fingerless Gloves", "Arm Sleeves", "Neck Scarf", "Face Veil", "Half Mask Outfit",
    "Full Mask Outfit", "Fox Mask Costume", "Crow Feather Cloak", "Wolf Fur Cape", "Butterfly Dress", "Spider Silk Outfit", "Jellyfish Inspired Dress", "Shark Hoodie", "Cat Ear Hoodie", "Bunny Hoodie",
    "Dragon Scale Armor", "Phoenix Robe", "Unicorn Dress", "Angel Robe", "Demon Outfit", "Ghost Kimono", "Vampire Coat", "Werewolf Hunter Outfit", "Necromancer Robe", "Celestial Dress",
    "Galaxy Cloak", "Moonlight Dress", "Sun Priest Outfit", "Cloud-Themed Outfit", "Ocean-Themed Outfit", "Forest Spirit Outfit", "Flower-Themed Dress", "Crystal Armor", "Glass Dress", "Porcelain Doll Dress",
    "Paper Outfit", "Ink Painter Outfit", "Music-Themed Outfit", "Violin Performer Outfit", "Piano Concert Dress", "Street Punk Outfit", "Grunge Outfit", "Emo Fashion", "Y2K Fashion", "Retro 80s Outfit",
    "90s Anime Outfit", "Arcade Gamer Outfit", "Virtual Idol Outfit", "Glitchcore Outfit", "Dreamcore Outfit", "Weirdcore Outfit", "Fairycore Outfit", "Angelcore Outfit", "Cottagecore Outfit", "Royalcore Outfit",
    "Dark Academia Outfit", "Light Academia Outfit", "Soft Girl Outfit", "E-Girl Outfit", "E-Boy Outfit", "Minimalist Fashion", "Luxury Fashion", "Monochrome Outfit", "Pastel Fashion", "Neon Fashion",
    "Elegant Black Dress", "White Wedding Dress", "Funeral Outfit", "Battle Uniform", "Torn Clothes", "Oversized Shirt", "Long Hoodie", "High Collar Coat", "Cape with Fur", "Feathered Cloak",
    "Chain Accessories Outfit", "Ribbon Covered Dress", "Flower Crown Dress", "Golden Embroidered Outfit", "Silver Armor Dress", "Blood-Stained Outfit", "Burned Clothes", "Frozen Cloak", "Wet Clothing Style", "Transparent Raincoat",
    "Oversized Kimono", "Half Formal Outfit", "Sleeveless Coat", "Layered Robe", "Battle Maid Outfit", "Military Cape", "Dark Priest Outfit", "Cyber Ninja Outfit", "Tech Priest Outfit", "Steampunk Butler Outfit",
    "Clockwork Maid Outfit", "Royal Butler Outfit", "Ghost Bride Dress", "Spider Queen Dress", "Butterfly Princess Dress", "Moon Priestess Outfit", "Star Traveler Outfit", "Void Cultist Robe", "Rune Covered Cloak", "Ancient Relic Armor",
    "Mechanical Suit", "Holographic Outfit", "AI-Themed Outfit", "Android Uniform", "Robot Maid Outfit", "Synthetic Leather Outfit", "Combat Bodysuit", "Tactical Cloak", "Cyber Armor", "Digital Pattern Jacket",
    "Pixel-Themed Hoodie", "Arcane Robe", "Rune Armor", "Magic Academy Uniform", "Alchemy Uniform", "Fantasy School Outfit", "Demon General Armor", "Heavenly Robe", "Corrupted Priest Outfit", "Elegant Vampire Outfit",
    "Blood Moon Dress", "Festival Streetwear", "Luxury Kimono", "Ancient Chinese Robe", "Ancient Japanese Outfit", "Ancient Greek Toga", "Ancient Egyptian Outfit", "Temple Guardian Armor", "Sacred Shrine Outfit", "Knight Commander Armor",
    "Pirate Captain Coat", "Forest Witch Dress", "Desert Nomad Outfit", "Snow Hunter Outfit", "Deep Sea Outfit", "Bioluminescent Dress", "Toxic Scientist Outfit", "Radioactive Hazard Suit", "Shadow Assassin Outfit", "Light Guardian Outfit",
    "Chaos Cultist Outfit", "Dream Walker Outfit", "Nightmare Cloak", "Lace Dress", "Ribbon Outfit", "Pearl Decorated Dress", "Crystal Decorated Outfit", "Gold Trimmed Robe", "Silver Thread Kimono", "Ink Splattered Outfit",
    "Paint Covered Overalls", "Musician Streetwear", "Elegant Concert Suit", "Theater Costume", "Opera Mask Outfit", "Magic Performer Outfit", "Doll-Like Outfit", "Puppet Master Outfit", "Living Armor", "Spirit Cloak",
    "Soul-Themed Outfit", "Moonlit Kimono", "Starry Night Cloak", "Cloud Hoodie", "Rainy Day Outfit", "Sunflower Dress", "Rose-Themed Outfit", "Spider Lily Kimono", "Lotus Priest Outfit", "Sakura Dress",
    "Bamboo Pattern Kimono", "Fox Spirit Outfit", "Crow-Themed Outfit", "Snake Pattern Outfit", "Tiger Fur Coat", "Rabbit Pajamas", "Koi-Themed Kimono", "Jellyfish Dress", "Shark Streetwear", "Dragon Robe",
    "Phoenix Armor", "Butterfly Sleeves", "Cat Butler Outfit", "Wolf Hunter Outfit", "Deer Spirit Outfit", "Bat Collar Coat", "Scorpion Armor", "Moth-Themed Cloak", "Frog Raincoat", "Axolotl Hoodie",
    "Whale Ocean Robe", "Octopus Streetwear", "Mechanical Wings Outfit", "Halo Dress", "Broken Crown Outfit", "Chain Bound Cloak", "Floating Sleeve Dress", "Bandage Wrapped Outfit", "Cracked Armor", "Void-Touched Robe",
    "Astral Traveler Outfit", "Comet-Themed Cloak", "Meteor Armor", "Celestial Uniform", "Dreamy Pajamas", "Soft Winter Fashion", "Heavy Military Coat", "Elegant Ballroom Dress", "Fantasy Prince Outfit", "Fantasy Princess Dress",
    "Black Wedding Suit", "White Funeral Dress", "Corrupted Royal Outfit", "Ancient Mage Outfit", "Runic Cloak", "Storm Rider Coat", "Thunder Warrior Armor", "Lava Resistant Suit", "Ice Queen Dress", "Ocean Prince Outfit",
    "Forest Guardian Cloak", "Desert King Robe", "Galaxy Explorer Suit", "Space Pirate Outfit", "Cyber Idol Outfit", "Digital Witch Outfit", "Virtual Performer Outfit", "Mechanical Knight Armor", "Steam Engineer Outfit", "Clock Tower Butler Outfit",
    "Elegant Gothic Suit", "Pastel Idol Outfit", "Neon Punk Outfit", "Dark Royal Dress", "Soft Angel Outfit", "Cute Demon Hoodie", "Street Samurai Outfit", "Arcade Gamer Hoodie", "Pixel Art Jacket", "Retro Bomber Jacket",
    "Luxury Fur Cape", "Futuristic School Uniform", "Magical Girl Outfit", "Dark Magical Girl Outfit", "Moon Guardian Dress", "Sun Warrior Armor", "Star Idol Costume", "Cloud Traveler Cloak", "Dreamcore Sweater", "Weirdcore Outfit",
    "Fairytale Dress", "Ghostly Kimono", "Haunted Bride Dress", "Vampire Ballroom Outfit", "Royal Vampire Cape", "Zombie Survivor Hoodie", "Wasteland Armor", "Scavenger Streetwear", "Broken Uniform", "Overdecorated Royal Outfit",
    "Minimal White Outfit", "Elegant Monochrome Suit", "All Black Fashion", "All White Fashion", "Pastel Rainbow Outfit", "Silver Cyber Suit", "Golden Royal Armor", "Black & Red Gothic Outfit", "Blue & Gold Royal Dress", "Pink Idol Fashion",
    "Purple Witch Dress", "Green Forest Cloak", "Orange Festival Outfit", "Red Shrine Outfit", "White Priest Robe", "Dark Cultist Cloak", "Holy Knight Armor", "Fantasy Adventurer Outfit", "Traveler Streetwear", "Elegant Casual Outfit",
    "Soft Cottagecore Dress", "Cute Layered Fashion", "Oversized Fashion", "Tight Bodysuit", "Elegant Sleeveless Dress", "One-Eyed Mask Outfit", "Mechanical Tailcoat", "Chainmail Dress", "Fantasy Butler Outfit", "Rose Thorn Cloak",
    "Poison Queen Dress", "Deep Ocean Cloak", "Frost Covered Outfit", "Burning Flame Robe", "Thunder God Armor", "Ancient Dragon Robe", "Celestial Priest Outfit", "Void King Outfit", "Dream Eater Cloak", "Night Sky Dress",
    "Galaxy Printed Hoodie", "Moon & Stars Kimono", "Crow Feather Jacket", "Fox Spirit Kimono", "Wolf Fur Armor", "Butterfly Fairy Dress",
    "Techwear Outfit", "Soft Sweater", "Sea Cape", "Cottagecore Dress", "Nature Outfit", "Streetwear Festival Outfit", "Colorful Layered Fashion", "Old Fashion Coat", "Elegant Vintage Suit", "Classic Formal Dress", "Gear Armor", "Shrine Outfit", "Light Fantasy Dress", "Elegant Suit", "Nomad Outfit", "Utility Jacket", "Black Gothic Outfit", "Crystal Dress", "Mask Outfit", "Clockwork Outfit", "Royal Cape"
  ];


  // ===== THAI TRANSLATIONS DICTIONARY =====
  const THAI_TRANSLATIONS = {
    "Fox": "สุนัขจิ้งจอก",
    "Wolf": "หมาป่า",
    "Cat": "แมว",
    "Dog": "สุนัข / หมา",
    "Rabbit": "กระต่าย",
    "Crow": "อีกา",
    "Raven": "เรเวน (อีกาใหญ่)",
    "Sparrow": "นกกระจอก",
    "Owl": "นกฮูก",
    "Hawk": "เหยี่ยว",
    "Eagle": "อินทรี",
    "Falcon": "เหยี่ยวเพเรกริน",
    "Peacock": "นกยูง",
    "Swan": "หงส์",
    "Duck": "เป็ด",
    "Goose": "ห่าน",
    "Chicken": "ไก่",
    "Rooster": "ไก่โต้ง",
    "Turkey": "ไก่งวง",
    "Pigeon": "นกพิราบ",
    "Seagull": "นกนางนวล",
    "Penguin": "เพนกวิน",
    "Parrot": "นกแก้ว",
    "Cockatoo": "นกกระตั้ว",
    "Canary": "นกคานารี",
    "Flamingo": "ฟลามิงโก",
    "Crane": "นกกระเรียน",
    "Heron": "นกยาง",
    "Stork": "นกกระสา",
    "Kiwi": "นกกีวี",
    "Cassowary": "นกคาสโซวารี",
    "Ostrich": "นกกระจอกเทศ",
    "Bat": "ค้างคาว",
    "Butterfly": "ผีเสื้อ",
    "Moth": "ผีเสื้อกลางคืน",
    "Bee": "ผึ้ง",
    "Wasp": "แตน",
    "Hornet": "ต่อ",
    "Ant": "มด",
    "Spider": "แมงมุม",
    "Scorpion": "แมงป่อง",
    "Dragonfly": "แมลงปอ",
    "Grasshopper": "ตั๊กแตน",
    "Cricket": "จิ้งหรีด",
    "Beetle": "ด้วง",
    "Ladybug": "เต่าทอง",
    "Firefly": "หิ่งห้อย",
    "Centipede": "ตะขาบ",
    "Millipede": "กิ้งกือ",
    "Snail": "หอยทาก",
    "Slug": "ทากไร้เปลือก",
    "Jellyfish": "แมงกะพรุน",
    "Octopus": "หมึกยักษ์",
    "Squid": "ปลาหมึกกล้วย",
    "Cuttlefish": "หมึกกระดอง",
    "Seal": "แมวน้ำ",
    "Sea Lion": "สิงโตทะเล",
    "Walrus": "วอลรัส",
    "Dolphin": "โลมา",
    "Whale": "วาฬ",
    "Shark": "ฉลาม",
    "Hammerhead Shark": "ฉลามหัวค้อน",
    "Tiger Shark": "ฉลามเสือ",
    "Great White Shark": "ฉลามขาว",
    "Manta Ray": "กระเบนราหู",
    "Stingray": "ปลากระเบน",
    "Swordfish": "ปลากระโทงดาบ",
    "Tuna": "ปลาทูน่า",
    "Salmon": "สีส้มแซลมอน",
    "Koi Fish": "ปลาคาร์ป",
    "Goldfish": "ปลาทอง",
    "Catfish": "ปลาดุก",
    "Pufferfish": "ปลาปักเป้า",
    "Eel": "ปลาไหล",
    "Fur Coat": "เสื้อโค้ตขนสัตว์หนานุ่ม",
    "Flower": "ดอกไม้สดกลิ่นหอม",
    "Seahorse": "ม้าน้ำ",
    "Clownfish": "ปลาการ์ตูน",
    "Angelfish": "ปลาเทวดา",
    "Betta Fish": "ปลากัด",
    "Guppy": "ปลาหางนกยูง",
    "Piranha": "ปิรันยา",
    "Carp": "ปลาคาร์ป",
    "Barracuda": "ปลาสาก",
    "Lobster": "กุ้งล็อบสเตอร์",
    "Crab": "ปู",
    "Hermit Crab": "ปูเสฉวน",
    "Shrimp": "กุ้ง",
    "Krill": "เคย / คริลล์",
    "Starfish": "ปลาดาว",
    "Sea Urchin": "หอยเม่น",
    "Otter": "นาก",
    "Beaver": "บีเวอร์",
    "Raccoon": "แรคคูน",
    "Panda": "แพนด้า",
    "Red Panda": "แพนด้าแดง",
    "Bear": "หมี",
    "Polar Bear": "หมีขั้วโลก",
    "Grizzly Bear": "หมีกริซลีย์",
    "Koala": "โคอาล่า",
    "Sloth": "สลอธ",
    "Monkey": "ลิง",
    "Chimpanzee": "ชิมแปนซี",
    "Gorilla": "กอริลลา",
    "Orangutan": "อุรังอุตัง",
    "Baboon": "ลิงบาบูน",
    "Lemur": "ลีเมอร์",
    "Tiger": "เสือโคร่ง",
    "Lion": "สิงโต",
    "Leopard": "เสือดาว",
    "Jaguar": "เสือจากัวร์",
    "Cheetah": "เสือชีตาห์",
    "Panther": "เสือดำ",
    "Lynx": "แมวป่าลิงซ์",
    "Bobcat": "บ็อบแคต",
    "Cougar": "เสือพูม่า",
    "Hyena": "ไฮยีน่า",
    "Jackal": "หมาจิ้งจอกแจ็กคัล",
    "Coyote": "โคโยตี้",
    "Deer": "กวาง",
    "Elk": "กวางเอลค์",
    "Moose": "กวางมูส",
    "Reindeer": "กวางเรนเดียร์",
    "Goat": "แพะ",
    "Sheep": "แกะ",
    "Ram": "แกะตัวผู้ (มีเขา)",
    "Cow": "วัว",
    "Bull": "กระทิง",
    "Buffalo": "ควาย",
    "Bison": "ไบซัน",
    "Yak": "จามรี",
    "Horse": "ม้า",
    "Donkey": "ลา",
    "Zebra": "ม้าลาย",
    "Camel": "อูฐ",
    "Llama": "ยามา",
    "Alpaca": "อัลปาก้า",
    "Pig": "หมู",
    "Boar": "หมูป่า",
    "Hedgehog": "เม่นแคระ",
    "Porcupine": "เม่นใหญ่",
    "Mole": "ตัวตุ่น",
    "Rat": "หนูท่อ",
    "Mouse": "เมาส์",
    "Hamster": "แฮมสเตอร์",
    "Guinea Pig": "หนูตะเภา / แกสบี้",
    "Squirrel": "กระรอก",
    "Flying Squirrel": "กระรอกบิน",
    "Chipmunk": "ชิปมังก์",
    "Ferret": "เฟอร์เร็ต",
    "Mink": "มิงค์",
    "Weasel": "วีเซิล",
    "Badger": "แบดเจอร์",
    "Wolverine": "วูล์ฟเวอรีน",
    "Armadillo": "ตัวนิ่ม / อาร์มาดิลโล",
    "Anteater": "ตัวกินมด",
    "Tapir": "สมเสร็จ",
    "Hippo": "ฮิปโป",
    "Rhino": "แรด",
    "Elephant": "ช้าง",
    "Giraffe": "ยีราฟ",
    "Kangaroo": "จิงโจ้",
    "Wallaby": "วัลลาบี",
    "Possum": "พอสซัม",
    "Wombat": "วอมแบต",
    "Platypus": "ตุ่นปากเป็ด",
    "Tasmanian Devil": "แทสเมเนียนเดวิล",
    "Crocodile": "จระเข้",
    "Alligator": "แอลลิเกเตอร์",
    "Komodo Dragon": "มังกรโคโมโด",
    "Lizard": "กิ้งก่า",
    "Gecko": "ตุ๊กแก / จิ้งจก",
    "Iguana": "อีกัวน่า",
    "Chameleon": "กิ้งก่าคาเมเลียน",
    "Snake": "งู",
    "Cobra": "งูเห่า",
    "Python": "งูหลาม",
    "Viper": "งูกะปะ / งูพิษ",
    "Anaconda": "อนาคอนดา",
    "Turtle": "เต่าน้ำ",
    "Tortoise": "เต่าบก",
    "Frog": "กบ",
    "Toad": "คางคก",
    "Salamander": "ซาลาแมนเดอร์",
    "Axolotl": "แอกโซลอเติล (หมาน้ำ)",
    "Newt": "นิวต์",
    "Phoenix": "ฟีนิกซ์ (วิหคเพลิง)",
    "Dragon": "มังกร",
    "Unicorn": "ยูนิคอร์น",
    "Griffin": "กริฟฟิน",
    "Cerberus": "เซอร์เบอรัส (หมาสามหัว)",
    "Hydra": "ไฮดรา",
    "Kraken": "คราเคน",
    "Mermaid": "นางเงือก",
    "Basilisk": "บาซิลิสก์",
    "Manticore": "แมนติคอร์",
    "Yeti": "เยติ (มนุษย์หิมะ)",
    "Loch Ness Monster": "เนสซี (สัตว์ประหลาดล็อกเนสส์)",
    "Kitsune": "คิตสึเนะ (จิ้งจอกเก้าหาง)",
    "Tanuki": "ทานูกิ",
    "Bakeneko": "บาเกเนโกะ (แมวผี)",
    "Nekomata": "เนโกะมาตะ (แมวสองหาง)",
    "Qilin": "กิเลน",
    "Kirin": "คิริน / กิเลน",
    "Pegasus": "เพกาซัส (ม้ามีปีก)",
    "Wyvern": "ไวเวิร์น",
    "Leviathan": "เลเวียธาน",
    "Cockatrice": "ค็อกคาทริซ",
    "Siren": "ไซเรน",
    "Harpy": "ฮาร์ปี (หญิงครึ่งนก)",
    "Minotaur": "มิโนทอร์ (คนครึ่งวัว)",
    "Centaur": "เซนทอร์ (คนครึ่งม้า)",
    "Satyr": "เซเทอร์ (คนครึ่งแพะ)",
    "Lamia": "ลาเมีย (หญิงครึ่งงู)",
    "Arachne": "อารัคเน่ (หญิงครึ่งแมงมุม)",
    "Alraune": "อัลเราเน่ (ภูติพฤกษา/ดอกไม้)",
    "Dullahan": "ดูลาฮาน (อัศวินไร้หัว)",
    "Scylla": "สคิลลา (อสูรทะเลหนวดหมึก)",
    "Sphinx": "สฟิงซ์",
    "Valkyrie": "วาลคิรี (เทพธิดานักรบ)",
    "Slime Girl": "สไลม์เกิร์ล (สาวสไลม์)",
    "Succubus": "ซัคคิวบัส (ปีศาจสาวราคะ)",
    "Incubus": "อินคิวบัส (ปีศาจฝันร้าย)",
    "Dragonewt": "ดราโกนิวต์ (มนุษย์มังกร)",
    "Kobold": "โคโบลด์ (มนุษย์หมาจิ๋ว)",
    "Goblin": "ก็อบลิน",
    "Gryphon": "กริฟฟอน",
    "Anubis": "อนูบิส (เทวีหมาป่าแจ็กคัล)",
    "Wendigo": "เวนดิโก (ปีศาจหิมะเขากวาง)",
    "Echidna": "เอคิดน่า (มารดาแห่งอสุรกาย)",
    "Medusa": "เมดูซ่า (ปีศาจสาวผมงู)",
    "Karkadann": "คาร์คาดันน์ (ยูนิคอร์นเขาเดียวดุร้าย)",
    "Lich": "ลิช (ราชาผีดิบเวทมนตร์)",
    "Banshee": "แบนชี (ภูติสาวหวีดร้อง)",
    "Gargoyle": "การ์กอยล์ (ปีศาจหินมีปีก)",
    "Dryad": "ดรายแอด (พรายไม้/ภูติต้นไม้)",
    "Nereid": "เนรีด (พรายน้ำทะเล)",
    "Nymph": "นิมฟ์ (ภูติสาวธรรมชาติ)",
    "Devil": "ปิศาจ / เดวิล",
    "Angel": "นางฟ้า / เทวทูต",
    "Yuki-onna": "ยูกิอนนะ (สาวหิมะ)",
    "Jorogumo": "โจโรกุโมะ (นางพญาแมงมุม)",
    "Kasha": "คาฉะ (ปีศาจแมวเพลิง)",
    "Raiju": "ไรจู (สัตว์อสูรสายฟ้า)",
    "Inugami": "อินุกามิ (วิญญาณสุนัขเทพ)",
    "Yamata no Orochi": "ยามาตะ โนะ โอโรจิ (มังกรแปดหัว)",
    "Holstaurus (Cow Girl)": "โฮลสตอรัส (สาววัวนม)",
    "Baphomet": "บาโฟเมต (ปีศาจแพะดำ)",
    "Cait Sith": "เคท ซิธ (ภูติแมวติดโบ)",
    "Werewolf": "มนุษย์หมาป่า",
    "Vampire": "แวมไพร์ (ผีดูดเลือด)",
    "Ghoul": "กูล (ผีดิบกินซากศพ)",
    "Demon": "เดมอน (จอมปีศาจ)",
    "Undine": "อันดีน (ภูติธาตุน้ำ)",
    "Sylph": "ซิลฟ์ (ภูติธาตุลม)",
    "Gnome": "โนม (ภูติธาตุดิน)",
    "Behemoth": "เบฮีมอธ (อสูรยักษ์ปฐพี)",
    "Chimera": "คิเมร่า (สัตว์ประหลาดรวมสายพันธุ์)",
    "Orthrus": "ออร์ธรัส (หมาสองหัว)",
    "Hippogriff": "ฮิปโปกริฟฟ์ (อินทรีครึ่งม้า)",
    "Mantis Girl": "สาวตั๊กแตนตำข้าว",
    "Bee Girl (Apis)": "สาวผึ้ง (เอพิส)",
    "Ant Girl (Myrmex)": "สาวมด (เมียร์เม็กซ์)",
    "Moth Girl": "สาวผีเสื้อกลางคืน",
    "Butterfly Girl": "สาวผีเสื้อ",
    "Snail Girl": "สาวหอยทาก",
    "Lindwurm": "ลินด์วูร์ม (มังกรไร้ขาหน้า)",
    "Mandrake": "แมนเดรก (พืชกรีดร้อง)",
    "Flytrap Girl": "สาวกาบหอยแครง (พืชกินแมลง)",
    "Treant Girl": "สาวพฤกษาโบราณ",
    "Mushroom Girl": "สาวเห็ด",
    "Jiangshi": "เจียงซี (ผีดิบจีนกระโดด)",
    "Mummy": "มัมมี่",
    "Skeleton Girl": "สาวโครงกระดูก",
    "Phantom": "แฟนทอม (วิญญาณหลอน)",
    "Poltergeist": "โพลเตอร์ไกสท์ (ผีเคาะห้อง)",
    "Shadow Girl": "สาวเงาทมิฬ",
    "Homunculus": "โฮมุนครูลัส (มนุษย์สังเคราะห์)",
    "Automaton (Golem)": "โกเลม / จักรกลเวทมนตร์",
    "Mimic": "มิมิก (หีบสมบัติแปลงกาย)",
    "Living Armor": "ชุดเกราะมีชีวิต",
    "Doppelganger": "ด็อพเพิลแกงเกอร์ (ร่างโคลนจำแลง)",
    "High Elf": "ไฮเอลฟ์ (เอลฟ์ชั้นสูง)",
    "Dark Elf": "ดาร์กเอลฟ์ (เอลฟ์มืด)",
    "Orc Girl": "สาวออร์ค",
    "Oni (Ogre)": "โอนิ (ยักษ์ญี่ปุ่น)",
    "Tengu": "เท็นงู (ปีศาจกาปีกดำ)",
    "Kappa": "กัปปะ",
    "Kamaitachi": "คาไมทาจิ (ภูติพังพอนเคียวลม)",
    "Mujina": "มุจินะ (ปีศาจแบดเจอร์จำแลง)",
    "Nue": "นูเอะ (อสูรสารพัดสัตว์)",
    "Thunderbird": "วิหคสายฟ้า",
    "Sea Bishop": "บิชอปทะเล (มอนสเตอร์ปลานักบวช)",
    "Beholder Girl": "สาวบีโฮลเดอร์ (ลูกตาเวทมนตร์)",
    "Wererabbit": "กระต่ายป่าแปลงกาย",
    "Japanese": "ญี่ปุ่น / โบราณ",
    "Cyberpunk": "ไซเบอร์พังก์ (โลกอนาคตไฟนีออน)",
    "Dreamcore": "ดรีมคอร์ (ความฝันแปลกตา/ลึกลับ)",
    "Fantasy": "แฟนตาซี (เวทมนตร์)",
    "Ocean": "มหาสมุทร / ท้องทะเล",
    "Royal": "ราชวงศ์ / หรูหราสูงส่ง",
    "Nature": "ธรรมชาติ / ป่าเขา",
    "Festival": "เทศกาล / งานวัดรื่นเริง",
    "Mystery": "ลึกลับ / สืบสวน",
    "Space": "อวกาศ / ดาราจักร",
    "Vintage": "วินเทจ / ย้อนยุคคลาสสิก",
    "Steampunk": "สตีมพังก์ (เครื่องจักรไอน้ำทองเหลือง)",
    "Yokai": "โยไค (ภูติผีญี่ปุ่น)",
    "Street Fashion": "สตรีทแฟชั่น / แฟชั่นริมถนน",
    "Fairy": "ภูติจิ๋ว / แฟรี่",
    "Ghost": "วิญญาณ / ภูติผี",
    "Post-Apocalyptic": "วันสิ้นโลก / โลกล่มสลาย",
    "Sci-Fi": "ไซไฟ / วิทยาศาสตร์ล้ำยุค",
    "Medieval": "ยุคกลาง (ดาบและปราสาท)",
    "Victorian": "ยุควิกตอเรียน (อังกฤษโบราณหรูหรา)",
    "Gothic": "กอธิค (ดำมืด ลึกลับ อลังการ)",
    "Dark Fantasy": "ดาร์กแฟนตาซี (เวทมนตร์โทนมืด)",
    "Light Fantasy": "ไลท์แฟนตาซี (แฟนตาซีสดใส อบอุ่น)",
    "Mythology": "เทวตำนาน / ปกรณัม",
    "Ancient Egypt": "อียิปต์โบราณ",
    "Ancient Greece": "กรีกโบราณ",
    "Ancient China": "จีนโบราณ / กำลังภายใน",
    "Ancient Japan": "ญี่ปุ่นยุคโบราณ",
    "Samurai": "ซามูไร",
    "Ninja": "นินจา",
    "Pirate": "โจรสลัด",
    "Knight": "อัศวิน",
    "Circus": "ละครสัตว์",
    "Carnival": "คาร์นิวัล / งานฉลองหน้ากาก",
    "Casino": "คาสิโน / การพนันหรู",
    "Mafia": "มาเฟีย",
    "Detective": "นักสืบ",
    "Military": "ทหาร / กองทัพ",
    "Desert": "ทะเลทราย / แดนรกร้าง",
    "Arctic": "ขั้วโลก / หิมะเยือกแข็ง",
    "Jungle": "ป่าดงดิบ",
    "Underwater": "ใต้ทะเลลึก",
    "Sky Kingdom": "อาณาจักรบนท้องฟ้า",
    "Cloudcore": "คลาวด์คอร์ (ปุยเมฆ ท้องฟ้าแฟนตาซี)",
    "Lovecraftian": "เลิฟคราฟท์ (สัตว์ประหลาดจักรวาลสยองขวัญ)",
    "Witchcore": "วิทช์คอร์ (แม่มด สมุนไพร คาถา)",
    "Fairytale": "เทพนิยาย",
    "Fairycore": "แฟรี่คอร์ (ภูติดอกไม้ เห็ด ป่าเวทมนตร์)",
    "Kidcore": "คิดคอร์ (สีสันสดใสแบบเด็กยุค 90)",
    "Weirdcore": "เวียร์ดคอร์ (บรรยากาศแปลกตาชวนสงสัย)",
    "Voidcore": "วอยด์คอร์ (ความว่างเปล่า หลุมดำ มิติลี้ลับ)",
    "Cottagecore": "คอทเทจคอร์ (บ้านสวนชนบท อบอุ่น เรียบง่าย)",
    "Angelcore": "แองเจิลคอร์ (ปีกนางฟ้า สีขาว บริสุทธิ์)",
    "Devilcore": "เดวิลคอร์ (ปีศาจ เขาสีดำ เปลวไฟ)",
    "Princesscore": "เจ้าหญิงแสนหวาน",
    "Royalcore": "ความอลังการของราชวงศ์",
    "Retro": "เรโทร (ย้อนยุค)",
    "80s Neon": "นีออนยุค 80s",
    "90s Anime": "อนิเมะยุค 90s",
    "Y2K": "แฟชั่น Y2K (ยุคปี 2000)",
    "Techwear": "ชุดเทคแวร์ล้ำยุคสายรัดแน่นหนา",
    "Street Punk": "สตรีทพังก์ (ขบถ ดิบ เท่)",
    "Grunge": "กรันจ์ (เสื้อลายสก็อต วัยรุ่นดิบเท่)",
    "Emo": "อีโม (โทนดำ ผมปรกหน้า อารมณ์ลึกซึ้ง)",
    "Pastel": "สีพาสเทล (หวาน ละมุน อ่อนโยน)",
    "Monochrome": "ขาวดำคุมโทน",
    "Luxury": "หรูหรา ไฮโซ เลอค่า",
    "Crystal": "คริสตัล",
    "Glass": "แก้วใสบริสุทธิ์",
    "Porcelain": "เครื่องลายคราม / เครื่องเคลือบ",
    "Paper": "กระดาษ / ศิลปะพับกระดาษ",
    "Ink": "หมึกพู่กันจีน",
    "Music": "ดนตรี / เครื่องดนตรี",
    "Theater": "ละครเวที / การแสดง",
    "Opera": "โอเปร่า / หน้ากากโรงละคร",
    "Idol": "ไอดอล / เวทีคอนเสิร์ต",
    "Magic Academy": "โรงเรียนเวทมนตร์",
    "Alchemy": "การเล่นแร่แปรธาตุ",
    "Necromancer": "เนโครแมนเซอร์ (ผู้ใช้วิญญาณ/ควบคุมซากศพ)",
    "Celestial": "สรวงสวรรค์ / ดวงดาวบนฟากฟ้า",
    "Solar": "พลังแห่งดวงอาทิตย์",
    "Lunar": "พลังแห่งดวงจันทร์",
    "Astrology": "โหราศาสตร์ / จักรราศี",
    "Tarot": "ไพ่ทาโรต์ / พยากรณ์",
    "Dreamwalker": "ผู้ท่องฝัน",
    "Nightmare": "ฝันร้ายสยองขวัญ",
    "Heaven": "สวรรค์",
    "Hell": "นรกเพลิง",
    "Forest Spirit": "วิญญาณแห่งผืนป่า",
    "Deep Sea": "ใต้ทะเลลึกมืดมิด",
    "Bioluminescent": "เรืองแสงใต้ทะเล/ในป่า",
    "Toxic": "สารพิษ / พิษร้าย",
    "Radioactive": "รังสีอันตราย / นิวเคลียร์",
    "Mechanical": "จักรกล / ฟันเฟืองเหล็ก",
    "Clockwork": "ไขลาน / ฟันเฟืองนาฬิกา",
    "Digital": "ดิจิทัล / โลกไซเบอร์",
    "Glitch": "ภาพกระตุก / สัญญาณเออเรอร์",
    "Virtual Reality": "ความจริงเสมือน (VR)",
    "Arcade": "ตู้เกมอาเขตยุคคลาสสิก",
    "Zombie": "ซอมบี้ (ซากศพเดินได้)",
    "Haunted Mansion": "คฤหาสน์ผีสิง",
    "Red": "แดง",
    "Blue": "น้ำเงิน",
    "Yellow": "เหลือง",
    "Green": "เขียว",
    "Orange": "ส้ม",
    "Purple": "ม่วง",
    "Pink": "ชมพู",
    "Black": "ดำ",
    "White": "ขาว",
    "Gray": "เทา",
    "Brown": "น้ำตาล",
    "Cyan": "ฟ้าไซแอน",
    "Magenta": "บานเย็น / มาเจนต้า",
    "Gold": "ทอง",
    "Silver": "เงิน",
    "Crimson": "แดงเลือดนก / แดงเข้ม",
    "Scarlet": "แดงสดสการ์เล็ต",
    "Ruby Red": "แดงทับทิม",
    "Wine Red": "แดงไวน์",
    "Cherry Red": "แดงเชอร์รี่",
    "Rose Pink": "ชมพูกุหลาบ",
    "Pastel Pink": "ชมพูพาสเทล",
    "Hot Pink": "ชมพูสะท้อนแสง / ฮอตพิงก์",
    "Baby Blue": "ฟ้าเบบี้บลู (ฟ้าอ่อน)",
    "Sky Blue": "ฟ้าสว่าง / ฟ้าท้องฟ้า",
    "Ocean Blue": "น้ำเงินมหาสมุทร",
    "Navy Blue": "น้ำเงินกรมท่า",
    "Royal Blue": "น้ำเงินรอยัลบลู (น้ำเงินสดหลวง)",
    "Teal": "เขียวหัวเป็ด / น้ำเงินอมเขียว",
    "Turquoise": "เทอร์ควอยซ์ (ฟ้าอมเขียวมรกต)",
    "Mint": "เขียวมิ้นต์",
    "Emerald Green": "เขียวมรกต",
    "Forest Green": "เขียวป่าลึก",
    "Olive": "เขียวมะกอก",
    "Lime": "เขียวมะนาว",
    "Lavender": "ดอกลาเวนเดอร์",
    "Violet": "ดอกไวโอเล็ต",
    "Lilac": "ม่วงไลแลค",
    "Indigo": "คราม / อินดิโก",
    "Midnight Purple": "ม่วงมิดไนท์ (ม่วงเข้มราตรี)",
    "Peach": "ลูกพีช",
    "Coral": "ปะการัง",
    "Cream": "สีครีม",
    "Ivory": "สีงาช้าง",
    "Beige": "สีเบจ",
    "Sand": "สีทราย",
    "Chocolate Brown": "น้ำตาลช็อกโกแลต",
    "Coffee Brown": "น้ำตาลกาแฟ",
    "Amber": "สีอำพัน",
    "Bronze": "บรอนซ์ (ทองแดงสัมฤทธิ์)",
    "Copper": "สีทองแดง",
    "Pearl White": "ขาวไข่มุก",
    "Snow White": "ขาวหิมะ",
    "Ash Gray": "เทาขี้เถ้า",
    "Charcoal": "เทาถ่านชาร์โคล",
    "Jet Black": "ดำสนิท / ดำเจ็ทแบล็ก",
    "Obsidian": "ดำเงาหินออบซิเดียน",
    "Neon Green": "เขียวนีออนสะท้อนแสง",
    "Neon Blue": "ฟ้านีออน",
    "Neon Pink": "ชมพูนีออน",
    "Neon Purple": "ม่วงนีออน",
    "Glowing Cyan": "ฟ้าไซแอนเรืองแสง",
    "Galaxy Purple": "ม่วงกาแล็กซี",
    "Space Black": "ดำอวกาศไร้ที่สิ้นสุด",
    "Moonlight Silver": "เงินแสงจันทร์",
    "Sunset Orange": "ส้มอาทิตย์อัสดง",
    "Sunrise Gold": "ทองรุ่งอรุณ",
    "Storm Gray": "เทาพายุครึ้ม",
    "Rain Blue": "ฟ้าสายฝน",
    "Cloud White": "ขาวปุยเมฆ",
    "Ice Blue": "ฟ้าไอซ์บลู (ฟ้าน้ำแข็ง)",
    "Frost White": "ขาวเกล็ดน้ำแข็ง",
    "Frozen Cyan": "ฟ้าเยือกแข็ง",
    "Lava Red": "แดงลาวาภูเขาไฟ",
    "Fire Orange": "ส้มเปลวเพลิง",
    "Flame Yellow": "เหลืองเปลวไฟ",
    "Poison Green": "เขียวพิษร้าย",
    "Toxic Purple": "ม่วงสารพิษ",
    "Blood Red": "แดงเลือด",
    "Ghost White": "ขาววิญญาณ",
    "Shadow Black": "ดำเงามืด",
    "Dream Pink": "ชมพูดั่งความฝัน",
    "Cotton Candy": "สีสายไหม (ชมพูฟ้าหวาน)",
    "Bubblegum Pink": "ชมพูหมากฝรั่ง",
    "Strawberry Milk": "ชมพูนมสตรอว์เบอร์รี",
    "Matcha Green": "เขียวมัทฉะ",
    "Sakura Pink": "ชมพูซากุระ",
    "Cherry Blossom": "ดอกซากุระ",
    "Maple Red": "แดงใบเมเปิ้ล",
    "Bamboo Green": "เขียวต้นไผ่",
    "Lotus Pink": "ชมพูดอกบัว",
    "Ocean Mint": "เขียวมิ้นต์น้ำทะเล",
    "Deep Sea Blue": "น้ำเงินใต้ทะเลลึก",
    "Jellyfish Cyan": "ฟ้าไซแอนแมงกะพรุน",
    "Crystal Blue": "ฟ้าประกายคริสตัล",
    "Diamond White": "ขาวประกายเพชร",
    "Amethyst Purple": "ม่วงอเมทิสต์",
    "Ruby Pink": "ชมพูทับทิม",
    "Sapphire Blue": "น้ำเงินไพลิน",
    "Emerald Cyan": "ฟ้าอมเขียวมรกต",
    "Black & Gold": "ดำและทอง",
    "White & Silver": "ขาวและเงิน",
    "Red & Black": "แดงและดำ",
    "Pink & White": "ชมพูและขาว",
    "Blue & Gold": "น้ำเงินและทอง",
    "Purple & Black": "ม่วงและดำ",
    "Mint & Cream": "เขียวมิ้นต์และครีม",
    "Sky Blue & White": "ฟ้าและขาว",
    "Wine Red & Gold": "แดงไวน์และทอง",
    "Emerald & Black": "เขียวมรกตและดำ",
    "Peach & Beige": "สีพีชและเบจ",
    "Lavender & Silver": "ม่วงลาเวนเดอร์และเงิน",
    "Cyan & Purple": "ฟ้าไซแอนและม่วง",
    "Orange & Brown": "ส้มและน้ำตาล",
    "Gray & Blue": "เทาและน้ำเงิน",
    "Sakura Pink & White": "ชมพูซากุระและขาว",
    "Ice Blue & Silver": "ฟ้าน้ำแข็งและเงิน",
    "Cream & Chocolate": "ครีมและช็อกโกแลต",
    "Neon Pink & Black": "ชมพูนีออนและดำ",
    "Galaxy Purple & Cyan": "ม่วงกาแล็กซีและฟ้าไซแอน",
    "Elegant": "สง่างาม / ผู้ดี",
    "Quiet": "เงียบขรึม / พูดน้อย",
    "Chaotic": "โกลาหล / ป่วนซน",
    "Cute": "น่ารักสดใส",
    "Cold": "เย็นชา / ไร้หัวใจ",
    "Mysterious": "ลึกลับน่าค้นหา",
    "Sleepy": "ง่วงนอนตลอดเวลา",
    "Energetic": "กระตือรือร้น / เปี่ยมพลัง",
    "Greedy": "ละโมบ / โลภมาก",
    "Gentle": "อ่อนโยน / อบอุ่น",
    "Obsessive": "คลั่งไคล้ / หวงแหน",
    "Playful": "ขี้เล่น / ร่าเริง",
    "Smart": "ฉลาดหลักแหลม",
    "Shy": "ขี้อาย / ประหม่า",
    "Loyal": "ซื่อสัตย์ภักดี",
    "Kind": "ใจดีมีเมตตา",
    "Aggressive": "ดุดัน / ก้าวร้าว",
    "Calm": "ใจเย็น / สงบนิ่ง",
    "Emotional": "อ่อนไหวง่าย / เจ้าอารมณ์",
    "Romantic": "โรแมนติก ช่างฝัน",
    "Tsundere": "ซึนเดเระ (ปากไม่ตรงกับใจ)",
    "Yandere": "ยันเดเระ (รักรุนแรงถึงขั้นคลั่ง)",
    "Kuudere": "คูเดเระ (นิ่งเงียบแต่แอบห่วงใย)",
    "Dandere": "ดันเดเระ (เงียบขี้อายแต่เปิดใจเมื่อสนิท)",
    "Sadistic": "ซาดิสม์ (ชอบเห็นผู้อื่นเจ็บปวด)",
    "Masochistic": "มาโซคิสม์ (ชอบความเจ็บปวด)",
    "Curious": "อยากรู้อยากเห็น / ช่างสงสัย",
    "Carefree": "รักอิสระ / ไร้กังวล",
    "Serious": "จริงจัง / เคร่งขรึม",
    "Childish": "นิสัยเหมือนเด็ก",
    "Immature": "ไร้เดียงสา / ยังไม่โต",
    "Wise": "ปราดเปรื่อง มีปัญญา",
    "Manipulative": "เจ้าเล่ห์ / ชอบชักใย",
    "Cunning": "ฉลาดแกมโกง",
    "Flirty": "เจ้าเสน่ห์ / ชอบหยอด",
    "Friendly": "เป็นมิตร / เข้ากับคนง่าย",
    "Awkward": "โก๊ะ / เก้ๆ กังๆ",
    "Lazy": "ขี้เกียจ / รักความสบาย",
    "Hardworking": "ขยันมุ่งมั่น",
    "Perfectionist": "รักความสมบูรณ์แบบ",
    "Clumsy": "ซุ่มซ่าม / เปิ่น",
    "Confident": "มั่นใจในตัวเองสูง",
    "Cowardly": "ขี้ขลาดตาขาว",
    "Brave": "กล้าหาญชาญชัย",
    "Heroic": "มีคุณธรรมแบบวีรบุรุษ",
    "Villainous": "ชั่วร้ายดั่งจอมมาร",
    "Jealous": "ขี้หึง / ขี้อิจฉา",
    "Possessive": "หวงของ / ยึดติดเป็นเจ้าของ",
    "Protective": "ชอบปกป้องดูแล",
    "Motherly": "อบอุ่นดั่งมารดา",
    "Fatherly": "อบอุ่นพึ่งพาได้ดั่งบิดา",
    "Lonely": "โดดเดี่ยวอ้างว้าง",
    "Melancholic": "เศร้าซึมลึกซึ้ง",
    "Cheerful": "ร่าเริงแจ่มใส",
    "Optimistic": "มองโลกในแง่ดี",
    "Pessimistic": "มองโลกในแง่ร้าย",
    "Hopeless": "สิ้นหวังหมดใจ",
    "Dreamy": "ช่างเพ้อฝัน",
    "Delusional": "มโนเพ้อเจ้อ / หลงผิด",
    "Insane": "บ้าคลั่งเสียสติ",
    "Hyperactive": "อยู่ไม่สุข / พลังล้นเหลือ",
    "Silent": "นิ่งเงียบไม่ส่งเสียง",
    "Talkative": "ช่างพูดช่างคุย",
    "Polite": "สุภาพเรียบร้อย",
    "Rude": "หยาบคายไร้มารยาท",
    "Sarcastic": "ประชดประชันเก่ง",
    "Sassy": "แสบซ่า / กวนๆ",
    "Stoic": "ไม่แสดงอารมณ์ / นิ่งสนิท",
    "Sensitive": "เปราะบาง / ไวต่อความรู้สึก",
    "Innocent": "ไร้เดียงสาบริสุทธิ์",
    "Corrupted": "แปดเปื้อนความมืด",
    "Naive": "ซื่อจนตามคนไม่ทัน",
    "Street Smart": "ฉลาดเอาตัวรอดเก่ง",
    "Book Smart": "ฉลาดรอบรู้เชิงวิชาการ",
    "Overprotective": "หวงและปกป้องจนเกินเหตุ",
    "Reckless": "บุ่มบ่ามไม่คิดหน้าคิดหลัง",
    "Chaotic Good": "คนดีสายป่วนนอกกรอบ",
    "Chaotic Evil": "คนชั่วสายทำลายล้าง",
    "Lawful Good": "คนดีเคร่งกฎระเบียบ",
    "Lawful Evil": "จอมวายร้ายใช้กฎหมายบีบ",
    "Neutral": "เป็นกลางไม่เข้าข้างใคร",
    "Independent": "พึ่งพาตัวเอง / รักสันโดษ",
    "Dependent": "ติดคนอื่น / ชอบพึ่งพา",
    "Attention-Seeking": "เรียกร้องความสนใจ",
    "Secretive": "เก็บความลับเก่ง / ปิดบังตัวตน",
    "Paranoid": "หวาดระแวงตลอดเวลา",
    "Overthinking": "คิดมากฟุ้งซ่าน",
    "Impulsive": "ใจร้อนทำตามอารมณ์",
    "Competitive": "บ้าการแข่งขัน / ไม่ยอมแพ้",
    "Selfish": "เห็นแก่ตัว",
    "Selfless": "เสียสละไม่คิดถึงตัวเอง",
    "Elegant but Dangerous": "สง่างามแต่อันตรายถึงตาย",
    "Cute but Violent": "น่ารักแต่ใช้ความรุนแรง",
    "Cold but Caring": "ปากเย็นชาแต่ใจเป็นห่วง",
    "Quiet but Crazy": "เงียบแต่มีความคลั่งซ่อนอยู่",
    "Emotionless": "ไร้ความรู้สึกโดยสิ้นเชิง",
    "Unpredictable": "คาดเดาไม่ได้",
    "Mature": "เป็นผู้ใหญ่สุขุม",
    "Narcissistic": "หลงตัวเองคิดว่าสวยหล่อที่สุด",
    "Obsessed with Beauty": "หมกมุ่นในความงดงาม",
    "Obsessed with Power": "กระหายพลังอำนาจ",
    "Obsessed with Knowledge": "กระหายใคร่รู้ศาสตร์ลึกลับ",
    "Soft-Spoken": "พูดจานุ่มนวลแผ่วเบา",
    "Broken": "จิตใจแหลกสลาย",
    "Traumatized": "มีบาดแผลฝังใจในอดีต",
    "Emotionally Unstable": "อารมณ์แปรปรวนไม่มั่นคง",
    "Fake Smile": "ยิ้มกลบเกลื่อนความเจ็บปวด",
    "Chaotic Artist": "ศิลปินอารมณ์ติสต์สุดขั้ว",
    "Night Owl": "มนุษย์ค้างคาวนอนดึก",
    "Sunshine Personality": "นิสัยสดใสเปล่งประกายดั่งแสงตะวัน",
    "Gloomy": "หม่นหมองมืดมน",
    "Pure-hearted": "จิตใจบริสุทธิ์ดั่งผ้าขาว",
    "Corrupt Noble": "ขุนนางฉ้อฉลถือตัว",
    "Royal and Arrogant": "เย่อหยิ่งดั่งเจ้าหญิงเจ้าชาย",
    "Mischievous": "เจ้าเล่ห์ซุกซน",
    "Feral": "ดุร้ายสัญชาตญาณสัตว์ป่า",
    "Wild": "ป่าเถื่อนไม่ยอมใคร",
    "Graceful": "อ่อนช้อยงดงามทุกการเคลื่อนไหว",
    "Elegant Monster": "อสูรกายชั้นสูงแสนสง่า",
    "Dangerously Curious": "อยากรู้อยากเห็นจนพาตัวเองไปสู่อันตราย",
    "Protective but Toxic": "ห่วงใยแต่สร้างความอึดอัด",
    "Emotionally Detached": "ตัดขาดจากความรู้สึกผู้อื่น",
    "Overly Honest": "ตรงไปตรงมาจนขวานผ่าซาก",
    "People Pleaser": "ชอบเอาใจคนอื่นจนลืมตัวเอง",
    "Passive Aggressive": "เหน็บแนมประชดเงียบๆ",
    "Smooth Talker": "คารมคมคายพูดจาหว่านล้อมเก่ง",
    "Hopeless Romantic": "คลั่งรักจนยอมทุกอย่าง",
    "Drama Queen": "เล่นใหญ่เวอร์เกินจริง",
    "Crybaby": "ขี้แยน้ำตาไหลง่าย",
    "Stubborn": "ดื้อรั้นหัวชนฝา",
    "Rebellious": "ขบถต่อต้านกฎเกณฑ์",
    "Adventurous": "รักการผจญภัย",
    "Fearless": "ไม่เกรงกลัวสิ่งใด",
    "Timid": "ขี้กลัวไม่กล้าสู้หน้า",
    "Cynical": "มองโลกในแง่ร้ายเย้ยหยัน",
    "Genius": "อัจฉริยะไอคิวสูง",
    "Chaotic Genius": "อัจฉริยะสายสติเฟื่อง",
    "Airheaded": "เอ๋อ / โก๊ะ / หัวช้า",
    "Overconfident": "มั่นใจเกินเบอร์",
    "Gentle Giant": "ตัวใหญ่ใจดี",
    "Tiny but Aggressive": "ตัวเล็กแต่ดุจัด",
    "Elegant and Calm": "สุขุมสง่างาม",
    "Cold and Elegant": "เย็นชาดุจนางพญาหิมะ",
    "Sweet but Manipulative": "ยิ้มหวานแต่ชักใยลับหลัง",
    "Soft but Dangerous": "ดูนุ่มนิ่มแต่อันตรายถึงชีวิต",
    "Quiet Observer": "ผู้สังเกตการณ์เงียบๆ",
    "Emotionally Empty": "จิตใจว่างเปล่าไร้จุดหมาย",
    "Lovesick": "เป็นไข้ใจเพราะความรัก",
    "Devoted": "อุทิศตนภักดีสุดหัวใจ",
    "Overattached": "ติดแจไม่ยอมห่าง",
    "Unhinged": "สติหลุดควบคุมตัวเองไม่ได้",
    "Detached": "เหินห่างไม่สุงสิงใคร",
    "Broken Hero": "วีรบุรุษผู้บอบช้ำ",
    "Tragic Villain": "ตัวร้ายที่มีอดีตน่าสงสาร",
    "Silent Guardian": "ผู้พิทักษ์เงียบผู้คอยเฝ้ามอง",
    "Sleep-Deprived": "อดนอนใต้ตาคล้ำ",
    "Socially Awkward": "เข้าสังคมไม่เก่งประหม่าคน",
    "Attention Hungry": "กระหายความสนใจจากผู้อื่น",
    "Chaotic Gremlin": "ตัวป่วนสายก่อกวนสุดแสบ",
    "Angel-like": "ดั่งนางฟ้าลงมาโปรด",
    "Demon-like": "ดั่งปีศาจเจ้าเล่ห์",
    "Monster-like": "เหมือนสัตว์ประหลาดดุร้าย",
    "Cat-like": "นิสัยแมวๆ หยิ่งแต่ขี้อ้อน",
    "Fox-like": "เจ้าเล่ห์ดั่งสุนัขจิ้งจอก",
    "Puppy-like": "ซื่อสัตย์ดั่งลูกหมาน้อย",
    "Snake-like": "เยือกเย็นลื่นไหลเหมือนงู",
    "Crow-like": "ช่างสะสมของแวววาวเหมือนกา",
    "Elegant Royalty": "สูงศักดิ์ดั่งเชื้อพระวงศ์",
    "Fake Innocence": "แกล้งทำตัวไร้เดียงสาตบตาคน",
    "Emotionally Soft": "ใจบางน้ำตาซึมง่าย",
    "Mentally Unstable": "สภาพจิตใจไม่มั่นคง",
    "Extremely Loyal": "จงรักภักดีอย่างยิ่งยวด",
    "Possessively Loyal": "ภักดีแบบหวงก้างไม่อยากให้ใครเข้าใกล้",
    "Violently Protective": "ปกป้องแบบใช้กำลังรุนแรง",
    "Morally Gray": "สีเทา ไม่ดีสุดและไม่ชั่วสุด",
    "Sad but Gentle": "เศร้าสร้อยแต่อ่อนโยน",
    "Happy but Empty": "ยิ้มแย้มแต่ข้างในว่างเปล่า",
    "Beautiful but Terrifying": "งดงามชวนสะกดแต่น่าสะพรึงกลัว",
    "Charming": "มีเสน่ห์ดึงดูดใจ",
    "Magnetic": "มีแรงดึงดูดผู้คนมหาศาล",
    "Cold-Blooded": "เลือดเย็นไม่ปรานี",
    "Emotionally Intelligent": "ฉลาดทางอารมณ์อ่านใจคนเก่ง",
    "Unstable Genius": "อัจฉริยะจิตไม่ปกติ",
    "Untrustworthy": "ไว้ใจไม่ได้หน้าไหว้หลังหลอก",
    "Chaotic Neutral": "สายป่วนตามใจตนเอง",
    "Reserved": "สงวนท่าทีไม่เปิดเผยตัว",
    "Wholesome": "อบอุ่นหัวใจ ฮีลใจ",
    "Weird": "แปลกประหลาดมีเอกลักษณ์",
    "Cryptic": "พูดจาเป็นปริศนาเข้าใจยาก",
    "Mysteriously Calm": "นิ่งสงบอย่างลึกลับน่าเกรงขาม",
    "Dreamlike": "ชวนฝันล่องลอย",
    "Softhearted": "ใจอ่อนขี้สงสาร",
    "Heartless": "ใจร้ายอำมหิต",
    "Obsessively Loving": "รักคลั่งไคล้จนแทบคลั่ง",
    "Hopelessly Devoted": "ทุ่มเทความรักให้หมดทั้งชีวิต",
    "Lantern": "โคมไฟ",
    "Mask": "หน้ากาก",
    "Umbrella": "ร่ม",
    "Mirror": "กระจก",
    "Clock": "นาฬิกา",
    "Book": "หนังสือ",
    "Bell": "กระดิ่ง / ระฆัง",
    "Sword": "ดาบ",
    "Ribbon": "ริบบิ้น / โบว์",
    "Teacup": "ถ้วยชา",
    "Candle": "เทียนไข",
    "Fan": "พัด",
    "Chains": "โซ่ตรวน",
    "Chain": "โซ่",
    "Key": "กุญแจ",
    "Flowers": "ดอกไม้",
    "Flower": "ดอกไม้",
    "Music Box": "กล่องดนตรี",
    "Camera": "กล้องถ่ายรูป",
    "Scissors": "กรรไกร",
    "Notebook": "สมุดบันทึก",
    "Pen": "ปากกา",
    "Pencil": "ดินสอ",
    "Brush": "พู่กัน / แปรง",
    "Paint": "สีวาดภาพ",
    "Bottle": "ขวดแก้ว",
    "Potion": "ยาโพชั่น / น้ำยาเวทมนตร์",
    "Gem": "อัญมณี",
    "Ring": "แหวน",
    "Necklace": "สร้อยคอ",
    "Bracelet": "กำไลข้อมือ",
    "Crown": "มงกุฎ",
    "Cape": "ผ้าคลุมไหล่",
    "Hat": "หมวก",
    "Shoes": "รองเท้า",
    "Boots": "รองเท้าบูท",
    "Gloves": "ถุงมือ",
    "Helmet": "หมวกเกราะ",
    "Armor": "ชุดเกราะ",
    "Shield": "โล่",
    "Spear": "หอก",
    "Bow": "ธนู",
    "Arrow": "ลูกศรธนู",
    "Gun": "ปืน",
    "Dagger": "มีดสั้น",
    "Knife": "มีด",
    "Axe": "ขวาน",
    "Hammer": "ค้อน",
    "Staff": "คทาเวทมนตร์",
    "Wand": "ไม้กายสิทธิ์",
    "Orb": "ลูกแก้วมนตรา",
    "Dice": "ลูกเต๋า",
    "Card": "การ์ด / ไพ่",
    "Chess Piece": "ตัวหมากรุก",
    "Coin": "เหรียญทอง",
    "Wallet": "กระเป๋าสตางค์",
    "Bag": "กระเป๋า",
    "Backpack": "กระเป๋าเป้",
    "Suitcase": "กระเป๋าเดินทาง",
    "Map": "แผนที่",
    "Compass": "เข็มทิศ",
    "Binoculars": "กล้องส่องทางไกล",
    "Telescope": "กล้องดูดาว",
    "Microscope": "กล้องจุลทรรศน์",
    "Phone": "โทรศัพท์มือถือ",
    "Tablet": "แท็บเล็ต",
    "Laptop": "แล็ปท็อป",
    "Computer": "คอมพิวเตอร์",
    "Keyboard": "คีย์บอร์ด",
    "Headphones": "หูฟังครอบหู",
    "Speaker": "ลำโพง",
    "Microphone": "ไมโครโฟน",
    "Radio": "วิทยุ",
    "Television": "โทรทัศน์",
    "Monitor": "หน้าจอ",
    "Controller": "จอยคอนโทรลเลอร์",
    "Joystick": "คันโยกเกม",
    "Drone": "โดรน",
    "Robot": "หุ่นยนต์",
    "Gear": "ฟันเฟือง",
    "Pipe": "ท่อ",
    "Valve": "วาล์ว",
    "Engine": "เครื่องยนต์",
    "Battery": "แบตเตอรี่",
    "Lightbulb": "หลอดไฟ",
    "Neon Sign": "ป้ายไฟนีออน",
    "Flashlight": "ไฟฉาย",
    "Torch": "คบเพลิง",
    "Firework": "พลุ / ดอกไม้ไฟ",
    "Bomb": "ระเบิด",
    "Rocket": "จรวด",
    "Satellite": "ดาวเทียม",
    "Spaceship": "ยานอวกาศ",
    "Train": "รถไฟ",
    "Car": "รถยนต์",
    "Bike": "จักรยาน",
    "Motorcycle": "มอเตอร์ไซค์",
    "Boat": "เรือพาย",
    "Ship": "เรือเดินสมุทร",
    "Anchor": "สมอเรือ",
    "Wheel": "ล้อ",
    "Ticket": "ตั๋ว",
    "Passport": "พาสปอร์ต",
    "Stamp": "แสตมป์",
    "Envelope": "ซองจดหมาย",
    "Letter": "จดหมาย",
    "Scroll": "ม้วนคัมภีร์",
    "Poster": "โปสเตอร์",
    "Painting": "ภาพวาดสีน้ำมัน",
    "Frame": "กรอบรูป",
    "Canvas": "ผืนผ้าใบ",
    "Statue": "รูปปั้นหิน",
    "Doll": "ตุ๊กตา",
    "Puppet": "หุ่นเชิด",
    "Marionette": "หุ่นสายชักใย",
    "Toy": "ของเล่น",
    "Plushie": "ตุ๊กตาผ้านุ่มนิ่ม",
    "Balloon": "ลูกโป่ง",
    "Bubble": "ฟองสบู่",
    "Snow Globe": "ลูกแก้วหิมะ",
    "Hourglass": "นาฬิกาทราย",
    "Pocket Watch": "นาฬิกาพกโบราณ",
    "Calendar": "ปฏิทิน",
    "Diary": "ไดอารี่",
    "Bookmark": "ที่คั่นหนังสือ",
    "Photo": "รูปถ่าย",
    "Polaroid": "ภาพโพลารอยด์",
    "Film Reel": "ม้วนฟิล์ม",
    "Cassette": "เทปคาสเซ็ท",
    "Vinyl": "แผ่นเสียงไวนิล",
    "CD": "แผ่นซีดี",
    "DVD": "แผ่นดีวีดี",
    "Projector": "เครื่องฉายโปรเจกเตอร์",
    "Typewriter": "เครื่องพิมพ์ดีด",
    "Printer": "เครื่องพิมพ์",
    "Stamp Pad": "ตรายางหมึก",
    "Sticker": "สติกเกอร์",
    "Badge": "เข็มกลัด",
    "Medal": "เหรียญรางวัล",
    "Trophy": "ถ้วยรางวัล",
    "Cane": "ไม้เท้า",
    "Crutch": "ไม้ค้ำยัน",
    "Wheelchair": "วีลแชร์",
    "Sunglasses": "แว่นกันแดด",
    "Glasses": "แว่นสายตา",
    "Hairpin": "ปิ่นปักผม",
    "Comb": "หวีสางผม",
    "Perfume": "น้ำหอม",
    "Lipstick": "ลิปสติก",
    "Mirror Compact": "ตลับแป้งกระจก",
    "Soap": "สบู่",
    "Towel": "ผ้าขนหนู",
    "Pillow": "หมอนหนุน",
    "Blanket": "ผ้าห่ม",
    "Curtain": "ผ้าม่าน",
    "Chair": "เก้าอี้",
    "Table": "โต๊ะ",
    "Desk": "โต๊ะทำงาน",
    "Cabinet": "ตู้เก็บของ",
    "Shelf": "ชั้นวางของ",
    "Drawer": "ลิ้นชัก",
    "Bed": "เตียงนอน",
    "Lamp": "โคมไฟตั้งโต๊ะ",
    "Chandelier": "โคมระย้าคริสตัล",
    "Window": "หน้าต่าง",
    "Door": "ประตู",
    "Fence": "รั้วกั้น",
    "Bridge": "สะพาน",
    "Fountain": "น้ำพุ",
    "Clock Tower": "หอนาฬิกา",
    "Bird Cage": "กรงนก",
    "Aquarium": "ตู้ปลา",
    "Terrarium": "โหลแก้วปลูกพืช",
    "Plant Pot": "กระถางต้นไม้",
    "Vase": "แจกันดอกไม้",
    "Bonsai": "บอนไซ",
    "Cactus": "ต้นกระบองเพชร",
    "Mushroom": "เห็ด",
    "Feather": "ขนนก",
    "Bone": "กระดูก",
    "Skull": "หัวกะโหลก",
    "Fossil": "ซากฟอสซิล",
    "Shell": "เปลือกหอย",
    "Pearl": "ไข่มุก",
    "Ice Cube": "ก้อนน้ำแข็ง",
    "Snowflake": "เกล็ดหิมะ",
    "Cloud": "ก้อนเมฆ",
    "Star": "ดวงดาว",
    "Moon": "ดวงจันทร์",
    "Sun": "ดวงอาทิตย์",
    "Planet": "ดาวเคราะห์",
    "Meteor": "อุกกาบาต",
    "Comet": "ดาวหาง",
    "Galaxy": "ดาราจักร / ทางช้างเผือก",
    "Crystal Ball": "ลูกแก้วทำนาย",
    "Tarot Card": "ไพ่ทาโรต์",
    "Ouija Board": "กระดานผีถ้วยแก้ว (วีจา)",
    "Dreamcatcher": "ตาข่ายดักฝัน",
    "Totem": "เสาโทเทมโบราณ",
    "Charm": "เครื่องราง",
    "Talisman": "ยันต์ศักดิ์สิทธิ์",
    "Seal Stamp": "ตราประทับขี้ผึ้ง",
    "Origami": "ศิลปะพับกระดาษโอริกามิ",
    "Paper Crane": "นกกระเรียนกระดาษ",
    "Kite": "ว่าวลอยลม",
    "Pinwheel": "กังหันลมกระดาษ",
    "Wind Chime": "กระดิ่งกระดิ่งลม",
    "Bellflower": "ดอกระฆัง",
    "Lotus": "ดอกบัว",
    "Rose": "ดอกกุหลาบ",
    "Sunflower": "ดอกทานตะวัน",
    "Lily": "ดอกลิลลี่",
    "Daisy": "ดอกเดซี่",
    "Tulip": "ดอกทิวลิป",
    "Hydrangea": "ดอกไฮเดรนเยีย",
    "Spider Lily": "ดอกพลับพลึงแดง (ฮิกังบานะ)",
    "Maple Leaf": "ใบเมเปิ้ลสีแดง",
    "Bamboo": "ต้นไผ่",
    "Pinecone": "ลูกสน",
    "Acorn": "ลูกโอ๊ก",
    "Apple": "แอปเปิ้ล",
    "Strawberry": "สตรอว์เบอร์รี",
    "Blueberry": "บลูเบอร์รี",
    "Cherry": "เชอร์รี่",
    "Grape": "องุ่น",
    "Watermelon": "แตงโม",
    "Cake": "เค้ก",
    "Cookie": "คุกกี้",
    "Candy": "ลูกกวาด",
    "Chocolate": "ช็อกโกแลต",
    "Ice Cream": "ไอศกรีม",
    "Donut": "โดนัท",
    "Cupcake": "คัพเค้ก",
    "Bread": "ขนมปัง",
    "Croissant": "ครัวซองต์",
    "Pizza": "พิซซ่า",
    "Burger": "เบอร์เกอร์",
    "Noodles": "ก๋วยเตี๋ยว / บะหมี่",
    "Ramen": "ราเมงญี่ปุ่น",
    "Sushi": "ซูชิ",
    "Bento": "ข้าวกล่องเบนโตะ",
    "Teapot": "กาน้ำชา",
    "Coffee Cup": "แก้วกาแฟ",
    "Wine Glass": "แก้วไวน์",
    "Bottle Cap": "ฝาจีบขวด",
    "Fork": "ส้อม",
    "Spoon": "ช้อน",
    "Plate": "จานอาหาร",
    "Bowl": "ชาม",
    "Tray": "ถาดเสิร์ฟ",
    "Cooking Pot": "หม้อต้ม",
    "Pan": "กระทะ",
    "Oven": "เตาอบ",
    "Stove": "เตาแก๊ส",
    "Refrigerator": "ตู้เย็น",
    "Safe": "ตู้เซฟนิรภัย",
    "Treasure Chest": "หีบสมบัติ",
    "Lock": "แม่กุญแจ",
    "Padlock": "แม่กุญแจสายยู",
    "Rope": "เชือกมนิลา",
    "Net": "ตาข่ายดักจับ",
    "Hook": "ตะขอเกี่ยว",
    "Fishing Rod": "เบ็ดตกปลา",
    "Bucket": "ถังน้ำ",
    "Shovel": "พลั่วขุดดิน",
    "Pickaxe": "อีเต็อดเจาะหิน",
    "Lantern Pole": "เสาโคมไฟริมทาง",
    "Street Sign": "ป้ายบอกทางริมถนน",
    "Traffic Light": "สัญญาณไฟจราจร",
    "Mailbox": "ตู้จดหมาย",
    "Telephone Booth": "ตู้โทรศัพท์สาธารณะ",
    "Vending Machine": "ตู้ขายของอัตโนมัติ",
    "ATM": "ตู้เอทีเอ็ม",
    "Escalator": "บันไดเลื่อน",
    "Elevator": "ลิฟต์โดยสาร",
    "Clockwork Gear": "ฟันเฟืองนาฬิกา",
    "Steam Engine": "เครื่องจักรไอน้ำ",
    "Cyber Chip": "ไมโครชิปไซเบอร์",
    "Hologram": "ภาพโฮโลแกรมสามมิติ",
    "Neon Tube": "หลอดไฟนีออนดัด",
    "Pixel Cube": "ลูกบาศก์พิกเซล",
    "Glitch Screen": "จอภาพคลื่นรบกวน",
    "Data Disk": "แผ่นบันทึกข้อมูล",
    "Memory Card": "การ์ดหน่วยความจำ",
    "USB Drive": "แฟลชไดรฟ์ USB",
    "VR Headset": "แว่นวีอาร์เสมือนจริง",
    "AI Core": "คอร์ปัญญาประดิษฐ์",
    "Energy Sword": "ดาบพลังงานพลาสมา",
    "Mechanical Arm": "แขนกลจักรกลไซบอร์ก",
    "Hoverboard": "สเก็ตบอร์ดลอยได้",
    "Jetpack": "ไอพ่นสะพายหลัง",
    "Magic Scroll": "ม้วนคัมภีร์เวทมนตร์",
    "Rune Stone": "หินอักษรรูนโบราณ",
    "Ancient Tablet": "แผ่นศิลาจารึกโบราณ",
    "Sacred Relic": "โบราณวัตถุศักดิ์สิทธิ์",
    "Golden Apple": "แอปเปิ้ลทองคำในตำนาน",
    "Silver Key": "กุญแจเงินลี้ลับ",
    "Black Feather": "ขนนกสีดำขลับ",
    "White Rose": "ดอกกุหลาบสีขาวบริสุทธิ์",
    "Red Thread": "ด้ายแดงแห่งโชคชะตา",
    "Blue Flame": "เปลวเพลิงสีน้ำเงิน",
    "Broken Sword": "ดาบหักแห่งอดีต",
    "Cracked Mask": "หน้ากากแตกร้าว",
    "Glass Eye": "ดวงตาแก้วเทียม",
    "Artificial Heart": "หัวใจจักรกลเทียม",
    "Music Sheet": "โน้ตเพลงแผ่นเสียง",
    "Violin": "ไวโอลิน",
    "Piano": "เปียโน",
    "Guitar": "กีตาร์",
    "Flute": "ขลุ่ย",
    "Drum": "กลอง",
    "Accordion": "หีบเพลงแอคคอร์เดียน",
    "Harp": "พิณฮาร์ป",
    "Trumpet": "ทรัมเป็ต",
    "Saxophone": "แซกโซโฟน",
    "Megaphone": "โทรโข่ง",
    "Whistle": "นกหวีด",
    "Bell Necklace": "สร้อยคอห้อยกระดิ่ง",
    "Fox Mask": "หน้ากากจิ้งจอกญี่ปุ่น",
    "Kitsune Mask": "หน้ากากจิ้งจอกคิตสึเนะ",
    "Festival Lantern": "โคมไฟเทศกาลงานวัด",
    "Torii Gate": "เสาโทริอิซุ้มประตูศาลเจ้า",
    "Shrine Charm": "เครื่องรางโอมาโมริศาลเจ้า",
    "Prayer Beads": "ลูกประคำสวดมนต์",
    "Incense": "ธูปหอมอบควัน",
    "Tatami": "เสื่อทาทามิ",
    "Shoji Screen": "ประตูกระดาษโชจิ",
    "Kimono Sleeve": "แขนเสื้อกิโมโนพลิ้วไหว",
    "Katana": "ดาบซามูไรคาตานะ",
    "Naginata": "ง้าวญี่ปุ่นนางินาตะ",
    "Kunai": "มีดบินคุไนของนินจา",
    "Shuriken": "ดาวกระจายชูริเคน",
    "Potion Bottle": "ขวดปรุงยาเวทมนตร์",
    "Alchemy Flask": "ขวดแก้วทดลองเล่นแร่แปรธาตุ",
    "Magic Crystal": "คริสตัลพลังเวทมนตร์",
    "Floating Candle": "เทียนไขลอยล่องในอากาศ",
    "Spirit Lantern": "โคมไฟดวงวิญญาณ",
    "Moon Mirror": "กระจกสะท้อนเงาจันทรา",
    "Dream Bottle": "ขวดแก้วกักเก็บความฝัน",
    "Star Pendant": "จี้สร้อยคอดาวประกาย",
    "Cloud Ribbon": "ริบบิ้นเมฆาพลิ้วไหว",
    "Ink Bottle": "ขวดน้ำหมึกจีนโบราณ",
    "Calligraphy Brush": "พู่กันเขียนอักษรวิจิตร",
    "Wax Seal": "ตราประทับขี้ผึ้งจดหมายลับ",
    "Porcelain Doll": "ตุ๊กตากระเบื้องเคลือบ",
    "Clockwork Bird": "นกจักรกลไขลานส่งเสียง",
    "Mechanical Fish": "ปลาจักรกลแหวกว่าย",
    "Paper Umbrella": "ร่มกระดาษน้ำมันโบราณ",
    "Golden Crown": "มงกุฎทองคำประดับอัญมณี",
    "Silver Bell": "กระดิ่งเงินดังกังวาน",
    "Bone Crown": "มงกุฎกระดูกโบราณ",
    "Spider Web": "ใยแมงมุมประกายหยาดน้ำค้าง",
    "Crystal Flower": "ดอกไม้ผลึกแก้วคริสตัล",
    "Hanging Charm": "เครื่องรางแขวนห้อย",
    "Wind Bell": "กระดิ่งลมฟูรินส่งเสียงกรุ๊งกริ๊ง",
    "Raincoat": "เสื้อกันฝนสีสดใส",
    "Bandage Roll": "ม้วนผ้าพันแผล",
    "Medical Syringe": "เข็มฉีดยา",
    "Heartbeat Monitor": "เครื่องตรวจคลื่นหัวใจ",
    "Lab Coat": "เสื้อกาวน์นักวิจัยสีขาว",
    "Test Tube": "หลอดทดลองวิทยาศาสตร์",
    "DNA Capsule": "แคปซูลเก็บรหัสพันธุกรรมดีเอ็นเอ",
    "Floating Book": "หนังสือมนตราลอยล่อง",
    "Ancient Key": "กุญแจโบราณไขประตูมิติ",
    "Ghost Candle": "เทียนไขวิญญาณเปลวไฟสีฟ้า",
    "Eclipse Orb": "ลูกแก้วสุริยุปราคา",
    "Galaxy Jar": "โหลแก้วกักเก็บดาราจักร",
    "Void Cube": "ลูกบาศก์มิติมืดแห่งความว่างเปล่า",
    "Shadow Cloak": "ผ้าคลุมเงามืดพรางกาย",
    "Light Halo": "วงแหวนแสงศักดิ์สิทธิ์บนศีรษะ",
    "Spirit Chain": "โซ่ล่ามวิญญาณ",
    "Magic Door": "ประตูมิติเวทมนตร์",
    "Floating Island": "เกาะลอยฟ้าแฟนตาซี",
    "Moon Clock": "นาฬิกาดาราศาสตร์บอกข้างขึ้นข้างแรม",
    "Star Compass": "เข็มทิศดวงดาวนำทาง",
    "Fantasy Map": "แผนที่ดินแดนแฟนตาซีโบราณ",
    "Dragon Egg": "ไข่มังกรมีเกล็ดประกาย",
    "Phoenix Feather": "ขนนกฟีนิกซ์เปลวเพลิงอมตะ",
    "Mermaid Pearl": "ไข่มุกหยาดน้ำตาเงือก",
    "Unicorn Horn": "เขาเดี่ยวยูนิคอร์นรักษาทุกพิษ",
    "Griffin Claw": "กรงเล็บกริฟฟอนคมกริบ",
    "Kraken Tentacle": "หนวดหมึกยักษ์คราเคนแห่งท้องทะเลลึก",
    "Hydra Fang": "เขี้ยวอสรพิษเก้าหัวไฮดรา",
    "Crystal Sword": "ดาบผลึกคริสตัลแก้ว",
    "Lava Lamp": "โคมไฟลาวาสีสันเรืองรอง",
    "Ice Crown": "มงกุฎผลึกน้ำแข็งเยือกแข็ง",
    "Thunder Drum": "กลองศึกอัสนีบาต",
    "Storm Lantern": "ตะเกียงเจ้าพายุ",
    "Ocean Bottle": "ขวดแก้วบรรจุน้ำทะเลลึก",
    "Forest Totem": "เสาโทเทมวิญญาณแห่งพงไพร",
    "Desert Relic": "โบราณวัตถุแห่งทะเลทรายอันสาบสูญ",
    "Royal Cape": "ผ้าคลุมกำมะหยี่สีแดงหลวง",
    "Pirate Flag": "ธงกะโหลกโจรสลัดจอลลี่โรเจอร์",
    "Knight Shield": "โล่อัศวินเหล็กกล้า",
    "Samurai Helmet": "หมวกเกราะซามูไรคาบูโตะ",
    "Cyber Visor": "แว่นเลเซอร์ไวเซอร์ไซเบอร์",
    "Steampunk Goggles": "แว่นตาสตีมพังก์เลนส์ทองเหลือง",
    "Dream Mirror": "กระจกสะท้อนภาพความฝัน",
    "Night Lamp": "โคมไฟราตรีหัวเตียง",
    "Sun Pendant": "จี้สุริยันสีทอง",
    "Moon Necklace": "สร้อยคอจันทร์เสี้ยว",
    "Star Earrings": "ต่างหูดาวระยิบระยับ",
    "Cloud Pillow": "หมอนปุยเมฆนุ่มนิ่ม",
    "Rose Crown": "มงกุฎดอกกุหลาบ",
    "Butterfly Pin": "เข็มกลัดปีกผีเสื้อ",
    "Spider Ring": "แหวนแมงมุมเงินรมดำ",
    "Crow Feather": "ขนนกกาเงาประกายดำ",
    "Wolf Fang": "เขี้ยวหมาป่าร้อยเชือก",
    "Cat Bell": "กระดิ่งแมวเสียงกรุ๊งกริ๊ง",
    "Rabbit Doll": "ตุ๊กตากระต่ายหูยาว",
    "Shark Tooth": "จี้สร้อยฟันฉลาม",
    "Jellyfish Lamp": "โคมไฟแมงกะพรุนแสงนีออน",
    "Kimono": "ชุดกิโมโนญี่ปุ่นโบราณ",
    "Oversized Hoodie": "เสื้อฮู้ดทรงโอเวอร์ไซส์ตัวใหญ่",
    "Suit": "ชุดสูทสากลเรียบหรู",
    "Streetwear": "ชุดสตรีทแวร์แฟชั่นวัยรุ่นทันสมัย",
    "Lolita Dress": "ชุดกระโปรงลูกไม้สไตล์โลลิต้า",
    "School Uniform": "ชุดเครื่องแบบนักเรียนญี่ปุ่น",
    "Fantasy Armor": "ชุดเกราะนักรบแฟนตาซี",
    "Winter Coat": "เสื้อโค้ทกันหนาวตัวหนา",
    "Bandages": "ผ้าพันแผลพันรอบตัว",
    "Maid Dress": "ชุดเมดสาวใช้สไตล์อังกฤษ",
    "Priest Robe": "ชุดคลุมบาทหลวงสีดำ",
    "Nun Outfit": "ชุดแม่ชีโบสถ์คริสต์",
    "Military Uniform": "เครื่องแบบทหารบกสุดสง่างาม",
    "Samurai Armor": "ชุดเกราะนักรบซามูไรญี่ปุ่นโบราณ",
    "Ninja Outfit": "ชุดพรางกายนินจาลอบสังหาร",
    "Pirate Coat": "เสื้อโค้ทกัปตันโจรสลัดติดกระดุมทอง",
    "Knight Armor": "ชุดเกราะอัศวินเหล็กกล้าเต็มยศ",
    "Royal Dress": "ชุดเดรสเจ้าหญิงสไตล์ราชวงศ์หรูหรา",
    "Royal Suit": "ชุดทักซิโด้เจ้าชายแห่งราชสำนัก",
    "Victorian Dress": "ชุดสุ่มวิกตอเรียนกระโปรงบานลูกไม้",
    "Victorian Suit": "ชุดสูทสุภาพบุรุษยุควิกตอเรียน",
    "Gothic Dress": "ชุดเดรสกอธิคสีดำมืดลึกลับ",
    "Gothic Lolita": "ชุดโกธิคโลลิต้าลูกไม้สีดำ",
    "Punk Jacket": "เสื้อแจ็กเก็ตพังก์ติดหมุดเหล็ก",
    "Leather Jacket": "เสื้อแจ็กเก็ตหนังแท้สีดำสุดเท่",
    "Bomber Jacket": "เสื้อแจ็กเก็ตบอมเบอร์ทหารอากาศ",
    "Denim Jacket": "เสื้อแจ็กเก็ตยีนส์คลาสสิก",
    "Fur Coat": "เสื้อโค้ทขนสัตว์ฟูนุ่ม",
    "Trench Coat": "เสื้อโค้ทกันลมเทรนช์โค้ตสไตล์นักสืบ",
    "Doctor Uniform": "เครื่องแบบแพทย์ห้องผ่าตัด",
    "Nurse Outfit": "ชุดพยาบาลสาวสีขาวสะอาด",
    "Chef Outfit": "ชุดเชฟพ่อครัวติดหมวกทรงสูง",
    "Waiter Uniform": "ชุดบริกรเสิร์ฟอาหารผูกหูกระต่าย",
    "Idol Costume": "ชุดแสดงคอนเสิร์ตไอดอลสาวสดใส",
    "Magician Outfit": "ชุดนักมายากลใส่หมวกทรงสูงถือคทา",
    "Witch Dress": "ชุดกระโปรงแม่มดใส่หมวกปลายแหลม",
    "Wizard Robe": "ชุดคลุมจอมเวททรงยาวปักลายดาว",
    "Mage Cloak": "ผ้าคลุมนักเวทแห่งสำนักมนตรา",
    "Alchemist Coat": "เสื้อโค้ทนักเล่นแร่แปรธาตุพกขวดยา",
    "Cyber Suit": "ชุดรัดรูปไซเบอร์สูทเส้นไฟนีออน",
    "Spacesuit": "ชุดนักบินอวกาศป้องกันรังสี",
    "Steampunk Outfit": "ชุดสตีมพังก์ติดแว่นและเกียร์ทองเหลือง",
    "Clockwork Armor": "ชุดเกราะไขลานติดฟันเฟืองหมุน",
    "Battle Dress": "ชุดกระโปรงประจัญบานคล่องตัว",
    "Tactical Gear": "ชุดเกราะยุทธวิธีคอมแบทพกซองปืน",
    "Sniper Outfit": "ชุดพลแม่นปืนพรางตัวด้วยกิ่งไม้ใบหญ้า",
    "Assassin Cloak": "ผ้าคลุมนักฆ่าลอบเร้นในเงามืด",
    "Spy Outfit": "ชุดสายลับสีดำกระชับแนบลำตัว",
    "Detective Coat": "เสื้อโค้ทนักสืบพกแว่นขยาย",
    "Mafia Suit": "ชุดสูทเจ้าพ่อมาเฟียคลุมไหล่",
    "Yakuza Outfit": "ชุดยากูซ่าแหวกอกโชว์รอยสักลายมังกร",
    "Festival Yukata": "ชุดยูกาตะผ้าฝ้ายลายดอกไม้เทศกาลฤดูร้อน",
    "Hanfu": "ชุดฮั่นฝูจีนโบราณแขนเสื้อพลิ้วไหว",
    "Cheongsam": "ชุดกี่เพ้ากระดุมป้ายเข้ารูป",
    "Qipao": "ชุดฉีเผ่าลายมังกรผ่าข้างสูง",
    "Shrine Maiden Outfit": "ชุดมิโกะศาลเจ้าสีขาวแดง",
    "Monk Robe": "จีวรหรือชุดคลุมนักบวชสันโดษ",
    "Traditional Robe": "ชุดคลุมพื้นเมืองโบราณ",
    "Ancient Armor": "ชุดเกราะทองสัมฤทธิ์ยุคดึกดำบรรพ์",
    "Tribal Outfit": "ชุดชนเผ่าป่าดงดิบประดับขนนกและลูกปัด",
    "Desert Robe": "ผ้าคลุมทะเลทรายกันพายุทราย",
    "Arctic Coat": "เสื้อโค้ทขนสัตว์หนากันความหนาวขั้วโลก",
    "Jungle Hunter Outfit": "ชุดนายพรานป่าดงดิบพกมีดเดินป่า",
    "Explorer Outfit": "ชุดนักสำรวจหมวกซาฟารีกางเกงขาสั้น",
    "Safari Outfit": "ชุดซาฟารีสีสีกากีออกลาดตระเวน",
    "Travel Cloak": "ผ้าคลุมนักเดินทางพเนจร",
    "Fisherman Outfit": "ชุดชาวประมงเอี๊ยมกันน้ำบูทยาง",
    "Farmer Clothes": "ชุดชาวไร่ชาวสวนใส่หมวกฟาง",
    "Mechanic Uniform": "ชุดหมีช่างยนต์เปื้อนคราบน้ำมัน",
    "Blacksmith Outfit": "ชุดช่างตีเหล็กใส่เอี๊ยมหนังกันสะเก็ดไฟ",
    "Bartender Outfit": "ชุดบาร์เทนเดอร์ใส่กั๊กผูกโบว์ไท",
    "Dancer Costume": "ชุดนักเต้นระบำผ้ามัสลินพลิ้วไหว",
    "Ballet Dress": "ชุดบัลเลต์ทูทูกระโปรงบานสั้น",
    "Opera Outfit": "ชุดร้องเพลงโอเปร่าอลังการหน้ากากขนนก",
    "Performer Outfit": "ชุดนักแสดงโชว์เวทีระยิบระยับ",
    "Circus Costume": "ชุดนักกายกรรมละครสัตว์สีสดตัดกัน",
    "Jester Outfit": "ชุดตัวตลกหลวงใส่หมวกสามแฉกห้อยกระดิ่ง",
    "Pajamas": "ชุดนอนสองท่อนลายทางสบายๆ",
    "Sleepwear": "ชุดนอนผ้าซาตินบางเบา",
    "Lingerie Style Outfit": "ชุดชั้นในลูกไม้ซีทรูสุดเซ็กซี่",
    "Elegant Dress": "ชุดราตรีสตรีสูงศักดิ์เข้ารูปสวยสง่า",
    "Casual Wear": "ชุดลำลองวันสบายๆ เสื้อยืดกางเกงยีนส์",
    "Formal Suit": "ชุดสูททางการผูกเนกไทเนี้ยบ",
    "Business Outfit": "ชุดทำงานผู้บริหารมาดมั่น",
    "Office Wear": "ชุดพนักงานออฟฟิศสุภาพ",
    "Beachwear": "ชุดไปเที่ยวทะเลรับลมร้อน",
    "Swimsuit": "ชุดว่ายน้ำวันพีซเข้ารูป",
    "Sport Outfit": "ชุดออกกำลังกายกระชับสัดส่วน",
    "Track Jacket": "เสื้อวอร์มผ้าร่มมีแถบข้างแขน",
    "Basketball Jersey": "เสื้อกล้ามบาสเกตบอลสกรีนเบอร์",
    "Volleyball Uniform": "ชุดนักกีฬาวอลเลย์บอลกางเกงขาสั้นรัดรูป",
    "Tennis Outfit": "ชุดนักเทนนิสกระโปรงจีบสีขาว",
    "Martial Arts Gi": "ชุดฝึกคาราเต้/ยูโดผูกสายดำ",
    "Boxing Outfit": "กางเกงมวยขาสั้นสวมนวมชกมวย",
    "Fencing Uniform": "ชุดฟันดาบสากลสีขาวใส่หน้ากากตะแกรงเหล็ก",
    "Racing Suit": "ชุดนักแข่งรถวันพีซติดสปอนเซอร์",
    "Pilot Uniform": "เครื่องแบบกัปตันนักบินสายการบินพาณิชย์",
    "Flight Jacket": "เสื้อแจ็กเก็ตนักบินทหารอากาศบุขนแกะ",
    "Sailor Uniform": "ชุดกะลาสีเรือปกคอทหารเรือ",
    "Captain Coat": "เสื้อโค้ทกัปตันเรือเดินสมุทร",
    "Admiral Outfit": "เครื่องแบบจอมพลเรือสายสะพายเกียรติยศ",
    "Post-Apocalyptic Outfit": "ชุดวันสิ้นโลกเศษผ้าพันตัวตัดแปะ",
    "Scavenger Outfit": "ชุดคนเก็บเศษซากโลกาวินาศสะพายเป้ใหญ่",
    "Zombie Survivor Outfit": "ชุดผู้รอดชีวิตจากฝูงซอมบี้เปื้อนเลือด",
    "Apron Dress": "ชุดเดรสสวมทับด้วยผ้ากันเปื้อนลูกไม้",
    "Corset Dress": "ชุดเดรสรัดคอร์เซ็ตเน้นสัดส่วนเอวคอด",
    "Layered Fashion": "แฟชั่นการแต่งตัวหลายชั้นซ้อนทับมีสไตล์",
    "Loose Sweater": "เสื้อไหมพรมตัวหลวมคอกว้าง",
    "Turtleneck": "เสื้อคอเต่าแขนยาวอบอุ่น",
    "Crop Top": "เสื้อครอปเอวลอยโชว์หน้าท้อง",
    "Off-Shoulder Shirt": "เสื้อเปิดไหล่ข้างเดียวดูมีเสน่ห์",
    "Long Skirt": "กระโปรงยาวถึงข้อเท้าพลิ้วไหว",
    "Mini Skirt": "กระโปรงสั้นมินิสเกิร์ตเหนือเข่า",
    "Pleated Skirt": "กระโปรงพลีทจีบรอบตัวสไตล์นักเรียน",
    "Cargo Pants": "กางเกงคาร์โก้กระเป๋าข้างเยอะแนวสตรีท",
    "Baggy Pants": "กางเกงทรงแบกกี้ขาหลวมฮิปฮอป",
    "Skinny Jeans": "กางเกงยีนส์ขาเดฟแนบเนื้อ",
    "Shorts": "กางเกงขาสั้นสบายๆ",
    "Fishnet Stockings": "ถุงน่องตาข่ายเซ็กซี่",
    "Thigh High Socks": "ถุงเท้ายาวเหนือเข่าลายแถบขาวดำ",
    "Leg Warmers": "ปลอกขาถักไหมพรมสไตล์ยุค 80s",
    "Fingerless Gloves": "ถุงมือเปิดปลายนิ้วหนังแท้",
    "Arm Sleeves": "ปลอกแขนกันแดดหรือแฟชั่นไซเบอร์",
    "Neck Scarf": "ผ้าพันคอผ้าไหมพิมพ์ลาย",
    "Face Veil": "ผ้าคลุมหน้าบางเบาพรางรอยยิ้ม",
    "Half Mask Outfit": "ชุดใส่หน้ากากครึ่งหน้าเผยสายตา",
    "Full Mask Outfit": "ชุดใส่หน้ากากปิดทั้งใบหน้าลึกลับ",
    "Fox Mask Costume": "ชุดแฟนซีใส่หน้ากากจิ้งจอกญี่ปุ่น",
    "Crow Feather Cloak": "ผ้าคลุมขนนกกาเงาประกายม่วง",
    "Wolf Fur Cape": "ผ้าคลุมไหล่ขนหมาป่าหนานุ่ม",
    "Butterfly Dress": "ชุดเดรสลายปีกผีเสื้อไล่เฉดสี",
    "Spider Silk Outfit": "ชุดทอจากใยแมงมุมเหนียวแน่นทนทาน",
    "Jellyfish Inspired Dress": "ชุดเดรสระบายพริ้วคล้ายหนวดแมงกะพรุน",
    "Shark Hoodie": "เสื้อฮู้ดฉลามมีครีบหลังและฟันฉลามที่หมวก",
    "Cat Ear Hoodie": "เสื้อฮู้ดมีหูแมวและหางยาว",
    "Bunny Hoodie": "เสื้อฮู้ดหูกระต่ายยาวลากถึงอก",
    "Dragon Scale Armor": "ชุดเกราะเกล็ดมังกรทนทานต่อเปลวเพลิง",
    "Phoenix Robe": "ชุดคลุมวิหคเพลิงประกายแสงสีส้มแดง",
    "Unicorn Dress": "ชุดเดรสยูนิคอร์นสีรุ้งพาสเทล",
    "Angel Robe": "ชุดคลุมเทวทูตสีขาวบริสุทธิ์ปีกขนนก",
    "Demon Outfit": "ชุดปีศาจสีดำแดงประดับเขาสองข้าง",
    "Ghost Kimono": "ชุดกิโมโนขาวชายหลุดรุ่ยวิญญาณคนตาย",
    "Vampire Coat": "เสื้อโค้ทท่านลอร์ดแวมไพร์ซับในกำมะหยี่สีแดงสด",
    "Werewolf Hunter Outfit": "ชุดนักล่ามนุษย์หมาป่าพกกระสุนเงิน",
    "Necromancer Robe": "ชุดคลุมเนโครแมนเซอร์หัวกะโหลกร้อยโซ่",
    "Celestial Dress": "ชุดเดรสแห่งดวงดาวท้องฟ้ายามค่ำคืน",
    "Galaxy Cloak": "ผ้าคลุมทางช้างเผือกเปล่งประกายดั่งจักรวาล",
    "Moonlight Dress": "ชุดเดรสประกายแสงจันทร์สีเงินยวบ",
    "Sun Priest Outfit": "ชุดนักบวชสุริยันสีทองเจิดจ้า",
    "Cloud-Themed Outfit": "ชุดธีมปุยเมฆขาวนุ่มฟู",
    "Ocean-Themed Outfit": "ชุดธีมระลอกคลื่นมหาสมุทรสีน้ำเงินคราม",
    "Forest Spirit Outfit": "ชุดภูติพงไพรประดับใบไม้และเถาวัลย์",
    "Flower-Themed Dress": "ชุดเดรสดอกไม้นานาพรรณบานสะพรั่ง",
    "Crystal Armor": "ชุดเกราะคริสตัลแก้วสะท้อนแสงหลากสี",
    "Glass Dress": "ชุดเดรสแก้วใสลวดลายวิจิตรบรรจง",
    "Porcelain Doll Dress": "ชุดตุ๊กตากระเบื้องเคลือบลายครามดอกโบตั๋น",
    "Paper Outfit": "ชุดทำจากกระดาษพับโอริกามิ",
    "Ink Painter Outfit": "ชุดจิตรกรเปื้อนรอยหมึกดำน้ำหมึกจีน",
    "Music-Themed Outfit": "ชุดพิมพ์ลายตัวโน้ตและคีย์เปียโน",
    "Violin Performer Outfit": "ชุดแสดงเดี่ยวไวโอลินชุดทักซิโด้ทางการ",
    "Piano Concert Dress": "ชุดราตรียาวเล่นคอนเสิร์ตเปียโน",
    "Street Punk Outfit": "ชุดสตรีทพังก์กางเกงขาดโซ่ห้อย",
    "Grunge Outfit": "ชุดกรันจ์เสื้อยืดวงร็อคทับด้วยเสื้อเชิ้ตลายสก็อต",
    "Emo Fashion": "แฟชั่นอีโมโทนดำเข็มขัดหมุดคู่",
    "Y2K Fashion": "แฟชั่นยุคปี 2000 แว่นตากันแดดแมลงปอเสื้อครอปตัวจิ๋ว",
    "Retro 80s Outfit": "ชุดเรโทรยุค 80s กางเกงเอวสูงสีสดสะท้อนแสง",
    "90s Anime Outfit": "ชุดตัวละครอนิเมะคลาสสิกยุค 90s",
    "Arcade Gamer Outfit": "ชุดเด็กติดเกมตู้ยุคคลาสสิก",
    "Virtual Idol Outfit": "ชุดไอดอลสาวในโลกไซเบอร์แสงนีออนกระพริบ",
    "Glitchcore Outfit": "ชุดสกรีนลายภาพแตกพิกเซลกระตุก",
    "Dreamcore Outfit": "ชุดดรีมคอร์แปลกตาชวนหลอนปนฝัน",
    "Weirdcore Outfit": "ชุดเวียร์ดคอร์ภาพตัดแปะลึกลับชวนสะกด",
    "Fairycore Outfit": "ชุดแฟรี่คอร์ปีกผีเสื้อและกระโปรงมอสส์สีเขียว",
    "Angelcore Outfit": "ชุดแองเจิลคอร์สีขาวประดับขนนกและลูกไม้",
    "Cottagecore Outfit": "ชุดคอทเทจคอร์เดรสกระโปรงยาวลายดอกเดซี่",
    "Royalcore Outfit": "ชุดราชสำนักหรูหราดิ้นทองติดเหรียญกล้าหาญ",
    "Dark Academia Outfit": "ชุดนักศึกษาโทนน้ำตาลเข้มเสื้อสูททวีดกางเกงสแล็ค",
    "Light Academia Outfit": "ชุดนักศึกษาโทนครีมเบจเสื้อกั๊กไหมพรม",
    "Soft Girl Outfit": "ชุดสาวหวานซอฟต์เกิร์ลเสื้อคาร์ดิแกนสีพาสเทล",
    "E-Girl Outfit": "ชุดอีเกิร์ลผมสองสีเสื้อลายทางทับด้วยเสื้อวงดนตรี",
    "E-Boy Outfit": "ชุดอีบอยกางเกงโซ่เสื้อโอเวอร์ไซส์สีดำ",
    "Minimalist Fashion": "แฟชั่นมินิมอลเรียบง่ายแต่ดูแพง",
    "Luxury Fashion": "แฟชั่นแบรนด์เนมไฮเอนด์สุดหรู",
    "Monochrome Outfit": "ชุดคุมโทนขาวดำหัวจรดเท้า",
    "Pastel Fashion": "แฟชั่นสีพาสเทลลูกกวาดหวานละมุน",
    "Neon Fashion": "แฟชั่นสตรีนีออนเรืองแสงในความมืด",
    "Elegant Black Dress": "ชุดราตรีสีดำทรงนางพญา",
    "White Wedding Dress": "ชุดแต่งงานสีขาวบริสุทธิ์ยาวลากพื้น",
    "Funeral Outfit": "ชุดไว้ทุกข์สีดำสุภาพคลุมผ้าโปร่ง",
    "Battle Uniform": "เครื่องแบบทหารพร้อมรบเปื้อนฝุ่นดิน",
    "Torn Clothes": "เสื้อผ้าขาดวิ่นจากการต่อสู้เอาชีวิตรอด",
    "Oversized Shirt": "เสื้อเชิ้ตตัวโคร่งยาวคลุมสะโพก",
    "Long Hoodie": "เสื้อฮู้ดตัวยาวคลุมเข่า",
    "High Collar Coat": "เสื้อโค้ทปกตั้งสูงกันลมหนาว",
    "Cape with Fur": "ผ้าคลุมไหล่ติดขอบขนสัตว์นุ่มนิ่ม",
    "Feathered Cloak": "ผ้าคลุมขนนกเรียงรายพลิ้วไหว",
    "Chain Accessories Outfit": "ชุดประดับโซ่เหล็กรอบเอวและอก",
    "Ribbon Covered Dress": "ชุดเดรสประดับโบว์ริบบิ้นรอบตัว",
    "Flower Crown Dress": "ชุดเดรสสวมมงกุฎดอกไม้บนศีรษะ",
    "Golden Embroidered Outfit": "ชุดปักดิ้นทองคำลวดลายวิจิตร",
    "Silver Armor Dress": "ชุดเดรสเกราะเงินสะท้อนแสงจันทร์",
    "Blood-Stained Outfit": "เสื้อผ้าเปื้อนคราบเลือดจากการต่อสู้",
    "Burned Clothes": "เสื้อผ้ามีรอยไหม้เกรียมจากเปลวเพลิง",
    "Frozen Cloak": "ผ้าคลุมมีเกล็ดน้ำแข็งเกาะหนาแน่น",
    "Wet Clothing Style": "เสื้อผ้าเปียกแนบเนื้อหยดน้ำเกาะพราว",
    "Transparent Raincoat": "เสื้อกันฝนพลาสติกใส",
    "Oversized Kimono": "ชุดกิโมโนตัวใหญ่หลวมโพรกแขนเสื้อยาวลากพื้น",
    "Half Formal Outfit": "ชุดกึ่งทางการสูททับเสื้อยืด",
    "Sleeveless Coat": "เสื้อโค้ทแขนกุดทันสมัย",
    "Layered Robe": "ชุดคลุมผ้าหลายชั้นซ้อนทับแบบจอมยุทธ์",
    "Battle Maid Outfit": "ชุดเมดนักรบติดปลอกแขนเหล็กและพกมีดสั้น",
    "Military Cape": "ผ้าคลุมนายทหารติดดิ้นทองบ่า",
    "Dark Priest Outfit": "ชุดนักบวชสายมืดคลุมฮู้ดดำ",
    "Cyber Ninja Outfit": "ชุดนินจาไซเบอร์หน้ากากไฟ LED",
    "Tech Priest Outfit": "ชุดนักบวชจักรกลติดสายระโยงระยาง",
    "Steampunk Butler Outfit": "ชุดพ่อบ้านสตีมพังก์พกนาฬิกาพกทองเหลือง",
    "Clockwork Maid Outfit": "ชุดเมดจักรกลไขลานหลังมีกุญแจบิด",
    "Royal Butler Outfit": "ชุดพ่อบ้านประจำราชวงศ์อังกฤษถุงมือขาว",
    "Ghost Bride Dress": "ชุดเจ้าสาวผีสิงลูกไม้เก่าขาดลอยตัว",
    "Spider Queen Dress": "ชุดราชินีแมงมุมกระโปรงทรงสุ่มขาแมงมุมแปดขา",
    "Butterfly Princess Dress": "ชุดเจ้าหญิงผีเสื้อปีกบางเบาประกายมุก",
    "Moon Priestess Outfit": "ชุดนักบวชหญิงแห่งดวงจันทร์ถือคทาจันทร์เสี้ยว",
    "Star Traveler Outfit": "ชุดนักเดินทางข้ามดวงดาวสะพายเข็มทิศดาราศาสตร์",
    "Void Cultist Robe": "ชุดคลุมสาวกลัทธิความว่างเปล่าไร้หน้า",
    "Rune Covered Cloak": "ผ้าคลุมสลักอักษรรูนเรืองแสงสีฟ้า",
    "Ancient Relic Armor": "ชุดเกราะโบราณวัตถุผสานศิลาเวท",
    "Mechanical Suit": "สูทจักรกลหุ่นยนต์ควบคุมจากภายใน",
    "Holographic Outfit": "ชุดสะท้อนแสงสีรุ้งโฮโลแกรมล้ำสมัย",
    "AI-Themed Outfit": "ชุดธีมเอไอสายโค้ดโปรแกรมไหลผ่านเนื้อผ้า",
    "Android Uniform": "เครื่องแบบหุ่นยนต์แอนดรอยด์สาวรับใช้",
    "Robot Maid Outfit": "ชุดเมดหุ่นยนต์โลหะขัดเงา",
    "Synthetic Leather Outfit": "ชุดหนังเทียมสังเคราะห์เงาวับ",
    "Combat Bodysuit": "ชุดบอดี้สูทรัดรูปยุทธวิธีสำหรับสายบู๊",
    "Tactical Cloak": "ผ้าคลุมยุทธวิธีกันสะเก็ดระเบิด",
    "Cyber Armor": "ชุดเกราะไซเบอร์พร้อมระบบชี้นำเป้า",
    "Digital Pattern Jacket": "เสื้อแจ็กเก็ตลายดิจิทัลพิกเซลพรางสายตา",
    "Pixel-Themed Hoodie": "เสื้อฮู้ดลายกราฟิก 8-บิตยุคเกมเก่า",
    "Arcane Robe": "ชุดคลุมเวทมนตร์โบราณอาคมขลัง",
    "Rune Armor": "ชุดเกราะสลักอักษรรูนป้องกันมนตร์ดำ",
    "Magic Academy Uniform": "ชุดเครื่องแบบนักเรียนโรงเรียนเวทมนตร์",
    "Alchemy Uniform": "ชุดทำงานนักเล่นแร่แปรธาตุพกถุงสมุนไพร",
    "Fantasy School Outfit": "ชุดนักเรียนโรงเรียนแฟนตาซีผูกเนกไทสีประจำบ้าน",
    "Demon General Armor": "ชุดเกราะแม่ทัพปีศาจมีเขาและหนามแหลม",
    "Heavenly Robe": "ชุดสวรรค์ผ้าทอเทวดาพลิ้วไหวดั่งสายลม",
    "Corrupted Priest Outfit": "ชุดนักบวชนอกรีตแปดเปื้อนความมืด",
    "Elegant Vampire Outfit": "ชุดลอร์ดแวมไพร์ชั้นสูงสูทดำผูกผ้าพันคอผ้าไหมแดง",
    "Blood Moon Dress": "ชุดเดรสพระจันทร์สีเลือดสีแดงชาด",
    "Festival Streetwear": "ชุดสตรีทแวร์เทศกาลญี่ปุ่นลายปลาคาร์ป",
    "Luxury Kimono": "ชุดกิโมโนผ้าไหมทอมือปักทองคำแท้",
    "Ancient Chinese Robe": "ชุดจีนโบราณฮั่นฝูชายเสื้อกว้างพลิ้ว",
    "Ancient Japanese Outfit": "ชุดญี่ปุ่นยุคเฮอันผ้าหลายชั้น",
    "Ancient Greek Toga": "ชุดโทกากรีกโบราณคาดไหล่สีขาวทอง",
    "Ancient Egyptian Outfit": "ชุดอียิปต์โบราณสร้อยคอทองคำประดับหินลาพิส",
    "Temple Guardian Armor": "ชุดเกราะผู้พิทักษ์วิหารศักดิ์สิทธิ์",
    "Sacred Shrine Outfit": "ชุดประกอบพิธีศาลเจ้าอันศักดิ์สิทธิ์",
    "Knight Commander Armor": "ชุดเกราะผู้บัญชาการกองอัศวินผ้าคลุมสีน้ำเงินเข้ม",
    "Pirate Captain Coat": "เสื้อโค้ทกัปตันโจรสลัดมีอินทรธนูทอง",
    "Forest Witch Dress": "ชุดแม่มดป่าเดรสเขียวเข้มประดับสมุนไพรแห้ง",
    "Desert Nomad Outfit": "ชุดคนพเนจรแห่งทะเลทรายผ้าโพกหัวกันแดด",
    "Snow Hunter Outfit": "ชุดพรานล่าสัตว์หิมะบุนวมหนา",
    "Deep Sea Outfit": "ชุดสำรวจใต้ทะเลลึกหมวกทองเหลืองมีสายออกซิเจน",
    "Bioluminescent Dress": "ชุดเดรสเรืองแสงสีฟ้าครามใต้ทะเล",
    "Toxic Scientist Outfit": "ชุดนักวิทยาศาสตร์ทดลองสารพิษสวมหน้ากากกันแก๊ส",
    "Radioactive Hazard Suit": "ชุดป้องกันรังสีสารเคมีสีเหลืองสด",
    "Shadow Assassin Outfit": "ชุดนักฆ่าเงาสีดำสนิทไร้เงาสะท้อน",
    "Light Guardian Outfit": "ชุดผู้พิทักษ์แสงสว่างชุดเกราะสีขาวทอง",
    "Chaos Cultist Outfit": "ชุดคลุมสาวกลัทธิความโกลาหลมีสัญลักษณ์ดวงตา",
    "Dream Walker Outfit": "ชุดผู้ท่องนิทราผืนผ้าลวดลายเมฆหมอก",
    "Nightmare Cloak": "ผ้าคลุมฝันร้ายมีหนวดเงามืดเลื้อยพัน",
    "Lace Dress": "ชุดเดรสผ้าลูกไม้ถักทอประณีต",
    "Ribbon Outfit": "ชุดประดับริบบิ้นผูกโบว์น่ารัก",
    "Pearl Decorated Dress": "ชุดเดรสปักเม็ดไข่มุกระยิบระยับ",
    "Crystal Decorated Outfit": "ชุดประดับผลึกแก้วคริสตัลต้องแสง",
    "Gold Trimmed Robe": "ชุดคลุมขลิบทองคำแท้ตามชายผ้า",
    "Silver Thread Kimono": "ชุดกิโมโนทอดิ้นเงินส่องประกายยามค่ำคืน",
    "Ink Splattered Outfit": "ชุดเปื้อนรอยหยดหมึกพู่กันจีนดั่งภาพวาด",
    "Paint Covered Overalls": "ชุดเอี๊ยมยีนส์เปื้อนรอยสาดสีศิลปะ",
    "Musician Streetwear": "ชุดนักดนตรีข้างถนนสะพายกล่องกีตาร์",
    "Elegant Concert Suit": "ชุดสูทนักดนตรีออร์เคสตราสุดหรู",
    "Theater Costume": "ชุดนักแสดงละครเวทีสไตล์ยุคกลาง",
    "Opera Mask Outfit": "ชุดแฟนซีหน้ากากโอเปร่าสีทองครึ่งหน้า",
    "Magic Performer Outfit": "ชุดนักแสดงกลมายาบนเวทีใหญ่",
    "Doll-Like Outfit": "ชุดเดรสสไตล์ตุ๊กตาโบราณมีระบายรอบคอ",
    "Puppet Master Outfit": "ชุดผู้เชิดหุ่นนิ้วสวมปลอกเชือกชักใย",
    "Spirit Cloak": "ผ้าคลุมโปร่งแสงดั่งไอหมอกวิญญาณ",
    "Soul-Themed Outfit": "ชุดธีมดวงวิญญาณมีลูกไฟวิญญาณลอยรอบตัว",
    "Moonlit Kimono": "ชุดกิโมโนต้องแสงจันทร์สีเงินนวลตา",
    "Starry Night Cloak": "ผ้าคลุมท้องฟ้าราตรีประดับดาวพร่างพราย",
    "Cloud Hoodie": "เสื้อฮู้ดปุยเมฆสีขาวฟ้าสัมผัสนุ่ม",
    "Rainy Day Outfit": "ชุดวันฝนพรำเสื้อกันฝนบูทยางร่มใส",
    "Sunflower Dress": "ชุดเดรสสีเหลืองสดใสลายดอกทานตะวัน",
    "Rose-Themed Outfit": "ชุดธีมดอกกุหลาบแดงหนามแหลมคม",
    "Spider Lily Kimono": "ชุดกิโมโนสีดำลายดอกพลับพลึงแดงแห่งความตาย",
    "Lotus Priest Outfit": "ชุดนักบวชลายดอกบัวขาวบริสุทธิ์",
    "Sakura Dress": "ชุดเดรสสีชมพูหวานลายกลีบดอกซากุระร่วงโรย",
    "Bamboo Pattern Kimono": "ชุดกิโมโนสีเขียวลายปล้องไผ่สง่างาม",
    "Fox Spirit Outfit": "ชุดจิ้งจอกเก้าหางผ้าคลุมขนสัตว์สีขาวส้ม",
    "Crow-Themed Outfit": "ชุดธีมนกกาปีกขนนกสีดำขลับ",
    "Snake Pattern Outfit": "ชุดลายเกล็ดงูเหลือบแสงสีมรกต",
    "Tiger Fur Coat": "เสื้อโค้ทลายเสือโคร่งพาดกลอนทรงพลัง",
    "Rabbit Pajamas": "ชุดนอนกระต่ายมีหูกระต่ายและหางปอมปอม",
    "Koi-Themed Kimono": "ชุดกิโมโนลายปลาคาร์ปแหวกว่ายสายน้ำวน",
    "Jellyfish Dress": "ชุดเดรสแมงกะพรุนชายกระโปรงเรืองแสงสีฟ้า",
    "Shark Streetwear": "ชุดสตรีทแวร์ฉลามลายฟันฉลามขาวเท่ๆ",
    "Dragon Robe": "ชุดคลุมจักรพรรดิลายมังกรทองห้าเล็บ",
    "Phoenix Armor": "ชุดเกราะปีกวิหคเพลิงส่องแสงสว่างไสว",
    "Butterfly Sleeves": "ชุดแขนเสื้อทรงปีกผีเสื้อสะบัดพลิ้ว",
    "Cat Butler Outfit": "ชุดพ่อบ้านหูแมวและหางเรียวยาว",
    "Wolf Hunter Outfit": "ชุดนายพรานล่าหมาป่าสะพายคันธนูใหญ่",
    "Deer Spirit Outfit": "ชุดวิญญาณกวางป่าประดับเขากวางผลิดอกไม้",
    "Bat Collar Coat": "เสื้อโค้ทปกตั้งทรงปีกค้างคาวสีดำสนิท",
    "Scorpion Armor": "ชุดเกราะหางแมงป่องติดเหล็กในพิษ",
    "Moth-Themed Cloak": "ผ้าคลุมลายปีกผีเสื้อกลางคืนนุ่มนวล",
    "Frog Raincoat": "เสื้อกันฝนกบสีเขียวมีตากลมโตบนฮู้ด",
    "Axolotl Hoodie": "เสื้อฮู้ดแอกโซลอเติลสีชมพูมีเหงือกพู่",
    "Whale Ocean Robe": "ชุดคลุมวาฬสีน้ำเงินครามลายคลื่นทะเล",
    "Octopus Streetwear": "ชุดสตรีทแวร์ปลาหมึกลายหนวดหมึกพันแขน",
    "Mechanical Wings Outfit": "ชุดติดปีกจักรกลเหล็กกล้ากางออกได้",
    "Halo Dress": "ชุดเดรสประดับวงแหวนแสงลอยเหนือศีรษะ",
    "Broken Crown Outfit": "ชุดเจ้าชายผู้ตกอับสวมมงกุฎหักครึ่ง",
    "Chain Bound Cloak": "ผ้าคลุมล่ามด้วยโซ่ตรวนเหล็กหนา",
    "Floating Sleeve Dress": "ชุดเดรสแขนเสื้อลอยอิสระไม่ติดลำตัว",
    "Bandage Wrapped Outfit": "ชุดพันผ้าพันแผลรอบตัวมัมมี่ร่วมสมัย",
    "Cracked Armor": "ชุดเกราะรอยแตกร้าวเรืองแสงเวทมนตร์ภายใน",
    "Void-Touched Robe": "ชุดคลุมต้องมนตร์มิติมืดขอบผ้าสลายเป็นควัน",
    "Astral Traveler Outfit": "ชุดนักท่องดวงดาวแผนผังจักราบนเนื้อผ้า",
    "Comet-Themed Cloak": "ผ้าคลุมดาวหางหางแสงสีฟ้ายาวเหยียด",
    "Meteor Armor": "ชุดเกราะแร่หินอุกกาบาตทนความร้อนสูง",
    "Celestial Uniform": "เครื่องแบบกองทหารสวรรค์สีขาวดิ้นทอง",
    "Dreamy Pajamas": "ชุดนอนผ้าแพรลายดาวและพระจันทร์เสี้ยว",
    "Soft Winter Fashion": "แฟชั่นหน้าหนาวขนฟูนุ่มผ้าพันคอผืนใหญ่",
    "Heavy Military Coat": "เสื้อโค้ททหารนายพลตัวหนักบุขนแกะ",
    "Elegant Ballroom Dress": "ชุดราตรีเต้นรำในห้องโถงใหญ่กระโปรงสุ่มบาน",
    "Fantasy Prince Outfit": "ชุดเจ้าชายแฟนตาซีสะพายดาบประจำตระกูล",
    "Fantasy Princess Dress": "ชุดเจ้าหญิงแฟนตาซีผ้าไหมบางเบาหลายชั้น",
    "Black Wedding Suit": "ชุดแต่งงานสูทสีดำสนิทลึกลับ",
    "White Funeral Dress": "ชุดไว้ทุกข์สีขาวบริสุทธิ์แบบธรรมเนียมตะวันออก",
    "Corrupted Royal Outfit": "ชุดเชื้อพระวงศ์แปดเปื้อนมนตร์ดำเถาวัลย์หนามเกาะ",
    "Ancient Mage Outfit": "ชุดจอมเวทบรรพกาลไม้เท้าหัวกะโหลก",
    "Runic Cloak": "ผ้าคลุมทอจากด้ายอาคมอักษรรูน",
    "Storm Rider Coat": "เสื้อโค้ทผู้ขับขี่พายุสายฟ้าผ้ากันลมหนา",
    "Thunder Warrior Armor": "ชุดเกราะนักรบอสุนีบาตประกายไฟแลบ",
    "Lava Resistant Suit": "ชุดทนความร้อนลาวาภูเขาไฟสีดำส้ม",
    "Ice Queen Dress": "ชุดราชินีหิมะผลึกน้ำแข็งประกายแสงสีฟ้า",
    "Ocean Prince Outfit": "ชุดเจ้าชายใต้สมุทรเสื้อกั๊กเกล็ดปลาคราม",
    "Forest Guardian Cloak": "ผ้าคลุมผู้พิทักษ์ไพรสณฑ์ใบไม้สีมรกต",
    "Desert King Robe": "ชุดคลุมราชันย์แห่งทะเลทรายทอดิ้นทองคำ",
    "Galaxy Explorer Suit": "ชุดสำรวจดาราจักรอุปกรณ์วัดพิกัดดาว",
    "Space Pirate Outfit": "ชุดโจรสลัดอวกาศเสื้อโค้ทหนังติดไอพ่นหลัง",
    "Cyber Idol Outfit": "ชุดไอดอลสาวไซเบอร์กระโปรงเรืองแสงตามจังหวะเพลง",
    "Digital Witch Outfit": "ชุดแม่มดดิจิทัลถือไม้กายสิทธิ์หัว USB",
    "Virtual Performer Outfit": "ชุดนักร้องเวอร์ชวลโฮโลแกรมส่องสว่าง",
    "Mechanical Knight Armor": "ชุดเกราะอัศวินไฮดรอลิกพลังไอน้ำ",
    "Steam Engineer Outfit": "ชุดวิศวกรเครื่องจักรไอน้ำเข็มขัดเครื่องมือช่าง",
    "Clock Tower Butler Outfit": "ชุดพ่อบ้านหอนาฬิกาพกเฟืองทองเหลือง",
    "Elegant Gothic Suit": "ชุดสูทกอธิคผ้ากำมะหยี่สีดำขลิบเงิน",
    "Pastel Idol Outfit": "ชุดไอดอลสีพาสเทลสายไหมหวานจับใจ",
    "Neon Punk Outfit": "ชุดพังก์นีออนกางเกงขาดสายรัดสะท้อนแสง",
    "Dark Royal Dress": "ชุดเดรสราชวงศ์สายมืดสีกรมท่าดำแซฟไฟร์",
    "Soft Angel Outfit": "ชุดนางฟ้าตัวน้อยปีกขนนกสีขาวฟู",
    "Cute Demon Hoodie": "เสื้อฮู้ดปีศาจน้อยมีเขาน่ารักและหางลูกศร",
    "Street Samurai Outfit": "ชุดซามูไรสตรีทกางเกงฮากามะกับรองเท้าสนีกเกอร์",
    "Arcade Gamer Hoodie": "เสื้อฮู้ดเด็กติดเกมลายปุ่มตู้เกมอาเขต",
    "Pixel Art Jacket": "แจ็กเก็ตลายพิกเซลอาร์ตสีสดใส",
    "Retro Bomber Jacket": "เสื้อแจ็กเก็ตบอมเบอร์ย้อนยุคสีทูโทน",
    "Luxury Fur Cape": "ผ้าคลุมขนมิ้งค์สุดหรูระดับไฮโซ",
    "Futuristic School Uniform": "ชุดนักเรียนยุคอนาคตปกคอมีจอแสดงสถานะ",
    "Magical Girl Outfit": "ชุดสาวน้อยเวทมนตร์ติดโบว์ใหญ่คทาวิเศษ",
    "Dark Magical Girl Outfit": "ชุดสาวน้อยเวทมนตร์สายดาร์กสีดำแดงกระโปรงแหลม",
    "Moon Guardian Dress": "ชุดเดรสผู้พิทักษ์จันทราสีเงินประกาย",
    "Sun Warrior Armor": "ชุดเกราะนักรบสุริยาเปล่งรังสีสีทองอบอุ่น",
    "Star Idol Costume": "ชุดไอดอลธีมดวงดาวมีดาวประกายที่กระโปรง",
    "Cloud Traveler Cloak": "ผ้าคลุมนักเดินทางเมฆาเบาสบายดั่งสายลม",
    "Dreamcore Sweater": "เสื้อสเวตเตอร์ดรีมคอร์ลวดลายสับสนในความฝัน",
    "Fairytale Dress": "ชุดเดรสเทพนิยายแอปเปิ้ลอาบยาพิษและรองเท้าแก้ว",
    "Ghostly Kimono": "ชุดกิโมโนผีสาวสีขาวชายผ้าลอยละล่อง",
    "Haunted Bride Dress": "ชุดเจ้าสาวบ้านผีสิงผ้าลูกไม้เก่าขาดวิ่น",
    "Vampire Ballroom Outfit": "ชุดเต้นรำงานบอลล์แวมไพร์ทักซิโด้คอพับสูง",
    "Royal Vampire Cape": "ผ้าคลุมแวมไพร์ราชวงศ์กำมะหยี่แดงเข้มชายทอง",
    "Zombie Survivor Hoodie": "เสื้อฮู้ดผู้รอดชีวิตซอมบี้เปื้อนฝุ่นและเลือดแห้ง",
    "Wasteland Armor": "ชุดเกราะเศษเหล็กแดนรกร้างปักหมุด",
    "Scavenger Streetwear": "ชุดสตรีทแวร์นักคุ้ยขยะสะสมอะไหล่หายาก",
    "Broken Uniform": "เครื่องแบบชำรุดขาดรุ่งริ่งผ่านศึกหนัก",
    "Overdecorated Royal Outfit": "ชุดราชวงศ์ประดับเหรียญตราและสายสะพายจนแน่นตัว",
    "Minimal White Outfit": "ชุดขาวล้วนมินิมอลสะอาดตาทันสมัย",
    "Elegant Monochrome Suit": "ชุดสูทโมโนโครมขาวดำเล่นระดับชั้นยอด",
    "All Black Fashion": "แฟชั่นสีดำล้วนเท่ดิบตั้งแต่หัวจรดเท้า",
    "All White Fashion": "แฟชั่นสีขาวล้วนสะอาดบริสุทธิ์ดั่งหิมะแรก",
    "Pastel Rainbow Outfit": "ชุดสีรุ้งพาสเทลหวานละมุนละไม",
    "Silver Cyber Suit": "ชุดไซเบอร์สูทเคลือบโลหะเงินสะท้อนแสงไฟ",
    "Golden Royal Armor": "ชุดเกราะทองคำราชันย์เปล่งประกายเจิดจรัส",
    "Black & Red Gothic Outfit": "ชุดกอธิคโทนดำแดงเลือดนกสุดลึกลับ",
    "Blue & Gold Royal Dress": "ชุดเดรสราชวงศ์โทนน้ำเงินรอยัลบลูขลิบทองคำ",
    "Pink Idol Fashion": "แฟชั่นไอดอลสาวสีชมพูหวานสดใสจับตา",
    "Purple Witch Dress": "ชุดเดรสแม่มดสีม่วงเข้มหมวกประดับขนนกฮูก",
    "Green Forest Cloak": "ผ้าคลุมสีเขียวใบไม้กลมกลืนกับพงไพร",
    "Orange Festival Outfit": "ชุดเทศกาลสีส้มสดใสลายดอกไม้ไฟ",
    "Red Shrine Outfit": "ชุดศาลเจ้าสีแดงสดเข็มขัดเชือกถักขาว",
    "White Priest Robe": "ชุดนักบวชสีขาวบริสุทธิ์ปักไม้กางเขนสีเงิน",
    "Dark Cultist Cloak": "ชุดคลุมสาวกลัทธิมืดฮู้ดลึกปิดบังใบหน้า",
    "Holy Knight Armor": "ชุดเกราะอัศวินศักดิ์สิทธิ์สลักตรากางเขน",
    "Fantasy Adventurer Outfit": "ชุดนักผจญภัยแฟนตาซีพกกระเป๋ายาและดาบคาดเอว",
    "Traveler Streetwear": "ชุดสตรีทแวร์นักเดินทางคล่องตัวพร้อมลุย",
    "Elegant Casual Outfit": "ชุดลำลองกึ่งทางการใส่สบายแต่ดูดีมีคลาส",
    "Soft Cottagecore Dress": "ชุดเดรสคอทเทจคอร์ผ้าลินินสีครีมอบอุ่น",
    "Cute Layered Fashion": "แฟชั่นหลายชั้นสุดน่ารักเสื้อสเวตเตอร์ทับเชิ้ต",
    "Oversized Fashion": "แฟชั่นโอเวอร์ไซส์ตัวโคร่งใส่สบายมีสไตล์",
    "Tight Bodysuit": "ชุดบอดี้สูทรัดรูปกระชับทุกสัดส่วน",
    "Elegant Sleeveless Dress": "ชุดเดรสแขนกุดคัตติ้งเนี้ยบเผยไหล่เนียน",
    "One-Eyed Mask Outfit": "ชุดสวมหน้ากากปิดตาข้างเดียวลึกลับ",
    "Mechanical Tailcoat": "เสื้อทักซิโด้หางเต่าติดกลไกเฟืองเหล็ก",
    "Chainmail Dress": "ชุดเดรสถักจากห่วงโซ่เหล็กกล้า",
    "Fantasy Butler Outfit": "ชุดพ่อบ้านแฟนตาซีพร้อมรบถุงมือขาวพกมีดบิน",
    "Rose Thorn Cloak": "ผ้าคลุมเถาวัลย์หนามกุหลาบแดงอันตราย",
    "Poison Queen Dress": "ชุดเดรสนางพญาพิษร้ายสีเขียวมรกตเหลือบม่วง",
    "Deep Ocean Cloak": "ผ้าคลุมมหาสมุทรลึกสีน้ำเงินหมึกเข้ม",
    "Frost Covered Outfit": "เสื้อผ้ามีผลึกน้ำแข็งเกาะพราวทั่วตัว",
    "Burning Flame Robe": "ชุดคลุมเปลวเพลิงลุกโชนชายผ้าเป็นประกายไฟ",
    "Thunder God Armor": "ชุดเกราะเทพเจ้าสายฟ้าติดวงล้ออสุนีบาตหลัง",
    "Ancient Dragon Robe": "ชุดคลุมมังกรดึกดำบรรพ์ปักไหมทองคำแท้",
    "Celestial Priest Outfit": "ชุดนักบวชดาราศาสตร์หมวกทรงสูงปักลายกลุ่มดาว",
    "Void King Outfit": "ชุดราชันย์แห่งความว่างเปล่ามงกุฎควันดำทมิฬ",
    "Dream Eater Cloak": "ผ้าคลุมบาคุกลืนกินฝันร้ายลวดลายละอองควัน",
    "Night Sky Dress": "ชุดเดรสท้องฟ้ายามราตรีระยับด้วยทางช้างเผือก",
    "Galaxy Printed Hoodie": "เสื้อฮู้ดพิมพ์ลายดาราจักรกาแล็กซีสีสันสดใส",
    "Moon & Stars Kimono": "ชุดกิโมโนลายพระจันทร์และดวงดาวระยิบระยับ",
    "Crow Feather Jacket": "แจ็กเก็ตประดับขนนกกาเงาวาวสีดำม่วง",
    "Fox Spirit Kimono": "ชุดกิโมโนนางจิ้งจอกเก้าหางผ้าคาดเอวสีแดงชาด",
    "Wolf Fur Armor": "ชุดเกราะหนังบุขนหมาป่าสีเทาเงิน",
    "Butterfly Fairy Dress": "ชุดเดรสนางฟ้าปีกผีเสื้อโปร่งแสงระยิบระยับ",


    // Smart Mode Additional Words
    "Neon Cyan": "ฟ้าไซแอนนีออนเรืองแสง",
    "Deep Teal": "เขียวนกเป็ดน้ำเข้มลึก",
    "Earth Brown": "น้ำตาลเอิร์ธโทน (สีดินธรรมชาติ)",
    "Neon Orange": "ส้มนีออนสะท้อนแสง",
    "Sepia": "ซีเปีย (น้ำตาลคลาสสิกย้อนยุค)",
    "Ink Black": "ดำหมึกจีน",
    "Monochrome": "โมโนโครม (ขาวดำเทา)",
    "Rust Brown": "น้ำตาลสนิมเหล็ก",
    "Steel Gray": "เทาเหล็กกล้า",
    "Lapis Blue": "น้ำเงินลาพิสลาซูลี (อัญมณีสีน้ำเงินเข้ม)",
    "Jade Green": "เขียวหยกมงคล",
    "Dark Crimson": "แดงเข้มคริมสัน",
    "Bioluminescent Cyan": "ฟ้าไซแอนเรืองแสงใต้ทะเล",
    "Void Black": "ดำสนิทมืดมิด (สีหลุมดำ)",
    "Toxic Green": "เขียวสารพิษเรืองแสง",
    "Pastel Purple": "ม่วงพาสเทลละมุน",
    "Soft Green": "เขียวอ่อนนุ่มนวล",
    "Sage Green": "เขียวเซจ (เขียวใบเสจเอิร์ธโทน)",
    "Warm Cream": "ครีมอบอุ่น (สีครีมโทนอุ่นละมุน)",
    "Soft Brown": "น้ำตาลอ่อนนุ่มนวล",
    "Pastel Yellow": "เหลืองพาสเทลอ่อน",
    "Soft Yellow": "เหลืองอ่อนละมุนตา",
    "Flame Orange": "ส้มเปลวไฟร้อนแรง",
    "High-vis Yellow": "เหลืองสะท้อนแสงนิรภัย",
    "Champagne": "แชมเปญ (สีทองนวลประกาย)",
    "Burgundy": "แดงเบอร์กันดี (แดงไวน์องุ่นเข้ม)",
    "Serene": "สงบนิ่งเยือกเย็น (สุขุมผ่อนคลาย)",
    "Disciplined": "มีวินัยเคร่งครัด",
    "Tech-Savvy": "เชี่ยวชาญเทคโนโลยี",
    "Cool": "เท่สุขุม (มาดนิ่งดูดี)",
    "Resourceful": "หัวไวเอาตัวรอดเก่ง (แก้ปัญหาเก่ง)",
    "Whimsical": "เพ้อฝันแปลกตา (จินตนาการไม่ซ้ำใคร)",
    "Noble": "สูงศักดิ์สง่างาม (มีเกียรติ)",
    "Mystic": "เวทมนตร์เร้นลับ (ความลี้ลับเหนือธรรมชาติ)",
    "Free-Spirited": "รักอิสระเสรี (ไม่ยึดติดกฎเกณฑ์)",
    "Proud": "ภาคภูมิใจทะนงตน",
    "Dignified": "สง่าผ่าเผยน่าเกรงขาม",
    "Majestic": "ยิ่งใหญ่อลังการ (สง่างามดั่งราชัน)",
    "Ambitious": "ทะเยอทะยานมุ่งมั่น",
    "Peaceful": "รักสงบเปี่ยมสุข",
    "Nurturing": "อบอุ่นชอบดูแล (ใส่ใจผู้อื่น)",
    "Outgoing": "เข้าสังคมเก่ง (เปิดเผยเป็นมิตร)",
    "Lively": "มีชีวิตชีวาร่าเริง",
    "Enigmatic": "ลึกลับชวนสงสัย (อ่านใจยาก)",
    "Brooding": "ครุ่นคิดเงียบขรึม (มีปมในใจ)",
    "Observant": "ช่างสังเกตละเอียดรอบคอบ",
    "Solitary": "รักสันโดษชอบอยู่คนเดียว",
    "Philosophical": "ช่างคิดเชิงปรัชญา (มองโลกอย่างลึกซึ้ง)",
    "Nostalgic": "คิดถึงวันวาน (ชอบบรรยากาศย้อนยุค)",
    "Sophisticated": "มีรสนิยมล้ำลึก (ภูมิฐานสง่างาม)",
    "Inventive": "ช่างประดิษฐ์สร้างสรรค์",
    "Eccentric": "แปลกหลุดโลก (มีเอกลักษณ์เฉพาะตัว)",
    "Determined": "เด็ดเดี่ยวมุ่งมั่นไม่ยอมแพ้",
    "Bold": "กล้าหาญเด็ดขาด",
    "Sly": "เจ้าเล่ห์ฉลาดแกมโกง",
    "Ancient": "สุขุมดั่งผู้ผ่านกาลเวลา",
    "Trendy": "อินเทรนด์ทันสมัย (รักแฟชั่น)",
    "Pure": "บริสุทธิ์ผุดผ่อง (ไร้เดียงสา)",
    "Compassionate": "เปี่ยมความเมตตากรุณา",
    "Melancholy": "หม่นหมองเศร้าสร้อย (เสน่ห์ความเหงา)",
    "Ethereal": "งดงามดั่งภาพฝัน (ราวกับหลุดมาจากสวรรค์)",
    "Sorrowful": "โศกเศร้าอาลัย",
    "Resilient": "ทรหดอดทนล้มแล้วลุกไว",
    "Pragmatic": "มองความจริงเน้นปฏิบัติ (ไม่เพ้อฝัน)",
    "Tough": "แข็งแกร่งทรหด",
    "Cautious": "ระแวดระวังรอบคอบ",
    "Logical": "เน้นตรรกะและเหตุผล",
    "Analytical": "ช่างวิเคราะห์เจาะลึก",
    "Focused": "มีสมาธิตั้งมั่นแน่วแน่",
    "Honorable": "มีเกียรติยึดมั่นสัจจะ",
    "Chivalrous": "สุภาพบุรุษดั่งอัศวิน",
    "Stalwart": "หนักแน่นซื่อสัตย์ดั่งหินผา",
    "Proper": "มีกิริยามารยาทเรียบร้อยถูกระเบียบ",
    "Grim": "เคร่งขรึมจริงจัง",
    "Bright": "สดใสร่าเริงเปี่ยมพลังบวก",
    "Powerful": "ทรงพลังน่าเกรงขาม",
    "Artistic": "มีอารมณ์ศิลปินสร้างสรรค์",
    "Poetic": "อ่อนหวานดั่งบทกวี",
    "Fierce": "ดุดันเด็ดเดี่ยวไม่เกรงกลัว",
    "Stealthy": "เร้นลับไร้ร่องรอยดั่งเงา",
    "Daring": "กล้าได้กล้าเสียชอบความท้าทาย",
    "Charismatic": "มีเสน่ห์ดึงดูดใจดั่งผู้นำ",
    "Agile": "ว่องไวปราดเปรียว",
    "Intuitive": "สัญชาตญาณแม่นยำ",
    "Soft-spoken": "พูดจานุ่มนวลสุภาพ",
    "Unfathomable": "หยั่งไม่ถึงลึกล้ำสุดคาดเดา",
    "Clever": "ฉลาดหลักแหลมไหวพริบดี",
    "Sweet": "อ่อนหวานน่ารัก",
    "Nature-Loving": "รักธรรมชาติและต้นไม้ใบหญ้า",
    "Warm": "อบอุ่นเป็นมิตร",
    "Simple": "เรียบง่ายสมถะไม่ปรุงแต่ง",
    "Soft-hearted": "ใจอ่อนขี้สงสาร",
    "Fiery": "เร่าร้อนกระตือรือร้นดั่งไฟ",
    "Commanding": "มีอำนาจสั่งการดั่งแม่ทัพ",
    "Practical": "เน้นใช้งานได้จริงไม่เรื่องมาก",
    "Calculated": "คิดคำนวณมาอย่างดี",
    "Outspoken": "ตรงไปตรงมากล้าพูดความจริง",
    "Glamorous": "หรูหราเจิดจรัสสะกดสายตา",
    "Studious": "รักการเรียนรู้ใฝ่ศึกษา",
    "Enthusiastic": "กระตือรือร้นไฟแรง",
    "Seahorse": "ม้าน้ำ",
    "Throne": "บัลลังก์กษัตริย์",
    "Flower Vase": "แจกันดอกไม้",
    "Confetti": "เศษกระดาษสายรุ้งงานฉลอง",
    "Blood Stain": "รอยคราบเลือดลึกลับ",
    "Old Photo": "ภาพถ่ายเก่าโบราณ",
    "Steam Pipe": "ท่อไอน้ำแรงดันสูง",
    "Halo": "วงแหวนเทวดาเรืองแสง",
    "White Feather": "ขนนกสีขาวบริสุทธิ์",
    "Fairy Light": "ดวงไฟภูติน้อยกะพริบวิบวับ",
    "Flower Crown": "มงกุฎดอกไม้ป่า",
    "Gas Mask": "หน้ากากกันแก๊สพิษ",
    "Broken Mask": "หน้ากากแตกร้าวปริศนา",
    "Scrap Metal": "เศษโลหะดัดแปลง",
    "Laser Gun": "ปืนเลเซอร์แห่งอนาคต",
    "Relic": "วัตถุโบราณศักดิ์สิทธิ์",
    "Scarab": "แมลงสคารับทองคำอียิปต์",
    "Golden Mask": "หน้ากากทองคำฟาโรห์",
    "Laurel Crown": "มงกุฎใบมะกอกเกียรติยศ",
    "Column Fragment": "เศษเสาหินกรีกโบราณ",
    "Banner": "ธงศึกประจำตระกูล",
    "Smoke Bomb": "ระเบิดควันนินจา",
    "Chip": "ไมโครชิปไซเบอร์",
    "Cigarette": "มวนบุหรี่ควันลอยฟุ้ง",
    "Magnifying Glass": "แว่นขยายนักสืบ",
    "Radar": "จอเรดาร์ตรวจจับสัญญาณ",
    "Camel Figurine": "ตุ๊กตาอูฐทะเลทราย",
    "Sand Bottle": "ขวดทรายแก้วเวทมนตร์",
    "Ancient Relic": "โบราณวัตถุเร้นลับ",
    "Snake Idol": "รูปสลักงูโบราณ",
    "Leaf": "ใบไม้มงคล",
    "Sea Shell": "เปลือกหอยใต้ทะเลลึก",
    "Fish Tank": "ตู้ปลาเรืองแสง",
    "Tentacle Relic": "ซากหนวดอสูรโบราณ",
    "Ancient Book": "ตำราโบราณบันทึกเวท",
    "Magic Book": "คัมภีร์เวทมนตร์เรืองแสง",
    "Castle Key": "กุญแจปราสาทโบราณ",
    "Eye Photo": "ภาพถ่ายดวงตาเร้นลับ",
    "Black Hole": "หลุมดำจำลองขนาดพกพา",
    "Shadow Orb": "ลูกแก้วเงาแห่งความมืด",
    "Basket": "ตะกร้าสานสไตล์ชนบท",
    "Tea Cup": "ถ้วยชาเซรามิกโบราณ",
    "Light Orb": "ลูกแก้วแสงสว่างบริสุทธิ์",
    "Red Flame": "เปลวไฟสีแดงลุกโชน",
    "Dress": "ชุดกระโปรงตุ๊กตา",
    "Old TV": "โทรทัศน์โบราณจอแก้ว",
    "Tape": "ม้วนเทปบันทึกเสียงวินเทจ",
    "Arcade Machine": "ตู้เกมอาเขตมินิ",
    "VHS Tape": "ม้วนวิดีโอเทปคลาสสิก",
    "Flip Phone": "โทรศัพท์มือถือฝาพับยุค 2000s",
    "Glitter Bag": "กระเป๋ากลิตเตอร์ระยิบระยับ",
    "Utility Bag": "กระเป๋าอเนกประสงค์หน่วยรบ",
    "Graffiti Spray": "กระป๋องสีสเปรย์กราฟฟิตี้",
    "Broken Guitar": "กีตาร์พังก์หักสายขาด",
    "Smoked Glass": "แว่นตาดำกันรังสี",
    "Black Rose": "ดอกกุหลาบสีดำต้องสาป",
    "Cute Plush": "ตุ๊กตาผ้าขนนุ่มน่ารัก",
    "Black White Photo": "ภาพถ่ายขาวดำย้อนยุค",
    "Diamond Ring": "แหวนเพชรเม็ดงาม",
    "Gold Watch": "นาฬิกาทองคำฝังเพชร",
    "Prism": "แท่งแก้วปริซึมแยกแสงสีรุ้ง",
    "Script": "บทละครเวทีโบราณ",
    "Light Stick": "แท่งไฟคอนเสิร์ตไอดอล",
    "Flask": "ขวดแก้วเล่นแร่แปรธาตุ",
    "Bone Staff": "คทากระดูกเนโครแมนเซอร์",
    "Fire Flame": "ลูกไฟมนตราลอยล่อง",
    "Spirit Charm": "ยันต์วิญญาณคุ้มภัย",
    "Sea Bottle": "ขวดแก้วบรรจุผืนทะเลจำลอง",
    "Glow Orb": "ลูกแก้วเรืองแสงไบโอ",
    "Poison Bottle": "ขวดยาพิษสีม่วงเข้ม",
    "Green Liquid": "สารเคมีเรืองแสงสีเขียว",
    "Glowing Crystal": "ผลึกคริสตัลส่องสว่าง",
    "Warning Sign": "ป้ายเตือนกัมมันตรังสี",
    "Robot Part": "ชิ้นส่วนแขนกลหุ่นยนต์",
    "Clock Gear": "ฟันเฟืองนาฬิกาไขลาน",
    "Broken Monitor": "จอภาพคอมพิวเตอร์แตกกระตุก",
    "Game Controller": "จอยคอนโทรลเลอร์เกมคลาสสิก",
    "Coffin Key": "กุญแจโลงศพโบราณ",
    "Blood Bottle": "ขวดบรรจุโลหิตแวมไพร์",
    "Broken Mirror": "กระจกเงาแตกร้าวต้องสาป",
    "Door Key": "ลูกกุญแจห้องแห่งความลับ",
    "Techwear Outfit": "ชุดเทควาร์ไซเบอร์กันน้ำฟังก์ชันสูง",
    "Soft Sweater": "เสื้อสเวตเตอร์ไหมพรมเนื้อนุ่ม",
    "Sea Cape": "ผ้าคลุมเกล็ดปลาประกายคลื่นทะเล",
    "Cottagecore Dress": "ชุดเดรสลายดอกไม้ชนบทหวานละมุน",
    "Nature Outfit": "ชุดพรานป่าเดินดงกลมกลืนธรรมชาติ",
    "Streetwear Festival Outfit": "ชุดสตรีทแฟชั่นผสมสีสันงานเทศกาล",
    "Colorful Layered Fashion": "ชุดเลเยอร์หลายชั้นหลากสีสันสดใส",
    "Old Fashion Coat": "เสื้อโค้ตกระดุมสองแถวโบราณ",
    "Elegant Vintage Suit": "สูทวินเทจสั่งตัดเรียบหรูดูดี",
    "Classic Formal Dress": "ชุดราตรียาวทางการคลาสสิก",
    "Gear Armor": "เกราะติดฟันเฟืองสตีมพังก์",
    "Shrine Outfit": "ชุดมิโกะศาลเจ้าญี่ปุ่นโบราณ",
    "Light Fantasy Dress": "ชุดเดรสแฟนตาซีสีขาวสว่างดั่งเทพนิยาย",
    "Elegant Suit": "ชุดสูทสากลคัตติ้งเนี้ยบสง่างาม",
    "Nomad Outfit": "ชุดคนพเนจรแห่งทะเลทรายกว้างใหญ่",
    "Utility Jacket": "แจ็กเก็ตแท็กทิคัลกระเป๋าเยอะ",
    "Black Gothic Outfit": "ชุดโกธิกสีดำลูกไม้ลูกปัดลึกลับ",
    "Crystal Dress": "ชุดเดรสประดับคริสตัลระยิบระยับ",
    "Mask Outfit": "ชุดแฟนซีพร้อมหน้ากากเข้าเซ็ต",
    "Clockwork Outfit": "ชุดช่างกลไขลานติดเข็มขัดอุปกรณ์",
    "Farm": "ฟาร์มชนบทแสนสุข (ทุ่งหญ้าเลี้ยงสัตว์)",
    "Urban": "เมืองใหญ่ยุคปัจจุบัน (ชีวิตคนเมือง)",
    "Cute": "ความน่ารักสดใส (คาวาอี้)",
    "Tropical": "หมู่เกาะเขตร้อน (ทะเลและต้นมะพร้าว)",
    "Elegant": "เรียบหรูสง่างาม (ความภูมิฐานมีระดับ)",
    "Comedy": "ตลกขบขัน (ความเฮฮาสร้างเสียงหัวเราะ)",
    "Wild": "ป่าเถื่อนดุดัน (ธรรมชาติอันดิบเถื่อน)",
    "Chaos": "โกลาหลไร้ระเบียบ (พลังแห่งความวุ่นวาย)",
    "River": "สายน้ำและลำธาร (ความชุ่มฉ่ำริมฝั่งน้ำ)",
    "Swamp": "บึงน้ำลึกลับ (หนองน้ำและหมอกทึบ)",
    "Streetwear": "สตรีทแวร์แฟชั่น (สไตล์วัยรุ่นข้างถนน)"
  };

  function getThaiTranslation(word) {
    if (!word) return "";
    return THAI_TRANSLATIONS[word] || "";
  }

  function parseTranslation(word) {
    const raw = (typeof THAI_TRANSLATIONS !== 'undefined' && THAI_TRANSLATIONS[word]) ? THAI_TRANSLATIONS[word] : "";
    if (!raw) return { full: "", main: "", desc: "" };
    const match = raw.match(/^(.*?)\s*[\(（](.*?)[\)）]\s*$/);
    if (match) {
      return {
        full: raw,
        main: match[1].trim(),
        desc: match[2].trim()
      };
    }
    return {
      full: raw,
      main: raw.trim(),
      desc: ""
    };
  }

  function matchTraitQuery(word, query) {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    if (word.toLowerCase().includes(q)) return true;
    const th = THAI_TRANSLATIONS[word];
    if (th && th.toLowerCase().includes(q)) return true;
    return false;
  };

  // ===== SMART MATCH MAPPINGS =====

  const smartThemes = {
    Fox: ["Japanese", "Yokai", "Forest Spirit"],
    Wolf: ["Dark Fantasy", "Forest Spirit", "Mythology"],
    Cat: ["Witchcore", "Dreamcore", "Fairycore"],
    Dog: ["Cottagecore", "Festival", "Nature"],
    Rabbit: ["Fairy", "Dreamcore", "Cottagecore"],
    Crow: ["Mystery", "Vintage", "Gothic"],
    Raven: ["Mystery", "Voidcore", "Lovecraftian"],
    Sparrow: ["Nature", "Festival", "Light Fantasy"],
    Owl: ["Mystic", "Nightmare", "Witchcore"],
    Hawk: ["Sky Kingdom", "Military", "Nature"],
    Eagle: ["Sky Kingdom", "Royal", "Military"],
    Falcon: ["Military", "Sky Kingdom", "Steampunk"],
    Peacock: ["Royal", "Luxury", "Festival"],
    Swan: ["Royalcore", "Fairytale", "Light Fantasy"],
    Duck: ["Cottagecore", "Nature", "Festival"],
    Goose: ["Festival", "Nature", "Cottagecore"],
    Chicken: ["Farm", "Cottagecore", "Festival"],
    Rooster: ["Festival", "Royal", "Nature"],
    Turkey: ["Festival", "Cottagecore", "Nature"],
    Pigeon: ["Urban", "Street Fashion", "Vintage"],
    Seagull: ["Ocean", "Street Punk", "Nature"],
    Penguin: ["Arctic", "Cottagecore", "Cute"],
    Parrot: ["Pirate", "Tropical", "Festival"],
    Cockatoo: ["Tropical", "Festival", "Luxury"],
    Flamingo: ["Pastel", "Luxury", "Festival"],
    Crane: ["Ancient Japan", "Elegant", "Nature"],
    Heron: ["Nature", "Ocean", "Mystic"],
    Stork: ["Fairytale", "Sky Kingdom", "Nature"],
    Kiwi: ["Cottagecore", "Nature", "Cute"],
    Cassowary: ["Jungle", "Dark Fantasy", "Nature"],
    Ostrich: ["Desert", "Nature", "Comedy"],
    Bat: ["Mystery", "Nightmare", "Gothic"],
    Butterfly: ["Fairy", "Dreamcore", "Light Fantasy"],
    Moth: ["Voidcore", "Mystery", "Dreamcore"],
    Bee: ["Nature", "Cottagecore", "Festival"],
    Wasp: ["Toxic", "Nature", "Dark Fantasy"],
    Hornet: ["Toxic", "Military", "Nature"],
    Ant: ["Nature", "Cottagecore", "Military"],
    Spider: ["Mystery", "Gothic", "Voidcore"],
    Scorpion: ["Desert", "Toxic", "Dark Fantasy"],
    Dragonfly: ["Fairy", "Nature", "Dreamcore"],
    Grasshopper: ["Nature", "Cottagecore", "Festival"],
    Cricket: ["Nature", "Vintage", "Cottagecore"],
    Beetle: ["Mechanical", "Nature", "Steampunk"],
    Ladybug: ["Cute", "Fairy", "Nature"],
    Firefly: ["Fairy", "Dreamcore", "Bioluminescent"],
    Centipede: ["Dark Fantasy", "Toxic", "Voidcore"],
    Millipede: ["Nature", "Toxic", "Dark Fantasy"],
    Snail: ["Cottagecore", "Dreamcore", "Nature"],
    Slug: ["Voidcore", "Toxic", "Dark Fantasy"],
    Jellyfish: ["Ocean", "Dreamcore", "Ghost"],
    Octopus: ["Ocean", "Mystic", "Lovecraftian"],
    Squid: ["Ocean", "Lovecraftian", "Mystic"],
    Cuttlefish: ["Ocean", "Bioluminescent", "Mystic"],
    Seal: ["Arctic", "Cottagecore", "Cute"],
    "Sea Lion": ["Ocean", "Festival", "Cute"],
    Walrus: ["Arctic", "Nature", "Vintage"],
    Dolphin: ["Ocean", "Light Fantasy", "Dreamcore"],
    Whale: ["Ocean", "Mystic", "Voidcore"],
    Shark: ["Ocean", "Cyberpunk", "Wild"],
    "Hammerhead Shark": ["Ocean", "Cyberpunk", "Toxic"],
    "Tiger Shark": ["Ocean", "Deep Sea", "Wild"],
    "Great White Shark": ["Ocean", "Deep Sea", "Military"],
    Manta: ["Ocean", "Dreamcore", "Light Fantasy"],
    Stingray: ["Ocean", "Mystic", "Dark Fantasy"],
    Swordfish: ["Ocean", "Military", "Royal"],
    Tuna: ["Ocean", "Nature", "Festival"],
    Salmon: ["Ocean", "Nature", "Cottagecore"],
    Koi: ["Ancient Japan", "Royal", "Festival"],
    Goldfish: ["Cute", "Dreamcore", "Fairy"],
    Catfish: ["Ocean", "Mystic", "Vintage"],
    Pufferfish: ["Ocean", "Cute", "Toxic"],
    Eel: ["Ocean", "Voidcore", "Mystic"],
    Seahorse: ["Ocean", "Fairy", "Dreamcore"],
    Clownfish: ["Ocean", "Cute", "Festival"],
    Otter: ["Cottagecore", "Cute", "Nature"],
    Beaver: ["Nature", "Cottagecore", "Military"],
    Raccoon: ["Street Fashion", "Urban", "Cottagecore"],
    Panda: ["Cottagecore", "Cute", "Nature"],
    "Red Panda": ["Cottagecore", "Cute", "Dreamcore"],
    Bear: ["Wild", "Nature", "Mythology"],
    "Polar Bear": ["Arctic", "Voidcore", "Nature"],
    "Grizzly Bear": ["Wild", "Forest Spirit", "Mythology"],
    Koala: ["Cute", "Cottagecore", "Nature"],
    Sloth: ["Dreamcore", "Cottagecore", "Nature"],
    Monkey: ["Jungle", "Festival", "Chaos"],
    Chimpanzee: ["Jungle", "Nature", "Mystic"],
    Gorilla: ["Wild", "Military", "Nature"],
    Tiger: ["Royal", "Wild", "Fantasy"],
    Lion: ["Royal", "Mythology", "Desert"],
    Leopard: ["Wild", "Luxury", "Jungle"],
    Deer: ["Forest Spirit", "Fairy", "Nature"],
    Elk: ["Forest Spirit", "Mythology", "Nature"],
    Moose: ["Arctic", "Nature", "Mythology"],
    Horse: ["Royal", "Fantasy", "Military"],
    Zebra: ["Monochrome", "Wild", "Nature"],
    Camel: ["Desert", "Ancient Egypt", "Nature"],
    Elephant: ["Royal", "Mythology", "Nature"],
    Giraffe: ["Jungle", "Dreamcore", "Nature"],
    Kangaroo: ["Desert", "Festival", "Nature"],
    Hippo: ["River", "Nature", "Cute"],
    Rhino: ["Military", "Wild", "Nature"],
    Crocodile: ["Swamp", "Wild", "Nature"],
    Alligator: ["Swamp", "Wild", "Military"],
    Snake: ["Mystery", "Mythology", "Toxic"],
    Cobra: ["Royal", "Mystery", "Mythology"],
    Frog: ["Nature", "Fairy", "Cottagecore"],
    Toad: ["Witchcore", "Nature", "Mystic"],
    Axolotl: ["Dreamcore", "Cute", "Mystic"],
    Phoenix: ["Mythology", "Fire", "Royal"],
    Dragon: ["Fantasy", "Mythology", "Royal"],
    Unicorn: ["Fairy", "Light Fantasy", "Royal"],
    Griffin: ["Mythology", "Royal", "Fantasy"],
    Kraken: ["Ocean", "Lovecraftian", "Deep Sea"],
    Mermaid: ["Ocean", "Fairy", "Dreamcore"],
    Kitsune: ["Japanese", "Yokai", "Mystic"],
    Tanuki: ["Japanese", "Festival", "Chaos"],
    Yeti: ["Arctic", "Mythology", "Wild"],
    "Loch Ness Monster": ["Mystic", "Ocean", "Mythology"],

    // MGE Races Smart Mappings (Complete 100 Species)
    Lamia: ["Desert", "Ancient Egypt", "Yokai", "Mystery"],
    Harpy: ["Sky Kingdom", "Fairy", "Mythology", "Nature"],
    Mermaid: ["Ocean", "Deep Sea", "Fairy", "Dreamcore"],
    Centaur: ["Medieval", "Knight", "Wild", "Cottagecore"],
    Arachne: ["Mystery", "Gothic", "Voidcore", "Witchcore"],
    Alraune: ["Nature", "Forest Spirit", "Cottagecore", "Fairy"],
    Dullahan: ["Medieval", "Knight", "Gothic", "Dark Fantasy"],
    Scylla: ["Ocean", "Deep Sea", "Lovecraftian", "Voidcore"],
    Sphinx: ["Desert", "Ancient Egypt", "Mystic", "Astrology"],
    Valkyrie: ["Sky Kingdom", "Royal", "Knight", "Angel"],
    "Slime Girl": ["Dreamcore", "Cute", "Bioluminescent", "Pastel"],
    Succubus: ["Gothic", "Demon", "Midnight Purple", "Luxury"],
    Incubus: ["Gothic", "Demon", "Luxury", "Mafia"],
    Kitsune: ["Japanese", "Yokai", "Mystic", "Festival"],
    Nekomata: ["Japanese", "Yokai", "Cute", "Street Fashion"],
    Dragonewt: ["Fantasy", "Mythology", "Royal", "Dark Fantasy"],
    Phoenix: ["Mythology", "Celestial", "Solar", "Royal"],
    Siren: ["Ocean", "Music", "Mystic", "Deep Sea"],
    Kobold: ["Cottagecore", "Cute", "Nature", "Fantasy"],
    Goblin: ["Chaos", "Cottagecore", "Street Punk", "Techwear"],
    Minotaur: ["Medieval", "Wild", "Ancient Greece"],
    Gryphon: ["Sky Kingdom", "Royal", "Mythology", "Knight"],
    Anubis: ["Ancient Egypt", "Desert", "Necromancer", "Mythology"],
    Wendigo: ["Arctic", "Dark Fantasy", "Ghost", "Forest Spirit"],
    Cockatrice: ["Witchcore", "Mythology", "Dark Fantasy", "Nature"],
    Echidna: ["Dark Fantasy", "Mythology", "Lovecraftian"],
    Medusa: ["Ancient Greece", "Gothic", "Mystery", "Mythology"],
    Karkadann: ["Desert", "Royal", "Light Fantasy"],
    Lich: ["Necromancer", "Gothic", "Dark Fantasy", "Magic Academy"],
    Banshee: ["Ghost", "Gothic", "Dark Fantasy", "Music"],
    Gargoyle: ["Gothic", "Medieval", "Dark Fantasy", "Knight"],
    Dryad: ["Forest Spirit", "Nature", "Cottagecore", "Fairy"],
    Nereid: ["Ocean", "Fairy", "Light Fantasy", "Deep Sea"],
    Nymph: ["Nature", "Fairy", "Ancient Greece", "Cottagecore"],
    Devil: ["Demon", "Hell", "Gothic", "Dark Fantasy"],
    Angel: ["Angel", "Heaven", "Celestial", "Royal"],
    "Yuki-onna": ["Japanese", "Yokai", "Arctic", "Gothic"],
    Jorogumo: ["Japanese", "Yokai", "Gothic", "Mystery"],
    Kasha: ["Japanese", "Yokai", "Demon", "Street Fashion"],
    Raiju: ["Japanese", "Yokai", "Techwear", "Sci-Fi"],
    Inugami: ["Japanese", "Yokai", "Samurai"],
    "Yamata no Orochi": ["Japanese", "Yokai", "Mythology", "Dark Fantasy"],
    "Holstaurus (Cow Girl)": ["Cottagecore", "Cute", "Pastel", "Nature"],
    Baphomet: ["Demon", "Gothic", "Necromancer", "Witchcore"],
    "Cait Sith": ["Fairy", "Cute", "Steampunk"],
    Werewolf: ["Werewolf", "Dark Fantasy", "Wild", "Street Punk"],
    Vampire: ["Vampire", "Gothic", "Victorian", "Luxury"],
    Ghoul: ["Zombie", "Dark Fantasy", "Post-Apocalyptic", "Street Punk"],
    Demon: ["Demon", "Hell", "Dark Fantasy", "Gothic"],
    Salamander: ["Solar", "Alchemy", "Desert"],
    Undine: ["Ocean", "Deep Sea", "Fairy", "Light Fantasy"],
    Sylph: ["Sky Kingdom", "Cloudcore", "Fairy", "Light Fantasy"],
    Gnome: ["Cottagecore", "Nature", "Alchemy", "Fantasy"],
    Wyvern: ["Fantasy", "Wild", "Sky Kingdom", "Dark Fantasy"],
    Leviathan: ["Deep Sea", "Ocean", "Lovecraftian", "Voidcore"],
    Kraken: ["Deep Sea", "Lovecraftian", "Ocean", "Pirate"],
    Behemoth: ["Wild", "Post-Apocalyptic", "Desert", "Mythology"],
    Chimera: ["Alchemy", "Dark Fantasy", "Chaos"],
    Orthrus: ["Dark Fantasy", "Mythology", "Knight"],
    Cerberus: ["Demon", "Dark Fantasy", "Gothic"],
    Pegasus: ["Sky Kingdom", "Angel", "Royal", "Light Fantasy"],
    Unicorn: ["Fairy", "Light Fantasy", "Royal", "Dreamcore"],
    Hippogriff: ["Sky Kingdom", "Knight", "Mythology", "Royal"],
    "Mantis Girl": ["Nature", "Ninja", "Sci-Fi"],
    "Bee Girl (Apis)": ["Cottagecore", "Cute", "Nature", "Royal"],
    "Ant Girl (Myrmex)": ["Techwear", "Military", "Nature"],
    "Moth Girl": ["Dreamcore", "Witchcore", "Gothic", "Nightmare"],
    "Butterfly Girl": ["Fairy", "Pastel", "Cottagecore", "Light Fantasy"],
    "Snail Girl": ["Cottagecore", "Cute", "Nature"],
    Lindwurm: ["Fantasy", "Dark Fantasy", "Medieval"],
    Mandrake: ["Witchcore", "Alchemy", "Nature", "Cottagecore"],
    "Flytrap Girl": ["Toxic", "Nature", "Gothic", "Witchcore"],
    "Treant Girl": ["Nature", "Forest Spirit", "Cottagecore"],
    "Mushroom Girl": ["Cottagecore", "Fairy", "Dreamcore", "Weirdcore"],
    Jiangshi: ["Ancient China", "Ghost", "Gothic", "Streetwear"],
    Mummy: ["Ancient Egypt", "Desert", "Necromancer", "Gothic"],
    "Skeleton Girl": ["Gothic", "Necromancer", "Dark Fantasy"],
    Phantom: ["Ghost", "Gothic", "Victorian", "Voidcore"],
    Poltergeist: ["Weirdcore", "Ghost", "Chaos", "Kidcore"],
    "Shadow Girl": ["Voidcore", "Gothic", "Ninja", "Cyberpunk"],
    Homunculus: ["Alchemy", "Sci-Fi", "Glass"],
    "Automaton (Golem)": ["Steampunk", "Clockwork", "Cyberpunk", "Mechanical"],
    Mimic: ["Casino", "Fantasy", "Chaos"],
    "Living Armor": ["Knight", "Medieval", "Gothic", "Dark Fantasy"],
    Doppelganger: ["Glitch", "Weirdcore", "Voidcore", "Mystery"],
    "High Elf": ["Royal", "Light Fantasy", "Nature", "Magic Academy"],
    "Dark Elf": ["Dark Fantasy", "Gothic", "Ninja", "Witchcore"],
    "Orc Girl": ["Street Punk", "Wild", "Military", "Chaos"],
    "Oni (Ogre)": ["Japanese", "Samurai", "Street Punk", "Chaos"],
    Tengu: ["Japanese", "Yokai", "Sky Kingdom", "Samurai"],
    Kappa: ["Japanese", "Yokai", "Nature"],
    Kamaitachi: ["Japanese", "Yokai", "Ninja"],
    Mujina: ["Japanese", "Yokai", "Mystery", "Cottagecore"],
    Nue: ["Japanese", "Yokai", "Dark Fantasy", "Chaos"],
    Qilin: ["Ancient China", "Celestial", "Royal", "Light Fantasy"],
    Thunderbird: ["Sky Kingdom", "Mythology"],
    Hydra: ["Mythology", "Dark Fantasy", "Toxic"],
    "Sea Bishop": ["Ocean", "Deep Sea", "Mystic"],
    "Beholder Girl": ["Lovecraftian", "Voidcore", "Magic Academy", "Sci-Fi"],
    Wererabbit: ["Cute", "Street Punk", "Wild"]
  };

  const smartObjects = {
    Japanese: ["Fox Mask", "Kitsune Mask", "Paper Umbrella", "Lantern", "Fan", "Kimono Sleeve", "Torii Gate", "Shrine Charm", "Katana", "Ink Bottle"],
    Cyberpunk: ["Cyber Chip", "Hologram", "Neon Tube", "Glitch Screen", "VR Headset", "AI Core", "USB Drive", "Data Disk", "Mechanical Arm"],
    Dreamcore: ["Dreamcatcher", "Dream Mirror", "Floating Book", "Dream Bottle", "Galaxy Jar", "Cloud Pillow", "Snow Globe"],
    Fantasy: ["Magic Scroll", "Rune Stone", "Crystal Ball", "Crystal Sword", "Dragon Egg", "Unicorn Horn", "Phoenix Feather"],
    Ocean: ["Aquarium", "Ocean Bottle", "Pearl", "Coral", "Seahorse", "Jellyfish Lamp", "Shark Tooth", "Anchor"],
    Royal: ["Crown", "Golden Crown", "Royal Cape", "Sword", "Shield", "Necklace", "Ring", "Medal", "Throne"],
    Nature: ["Bamboo", "Acorn", "Maple Leaf", "Plant Pot", "Bonsai", "Feather", "Flower Vase"],
    Festival: ["Festival Lantern", "Wind Chime", "Bell", "Pinwheel", "Mask", "Paper Crane", "Confetti"],
    Mystery: ["Skull", "Bone", "Candle", "Ghost Candle", "Cracked Mask", "Blood Stain", "Broken Sword"],
    Space: ["Planet", "Galaxy", "Meteor", "Comet", "Satellite", "Spaceship", "Star", "Moon"],
    Vintage: ["Pocket Watch", "Typewriter", "Cassette", "Film Reel", "Diary", "Old Photo", "Radio"],
    Steampunk: ["Clockwork Gear", "Steam Engine", "Steam Pipe", "Steampunk Goggles", "Mechanical Arm", "Valve"],
    Yokai: ["Kitsune Mask", "Spirit Lantern", "Charm", "Talisman", "Paper Crane", "Fox Mask"],
    StreetFashion: ["Sunglasses", "Neon Sign", "Chains", "Phone", "Headphones", "Backpack"],
    Angel: ["Halo", "White Feather", "Light Halo", "Prayer Beads"],
    Demon: ["Black Feather", "Chain", "Broken Sword", "Skull"],
    Fairy: ["Crystal Flower", "Butterfly Pin", "Fairy Light", "Wind Bell", "Flower Crown"],
    Ghost: ["Ghost Candle", "Mirror", "Bell", "Lantern", "Paper", "Floating Book"],
    PostApocalyptic: ["Gas Mask", "Broken Mask", "Scrap Metal", "Battery", "Radio"],
    SciFi: ["Laser Gun", "Drone", "AI Core", "Cyber Chip", "Hologram"],
    Medieval: ["Shield", "Sword", "Helmet", "Armor", "Crown"],
    Victorian: ["Pocket Watch", "Cane", "Teacup", "Mirror", "Diary"],
    Gothic: ["Candle", "Skull", "Rose", "Chain", "Mirror"],
    DarkFantasy: ["Crystal Sword", "Shadow Cloak", "Bone Crown", "Rune Stone"],
    LightFantasy: ["Crystal Flower", "Light Halo", "Fairy Light", "Star Pendant"],
    Mythology: ["Ancient Tablet", "Talisman", "Relic", "Rune Stone", "Statue"],
    AncientEgypt: ["Scarab", "Golden Mask", "Ancient Tablet", "Seal Stamp"],
    AncientGreece: ["Statue", "Laurel Crown", "Scroll", "Column Fragment"],
    AncientChina: ["Fan", "Scroll", "Ink Bottle", "Calligraphy Brush"],
    AncientJapan: ["Katana", "Torii Gate", "Lantern", "Kimono Sleeve"],
    Samurai: ["Katana", "Armor", "Helmet", "Banner"],
    Ninja: ["Kunai", "Shuriken", "Smoke Bomb", "Mask"],
    Pirate: ["Pirate Flag", "Treasure Chest", "Map", "Compass", "Hook"],
    Knight: ["Sword", "Shield", "Armor", "Helmet"],
    Circus: ["Balloon", "Mask", "Ticket", "Bell"],
    Carnival: ["Mask", "Ticket", "Confetti", "Lantern"],
    Casino: ["Dice", "Card", "Coin", "Chip"],
    Mafia: ["Gun", "Suitcase", "Chain", "Cigarette"],
    Detective: ["Magnifying Glass", "Notebook", "Camera", "Pipe"],
    Military: ["Gun", "Helmet", "Binoculars", "Radar"],
    Desert: ["Camel Figurine", "Sand Bottle", "Ancient Relic", "Sun Pendant"],
    Arctic: ["Snowflake", "Ice Cube", "Fur Coat", "Snow Globe"],
    Jungle: ["Bamboo", "Snake Idol", "Totem", "Leaf"],
    Underwater: ["Coral", "Pearl", "Sea Shell", "Fish Tank"],
    SkyKingdom: ["Cloud Ribbon", "Floating Island", "Wind Chime"],
    Cloudcore: ["Cloud Pillow", "Dream Bottle", "Feather"],
    Lovecraftian: ["Tentacle Relic", "Void Cube", "Ancient Book"],
    Witchcore: ["Potion Bottle", "Crystal Ball", "Magic Book", "Candle"],
    Fairytale: ["Magic Book", "Crown", "Flower", "Castle Key"],
    Fairycore: ["Butterfly Pin", "Flower Crown", "Fairy Light"],
    Kidcore: ["Toy", "Balloon", "Sticker", "Candy"],
    Weirdcore: ["Glitch Screen", "Broken Mask", "Eye Photo"],
    Voidcore: ["Void Cube", "Black Hole", "Shadow Orb"],
    Cottagecore: ["Basket", "Flower", "Tea Cup", "Bread"],
    Angelcore: ["Halo", "Feather", "Light Orb"],
    Devilcore: ["Chain", "Skull", "Red Flame"],
    Princesscore: ["Crown", "Dress", "Ring"],
    Royalcore: ["Golden Crown", "Royal Cape", "Ring"],
    Retro: ["Cassette", "Vinyl", "Old TV"],
    Neon80s: ["Neon Sign", "Tape", "Arcade Machine"],
    Anime90s: ["CD", "Poster", "VHS Tape"],
    Y2K: ["Flip Phone", "Sticker", "Glitter Bag"],
    Techwear: ["Mask", "Chain", "Utility Bag"],
    StreetPunk: ["Chains", "Graffiti Spray", "Boots"],
    Grunge: ["Broken Guitar", "Tape", "Smoked Glass"],
    Emo: ["Black Rose", "Chain", "Diary"],
    Pastel: ["Candy", "Ribbon", "Cute Plush"],
    Monochrome: ["Chess Piece", "Black White Photo"],
    Luxury: ["Diamond Ring", "Gold Watch", "Perfume"],
    Crystal: ["Crystal Ball", "Gem", "Prism"],
    Glass: ["Glass Eye", "Mirror", "Bottle"],
    Porcelain: ["Porcelain Doll", "Tea Cup"],
    Paper: ["Origami", "Paper Crane", "Scroll"],
    Ink: ["Ink Bottle", "Calligraphy Brush"],
    Music: ["Piano", "Violin", "Guitar", "Music Box"],
    Theater: ["Mask", "Curtain", "Script"],
    Opera: ["Mask", "Crown", "Music Sheet"],
    Idol: ["Microphone", "Light Stick", "Poster"],
    MagicAcademy: ["Magic Book", "Wand", "Potion"],
    Alchemy: ["Test Tube", "Potion Bottle", "Flask"],
    Necromancer: ["Skull", "Bone Staff", "Candle"],
    Celestial: ["Star Pendant", "Moon Necklace", "Galaxy"],
    Solar: ["Sun Pendant", "Light Orb"],
    Lunar: ["Moon Mirror", "Moon Clock"],
    Astrology: ["Star Compass", "Tarot Card"],
    Tarot: ["Tarot Card", "Crystal Ball"],
    Dreamwalker: ["Dream Mirror", "Dream Bottle"],
    Nightmare: ["Broken Mask", "Skull", "Candle"],
    Heaven: ["Halo", "Light Orb"],
    Hell: ["Chain", "Fire Flame", "Skull"],
    ForestSpirit: ["Totem", "Bamboo", "Spirit Charm"],
    DeepSea: ["Pearl", "Coral", "Sea Bottle"],
    Bioluminescent: ["Jellyfish Lamp", "Glow Orb"],
    Toxic: ["Poison Bottle", "Green Liquid"],
    Radioactive: ["Glowing Crystal", "Warning Sign"],
    Mechanical: ["Gear", "Robot Part"],
    Clockwork: ["Clock Gear", "Pocket Watch"],
    Digital: ["USB Drive", "Pixel Cube"],
    Glitch: ["Glitch Screen", "Broken Monitor"],
    VirtualReality: ["VR Headset", "Hologram"],
    Arcade: ["Game Controller", "Joystick"],
    Zombie: ["Bone", "Skull"],
    Vampire: ["Coffin Key", "Blood Bottle"],
    Werewolf: ["Wolf Fang", "Chain"],
    HauntedMansion: ["Candle", "Broken Mirror", "Door Key"]
  };

  const smartclothing = {
    Japanese: ["Kimono", "Festival Yukata", "Shrine Maiden Outfit", "Samurai Armor", "Fox Spirit Kimono", "Silver Thread Kimono"],
    Cyberpunk: ["Cyber Suit", "Techwear Outfit", "Digital Pattern Jacket", "Holographic Outfit", "AI-Themed Outfit", "Cyber Armor"],
    Dreamcore: ["Dreamcore Outfit", "Dream Walker Outfit", "Floating Sleeve Dress", "Cloud Hoodie", "Soft Sweater", "Weirdcore Outfit"],
    Fantasy: ["Fantasy Armor", "Mage Cloak", "Wizard Robe", "Fantasy Princess Dress", "Ancient Mage Outfit", "Rune Armor"],
    Ocean: ["Ocean-Themed Outfit", "Deep Sea Outfit", "Jellyfish Inspired Dress", "Whale Ocean Robe", "Sea Cape", "Bioluminescent Dress"],
    Royal: ["Royal Dress", "Royal Suit", "Golden Embroidered Outfit", "Royal Cape", "Overdecorated Royal Outfit", "Blue & Gold Royal Dress"],
    Nature: ["Cottagecore Dress", "Forest Guardian Cloak", "Flower-Themed Dress", "Soft Cottagecore Dress", "Nature Outfit", "Sunflower Dress"],
    Festival: ["Festival Yukata", "Orange Festival Outfit", "Streetwear Festival Outfit", "Idol Costume", "Circus Costume", "Colorful Layered Fashion"],
    Mystery: ["Blood-Stained Outfit", "Gothic Dress", "Broken Uniform", "Haunted Bride Dress", "Nightmare Cloak", "Dark Cultist Cloak"],
    Space: ["Spacesuit", "Galaxy Cloak", "Star Traveler Outfit", "Galaxy Printed Hoodie", "Astral Traveler Outfit", "Void King Outfit"],
    Vintage: ["Victorian Dress", "Victorian Suit", "Retro 80s Outfit", "Old Fashion Coat", "Elegant Vintage Suit", "Classic Formal Dress"],
    Steampunk: ["Steampunk Outfit", "Clockwork Maid Outfit", "Clock Tower Butler Outfit", "Mechanical Suit", "Steam Engineer Outfit", "Gear Armor"],
    Yokai: ["Fox Spirit Kimono", "Ghost Kimono", "Shrine Outfit", "Spirit Cloak", "Traditional Robe", "Rune Covered Cloak"],
    StreetFashion: ["Streetwear", "Oversized Hoodie", "Street Punk Outfit", "Shark Streetwear", "Traveler Streetwear", "Neon Punk Outfit"],
    Angel: ["Angel Robe", "Soft Angel Outfit", "Halo Dress", "Heavenly Robe", "Light Guardian Outfit"],
    Demon: ["Demon Outfit", "Dark Royal Dress", "Corrupted Priest Outfit", "Black & Red Gothic Outfit", "Chaos Cultist Outfit"],
    Fairy: ["Fairycore Outfit", "Butterfly Fairy Dress", "Flower Crown Dress", "Light Fantasy Dress", "Crystal Decorated Outfit"],
    Ghost: ["Ghost Kimono", "Ghostly Kimono", "White Funeral Dress", "Spirit Cloak", "Transparent Raincoat"],
    PostApocalyptic: ["Wasteland Armor", "Scavenger Outfit", "Broken Uniform", "Torn Clothes", "Zombie Survivor Hoodie"],
    SciFi: ["Mechanical Suit", "Cyber Suit", "AI-Themed Outfit", "Holographic Outfit", "Virtual Performer Outfit"],
    Medieval: ["Knight Armor", "Battle Uniform", "Chainmail Dress", "Ancient Armor", "Holy Knight Armor"],
    Victorian: ["Victorian Dress", "Elegant Suit", "Luxury Fur Cape", "Formal Suit", "Elegant Monochrome Suit"],
    Gothic: ["Gothic Dress", "Elegant Gothic Suit", "Black Wedding Suit", "All Black Fashion", "Rose Thorn Cloak"],
    DarkFantasy: ["Dark Magical Girl Outfit", "Void-Touched Robe", "Corrupted Royal Outfit", "Night Sky Dress"],
    LightFantasy: ["Fairytale Dress", "Soft Angel Outfit", "Moonlight Dress", "Elegant Ballroom Dress"],
    Mythology: ["Ancient Dragon Robe", "Golden Royal Armor", "Celestial Priest Outfit", "Rune Armor"],
    AncientJapan: ["Kimono", "Shrine Maiden Outfit", "Samurai Armor", "Fox Spirit Kimono"],
    Samurai: ["Samurai Armor", "Battle Uniform", "Heavy Military Coat", "Ancient Armor"],
    Ninja: ["Ninja Outfit", "Cyber Ninja Outfit", "Shadow Assassin Outfit", "Half Mask Outfit"],
    Pirate: ["Pirate Coat", "Pirate Captain Coat", "Traveler Streetwear", "Battle Uniform"],
    Knight: ["Knight Armor", "Holy Knight Armor", "Chainmail Dress", "Battle Uniform"],
    Military: ["Military Uniform", "Heavy Military Coat", "Tactical Gear", "Battle Uniform"],
    Desert: ["Desert Robe", "Desert King Robe", "Explorer Outfit", "Nomad Outfit"],
    Arctic: ["Winter Coat", "Arctic Coat", "Frost Covered Outfit", "Soft Winter Fashion"],
    Jungle: ["Jungle Hunter Outfit", "Forest Guardian Cloak", "Safari Outfit"],
    Underwater: ["Ocean-Themed Outfit", "Deep Ocean Cloak", "Bioluminescent Dress"],
    SkyKingdom: ["Cloud Hoodie", "Cloud Traveler Cloak", "Floating Sleeve Dress"],
    Cloudcore: ["Cloud Hoodie", "Soft Sweater", "Dreamcore Sweater"],
    Lovecraftian: ["Void-Touched Robe", "Nightmare Cloak", "Dark Cultist Cloak"],
    Witchcore: ["Witch Dress", "Forest Witch Dress", "Digital Witch Outfit"],
    Fairytale: ["Fairytale Dress", "Fantasy Princess Dress", "Elegant Ballroom Dress"],
    Fairycore: ["Butterfly Fairy Dress", "Flower Crown Dress", "Soft Cottagecore Dress"],
    Voidcore: ["Void-Touched Robe", "Chain Bound Cloak", "All Black Fashion"],
    Cottagecore: ["Soft Cottagecore Dress", "Flower-Themed Dress", "Casual Wear"],
    Angelcore: ["Soft Angel Outfit", "Halo Dress", "Light Guardian Outfit"],
    Devilcore: ["Cute Demon Hoodie", "Dark Cultist Cloak", "Blood-Stained Outfit"],
    Royalcore: ["Overdecorated Royal Outfit", "Golden Embroidered Outfit", "Royal Dress"],
    Y2K: ["Y2K Fashion", "Neon Fashion", "Pixel Art Jacket"],
    Techwear: ["Techwear Outfit", "Cyber Armor", "Utility Jacket"],
    StreetPunk: ["Street Punk Outfit", "Neon Punk Outfit", "Grunge Outfit"],
    Grunge: ["Grunge Outfit", "Torn Clothes", "Broken Uniform"],
    Emo: ["Emo Fashion", "Black Gothic Outfit", "Chain Accessories Outfit"],
    Pastel: ["Pastel Fashion", "Soft Girl Outfit", "Cute Layered Fashion"],
    Monochrome: ["Monochrome Outfit", "Elegant Monochrome Suit", "All Black Fashion"],
    Luxury: ["Luxury Fashion", "Golden Embroidered Outfit", "Luxury Fur Cape"],
    Crystal: ["Crystal Decorated Outfit", "Crystal Armor", "Crystal Dress"],
    Glass: ["Glass Dress", "Transparent Raincoat"],
    Porcelain: ["Porcelain Doll Dress", "Elegant Dress"],
    Ink: ["Ink Painter Outfit", "Ink Splattered Outfit"],
    Music: ["Music-Themed Outfit", "Musician Streetwear", "Elegant Concert Suit"],
    Theater: ["Theater Costume", "Opera Outfit", "Mask Outfit"],
    Idol: ["Idol Costume", "Virtual Idol Outfit", "Cyber Idol Outfit"],
    MagicAcademy: ["Magic Academy Uniform", "Arcane Robe", "Alchemy Uniform"],
    Celestial: ["Celestial Dress", "Starry Night Cloak", "Moon Priestess Outfit"],
    Solar: ["Sun Warrior Armor", "Sun Priest Outfit"],
    Lunar: ["Moonlight Dress", "Moon Guardian Dress"],
    Dreamwalker: ["Dream Walker Outfit", "Dreamcore Sweater"],
    Nightmare: ["Nightmare Cloak", "Broken Uniform"],
    Heaven: ["Heavenly Robe", "Soft Angel Outfit"],
    Hell: ["Burning Flame Robe", "Chaos Cultist Outfit"],
    ForestSpirit: ["Forest Guardian Cloak", "Green Forest Cloak"],
    DeepSea: ["Deep Ocean Cloak", "Ocean Prince Outfit"],
    Bioluminescent: ["Bioluminescent Dress"],
    Radioactive: ["Radioactive Hazard Suit"],
    Mechanical: ["Mechanical Suit", "Clockwork Maid Outfit"],
    Clockwork: ["Clockwork Outfit", "Steampunk Outfit"],
    Digital: ["Digital Pattern Jacket", "Pixel-Themed Hoodie"]
  };

  const smartColors = {
    Japanese: ["Crimson", "Scarlet", "Snow White", "Jet Black", "Sunrise Gold", "Cherry Red"],
    Cyberpunk: ["Neon Cyan", "Neon Blue", "Neon Pink", "Neon Green", "Jet Black", "Glowing Cyan"],
    Dreamcore: ["Pastel Pink", "Baby Blue", "Lavender", "Lilac", "Cloud White", "Pearl White"],
    Fantasy: ["Ruby Red", "Emerald Green", "Midnight Purple", "Gold", "Silver", "Sapphire Blue"],
    Ocean: ["Ocean Blue", "Deep Teal", "Sky Blue", "Turquoise", "Pearl White", "Coral"],
    Royal: ["Royal Blue", "Gold", "Crimson", "Midnight Purple", "Emerald Green", "Ivory"],
    Nature: ["Emerald Green", "Forest Green", "Olive", "Sand", "Amber", "Earth Brown"],
    Festival: ["Scarlet", "Flame Yellow", "Hot Pink", "Gold", "Neon Orange", "Sky Blue"],
    Mystery: ["Jet Black", "Midnight Purple", "Blood Red", "Ash Gray", "Charcoal", "Crimson"],
    Space: ["Space Black", "Galaxy Purple", "Moonlight Silver", "Midnight Purple", "Obsidian"],
    Vintage: ["Coffee Brown", "Amber", "Sepia", "Beige", "Ivory", "Bronze"],
    Steampunk: ["Bronze", "Copper", "Coffee Brown", "Amber", "Charcoal", "Gold"],
    Yokai: ["Scarlet", "Ink Black", "Snow White", "Purple", "Blood Red", "Gold"],
    StreetFashion: ["Neon Pink", "Jet Black", "Neon Cyan", "Hot Pink", "Monochrome"],
    Angel: ["Snow White", "Cloud White", "Moonlight Silver", "Gold", "Baby Blue"],
    Demon: ["Blood Red", "Jet Black", "Obsidian", "Crimson", "Midnight Purple"],
    Fairy: ["Pastel Pink", "Mint", "Lavender", "Gold", "Lilac", "Pearl White"],
    Ghost: ["Ash Gray", "Snow White", "Frost White", "Moonlight Silver", "Charcoal"],
    PostApocalyptic: ["Charcoal", "Ash Gray", "Rust Brown", "Olive", "Jet Black"],
    SciFi: ["Glowing Cyan", "Neon Blue", "Silver", "White", "Jet Black"],
    Medieval: ["Steel Gray", "Gold", "Royal Blue", "Crimson", "Bronze"],
    Victorian: ["Wine Red", "Midnight Purple", "Jet Black", "Ivory", "Gold"],
    Gothic: ["Jet Black", "Blood Red", "Midnight Purple", "Obsidian", "Charcoal"],
    DarkFantasy: ["Obsidian", "Blood Red", "Midnight Purple", "Crimson", "Ash Gray"],
    LightFantasy: ["Pearl White", "Moonlight Silver", "Sky Blue", "Rose Pink", "Gold"],
    Mythology: ["Sunrise Gold", "Bronze", "Ivory", "Crimson", "Deep Teal"],
    AncientEgypt: ["Gold", "Sand", "Lapis Blue", "Crimson", "Obsidian"],
    AncientGreece: ["Ivory", "Gold", "White", "Olive", "Royal Blue"],
    AncientChina: ["Crimson", "Gold", "Jade Green", "Ink Black", "Snow White"],
    AncientJapan: ["Cherry Red", "Ink Black", "Gold", "Snow White", "Indigo"],
    Samurai: ["Crimson", "Jet Black", "Gold", "Steel Gray", "Scarlet"],
    Ninja: ["Jet Black", "Obsidian", "Midnight Purple", "Charcoal", "Dark Crimson"],
    Pirate: ["Crimson", "Coffee Brown", "Gold", "Jet Black", "Navy Blue"],
    Knight: ["Steel Gray", "Silver", "Royal Blue", "Crimson", "Gold"],
    Desert: ["Sand", "Amber", "Sunrise Gold", "Crimson", "Obsidian"],
    Arctic: ["Ice Blue", "Frost White", "Snow White", "Sky Blue", "Silver"],
    Jungle: ["Emerald Green", "Forest Green", "Olive", "Amber", "Earth Brown"],
    Underwater: ["Ocean Blue", "Turquoise", "Deep Teal", "Bioluminescent Cyan", "Pearl White"],
    SkyKingdom: ["Sky Blue", "Cloud White", "Gold", "Moonlight Silver"],
    Cloudcore: ["Cloud White", "Pastel Pink", "Baby Blue", "Lavender"],
    Lovecraftian: ["Void Black", "Deep Teal", "Midnight Purple", "Toxic Green"],
    Witchcore: ["Midnight Purple", "Emerald Green", "Blood Red", "Obsidian"],
    Fairytale: ["Rose Pink", "Gold", "Sky Blue", "Ivory", "Pastel Purple"],
    Fairycore: ["Mint", "Pastel Pink", "Lavender", "Gold", "Soft Green"],
    Voidcore: ["Obsidian", "Jet Black", "Void Black", "Charcoal"],
    Cottagecore: ["Sage Green", "Warm Cream", "Soft Brown", "Pastel Yellow"],
    Angelcore: ["Snow White", "Gold", "Soft Yellow", "Cloud White"],
    Devilcore: ["Blood Red", "Jet Black", "Flame Orange", "Obsidian"],
    Royalcore: ["Royal Blue", "Gold", "Crimson", "Ivory"],
    Techwear: ["Jet Black", "Charcoal", "Neon Cyan", "High-vis Yellow"],
    StreetPunk: ["Hot Pink", "Jet Black", "Neon Green", "Crimson"],
    Pastel: ["Pastel Pink", "Pastel Purple", "Mint", "Baby Blue"],
    Monochrome: ["Jet Black", "Snow White", "Ash Gray", "Charcoal"],
    Luxury: ["Gold", "Silver", "Champagne", "Wine Red", "Midnight Purple"],
    MagicAcademy: ["Navy Blue", "Gold", "Burgundy", "Forest Green"]
  };

  const smartPersonalities = {
    Japanese: ["Polite", "Serene", "Mysterious", "Disciplined", "Graceful"],
    Cyberpunk: ["Rebellious", "Cynical", "Tech-Savvy", "Cool", "Resourceful"],
    Dreamcore: ["Whimsical", "Quiet", "Dreamy", "Gentle", "Mysterious"],
    Fantasy: ["Brave", "Curious", "Noble", "Mystic", "Adventurous"],
    Ocean: ["Calm", "Free-Spirited", "Playful", "Mysterious", "Gentle"],
    Royal: ["Proud", "Dignified", "Majestic", "Elegant", "Ambitious"],
    Nature: ["Gentle", "Peaceful", "Kind", "Nurturing", "Quiet"],
    Festival: ["Energetic", "Cheerful", "Playful", "Outgoing", "Lively"],
    Mystery: ["Enigmatic", "Quiet", "Brooding", "Observant", "Mysterious"],
    Space: ["Curious", "Solitary", "Philosophical", "Calm", "Dreamy"],
    Vintage: ["Nostalgic", "Gentle", "Sophisticated", "Quiet", "Charming"],
    Steampunk: ["Inventive", "Eccentric", "Curious", "Determined", "Bold"],
    Yokai: ["Mischievous", "Enigmatic", "Playful", "Sly", "Ancient"],
    StreetFashion: ["Confident", "Trendy", "Bold", "Cool", "Carefree"],
    Angel: ["Pure", "Compassionate", "Gentle", "Graceful", "Serene"],
    Demon: ["Mischievous", "Rebellious", "Proud", "Wild", "Cunning"],
    Fairy: ["Playful", "Whimsical", "Cheerful", "Mischievous", "Gentle"],
    Ghost: ["Melancholy", "Quiet", "Ethereal", "Gentle", "Sorrowful"],
    PostApocalyptic: ["Resilient", "Pragmatic", "Tough", "Cautious", "Resourceful"],
    SciFi: ["Logical", "Analytical", "Calm", "Curious", "Focused"],
    Medieval: ["Honorable", "Chivalrous", "Brave", "Stalwart", "Loyal"],
    Victorian: ["Elegant", "Reserved", "Sophisticated", "Polite", "Proper"],
    Gothic: ["Melancholy", "Mysterious", "Elegant", "Brooding", "Quiet"],
    DarkFantasy: ["Grim", "Determined", "Mysterious", "Solitary", "Fearless"],
    LightFantasy: ["Optimistic", "Kind", "Graceful", "Gentle", "Bright"],
    Mythology: ["Wise", "Majestic", "Ancient", "Proud", "Powerful"],
    AncientEgypt: ["Majestic", "Enigmatic", "Proud", "Calm", "Mystic"],
    AncientGreece: ["Philosophical", "Proud", "Artistic", "Noble", "Brave"],
    AncientChina: ["Serene", "Wise", "Graceful", "Poetic", "Calm"],
    AncientJapan: ["Disciplined", "Honorable", "Quiet", "Focused", "Loyal"],
    Samurai: ["Honorable", "Disciplined", "Loyal", "Fierce", "Calm"],
    Ninja: ["Stealthy", "Quiet", "Focused", "Cunning", "Observant"],
    Pirate: ["Daring", "Rebellious", "Charismatic", "Wild", "Free-Spirited"],
    Knight: ["Chivalrous", "Protective", "Loyal", "Brave", "Honorable"],
    Desert: ["Resilient", "Observant", "Calm", "Independent", "Mysterious"],
    Arctic: ["Solitary", "Calm", "Quiet", "Resilient", "Cool"],
    Jungle: ["Wild", "Agile", "Intuitive", "Free-Spirited", "Fierce"],
    Underwater: ["Ethereal", "Calm", "Mysterious", "Gentle", "Curious"],
    SkyKingdom: ["Free-Spirited", "Graceful", "Dreamy", "Proud", "Optimistic"],
    Cloudcore: ["Gentle", "Dreamy", "Soft-spoken", "Peaceful", "Quiet"],
    Lovecraftian: ["Eccentric", "Obsessive", "Enigmatic", "Unfathomable", "Solitary"],
    Witchcore: ["Clever", "Mysterious", "Independent", "Resourceful", "Eccentric"],
    Fairytale: ["Naive", "Kind", "Charming", "Gentle", "Optimistic"],
    Fairycore: ["Sweet", "Playful", "Whimsical", "Nature-Loving", "Gentle"],
    Voidcore: ["Quiet", "Solitary", "Enigmatic", "Cold", "Mysterious"],
    Cottagecore: ["Kind", "Warm", "Peaceful", "Simple", "Nurturing"],
    Angelcore: ["Pure", "Soft-hearted", "Gentle", "Serene", "Kind"],
    Devilcore: ["Wild", "Rebellious", "Fiery", "Bold", "Playful"],
    Royalcore: ["Proud", "Sophisticated", "Ambitious", "Commanding", "Elegant"],
    Techwear: ["Cool", "Focused", "Practical", "Calculated", "Quiet"],
    StreetPunk: ["Fiery", "Rebellious", "Outspoken", "Bold", "Wild"],
    Pastel: ["Sweet", "Cheerful", "Shy", "Friendly", "Cute"],
    Monochrome: ["Stoic", "Quiet", "Serious", "Observant", "Calm"],
    Luxury: ["Charming", "Glamorous", "Ambitious", "Confident", "Sophisticated"],
    MagicAcademy: ["Studious", "Curious", "Ambitious", "Clever", "Enthusiastic"]
  };

  // ===== RANDOM HELPER =====
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ===== RECENT OBJECTS TRACKING =====
  const recentObjects = [];
  const getUniqueObject = () => {
    let available = objects.filter((obj) => !recentObjects.includes(obj));
    if (available.length === 0) {
      recentObjects.length = 0;
      available = objects;
    }
    const obj = available[Math.floor(Math.random() * available.length)];
    recentObjects.push(obj);
    if (recentObjects.length > 10) {
      recentObjects.shift();
    }
    return obj;
  };

  // ===== LOCKED STATE =====
  const lockedState = {
    animal: false,
    theme: false,
    object: false,
    color: false,
    personality: false,
    clothing: false
  };

  // ===== SMART CONFIG STATE =====
  let smartConfig = {
    includeMGE: true,
    includeAnimals: true
  };

  try {
    const rawConfig = localStorage.getItem("cgSmartConfig");
    if (rawConfig) {
      const parsed = JSON.parse(rawConfig);
      if (typeof parsed === "object") smartConfig = { ...smartConfig, ...parsed };
    }
  } catch (e) {
    console.error("Error reading cgSmartConfig:", e);
  }

  function getSpeciesPool() {
    let pool = [];
    if (smartConfig.includeAnimals) pool.push(...animals);
    if (smartConfig.includeMGE) pool.push(...mgeRaces);
    return pool.length > 0 ? pool : animals;
  }

  // ===== RANDOM MODE =====
  const randomMode = () => ({
    animal: (lockedState.animal && currentResult?.animal) ? currentResult.animal : random(getSpeciesPool()),
    theme: (lockedState.theme && currentResult?.theme) ? currentResult.theme : random(themes),
    object: (lockedState.object && currentResult?.object) ? currentResult.object : random(objects),
    color: (lockedState.color && currentResult?.color) ? currentResult.color : random(colors),
    personality: (lockedState.personality && currentResult?.personality) ? currentResult.personality : random(personalities),
    clothing: (lockedState.clothing && currentResult?.clothing) ? currentResult.clothing : random(clothing)
  });

  // ===== SMART MATCH MODE =====
  const smartMode = () => {
    const speciesPool = getSpeciesPool();
    const animal = (lockedState.animal && currentResult?.animal) ? currentResult.animal : random(speciesPool);
    const possibleThemes = smartThemes[animal] || themes;
    const theme = (lockedState.theme && currentResult?.theme) ? currentResult.theme : random(possibleThemes);
    const possibleObjects = smartObjects[theme] || objects;
    const possibleClothing = smartclothing[theme] || clothing;
    const possibleColors = smartColors[theme] || colors;
    const possiblePersonalities = smartPersonalities[theme] || personalities;

    return {
      animal,
      theme,
      object: (lockedState.object && currentResult?.object) ? currentResult.object : random(possibleObjects),
      color: (lockedState.color && currentResult?.color) ? currentResult.color : random(possibleColors),
      personality: (lockedState.personality && currentResult?.personality) ? currentResult.personality : random(possiblePersonalities),
      clothing: (lockedState.clothing && currentResult?.clothing) ? currentResult.clothing : random(possibleClothing)
    };
  };

  // ===== APP STATE =====
  const MAX_SAVED_ITEMS = 50;
  let currentMode = "random"; // 'random' | 'smart'
  let currentResult = randomMode();
  let savedList = [];
  let pendingDeleteField = null; // { cardIndex, fieldKey, fieldLabel, fieldValue }
  let pendingAlertModal = null; // alert message string
  let pendingSmartModal = false; // boolean for settings modal
  let activeTraitPicker = null; // null | 'animal' | 'theme' | 'object' | 'color' | 'personality' | 'clothing'
  let traitSearchQuery = "";
  let traitSubFilter = "all"; // 'all' | 'mge' | 'animal'
  let showChipTranslations = false; // toggle for showing Thai translation tags on chips
  let showMainCardTranslations = false; // toggle for showing Thai translation on main character generator card
  try {
    const savedMainTrans = localStorage.getItem('cg_show_main_translations');
    if (savedMainTrans !== null) {
      showMainCardTranslations = savedMainTrans === 'true';
    }
  } catch (e) {}
  let savedSearchQuery = "";
  let isDailyMode = false; // toggle for daily challenge mode
  let isDailyAnimating = false; // guard against rapid clicks during 2-stage slide
  let dailyCountdownTimer = null;

  // ===== DAILY / ROUTINE QUEST CONFIG (ตั้งค่าโหมดและรอบวันที่นี่ หรือดึงสดจาก Google Sheet) =====
  // mode: '1': Random Everything | '2': Smart (เฉพาะสัตว์) | '3': Smart (Monster) | '4': Smart (สัตว์+Monster)
  // intervalDays: จำนวนวันต่อรอบ เช่น 1, 3, 7 วัน
  // startDate: วันที่เริ่มรอบเควสต์ในรูปแบบ 'YYYY-MM-DD' (เวลาไทย)
  const QUEST_CONFIG = {
    mode: '4',              // ดึงตาม Google Sheet ตารางที่ 3 (ค่าเริ่มต้น: 4 = Smart สัตว์+Monster)
    intervalDays: 1,        // สุ่มทุกๆ ? วัน (ค่าเริ่มต้น: 1 = Daily)
    startDate: '2026-10-06' // วันที่เริ่มตั้ง เช่น วันที่ 6 ต.ค.
  };

  // Helper to fetch live Daily Quest config directly from Google Sheet Table 3
  async function fetchQuestConfigFromSheet() {
    try {
      const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQfEtWV8M_ionTpWcgPqMBxO1G_Kf1BPDjEdea-NGu4imkbS_nNPeiHPQNttg8XrQJDP66LplqGd4y_/pub?gid=0&single=true&output=csv';
      const res = await fetch(csvUrl + '&t=' + Date.now());
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.split(/\r?\n/).map(l => l.split(','));
      let mode = null;
      let interval = null;
      for (let r = 0; r < lines.length; r++) {
        const row = lines[r];
        for (let c = 0; c < row.length; c++) {
          const cell = (row[c] || '').trim();
          if (cell.includes('ตัวสุ่มของวัน') && r + 1 < lines.length && lines[r + 1][c]) {
            mode = lines[r + 1][c].trim();
          }
          if (cell.includes('สุ่มทุกๆ') && r + 1 < lines.length && lines[r + 1][c]) {
            interval = parseInt(lines[r + 1][c].trim(), 10);
          }
        }
        if (mode !== null && interval !== null) break;
      }
      if (mode !== null || interval !== null) {
        if (window.CharacterGenerator && typeof window.CharacterGenerator.updateQuestConfigFromSheet === 'function') {
          window.CharacterGenerator.updateQuestConfigFromSheet({ mode, intervalDays: interval });
        }
      }
    } catch (_) {}
  }

  // ===== DETERMINISTIC PRNG PER CYCLE =====
  function getDailySeed() {
    const now = new Date();
    // Convert current time to Bangkok time (UTC+7)
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
    const bkkNow = new Date(utcNow + (3600000 * 7));

    // Parse startDate (Bangkok local date)
    const [sY, sM, sD] = (QUEST_CONFIG.startDate || '2026-10-06').split('-').map(Number);
    // UTC timestamp corresponding to start date 00:00:00 Bangkok time
    const startBkkMs = Date.UTC(sY, sM - 1, sD, 0 - 7, 0, 0);

    const interval = Math.max(1, QUEST_CONFIG.intervalDays || 1);
    const intervalMs = interval * 86400000;

    // Elapsed milliseconds since startDate 00:00:00 Bangkok time
    const elapsedMs = now.getTime() - startBkkMs;
    const cycleIndex = elapsedMs >= 0 ? Math.floor(elapsedMs / intervalMs) : 0;

    // Start & End timestamps of the current cycle (Bangkok midnight boundaries)
    const currentCycleStartMs = startBkkMs + (cycleIndex * intervalMs);
    const currentCycleEndMs = currentCycleStartMs + intervalMs; // Midnight ending the last day

    // Clean Bangkok dates without duplicate offsets
    const startBkkDate = new Date(currentCycleStartMs);
    const endBkkLastDay = new Date(currentCycleEndMs - 1000);

    const todayStr = bkkNow.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric' });
    const cycleRangeStr = interval === 1
      ? todayStr
      : `${startBkkDate.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short' })} - ${endBkkLastDay.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric' })}`;

    return {
      dateKey: `quest_v4_${interval}_${QUEST_CONFIG.mode}_${cycleIndex}_${sY}-${sM}-${sD}`,
      cycleIndex,
      interval,
      currentCycleEndMs,
      bkkNow,
      formattedThai: todayStr,
      cycleRangeStr
    };
  }

  function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function getDailyChallengeResult() {
    const seedInfo = getDailySeed();
    let hash = 0;
    for (let i = 0; i < seedInfo.dateKey.length; i++) {
      hash = ((hash << 5) - hash) + seedInfo.dateKey.charCodeAt(i);
      hash |= 0;
    }
    const rng = mulberry32(Math.abs(hash) + 54321);
    const pick = (arr) => arr[Math.floor(rng() * arr.length)];

    let animal, theme, object, color, personality, clothingVal;

    if (QUEST_CONFIG.mode === '1') {
      // 1 · Random Everything (100% อิสระ)
      const speciesPool = [...animals, ...mgeRaces];
      animal = pick(speciesPool);
      theme = pick(themes);
      object = pick(objects);
      color = pick(colors);
      personality = pick(personalities);
      clothingVal = pick(clothing);
    } else if (QUEST_CONFIG.mode === '2') {
      // 2 · Smart Match (เฉพาะสัตว์ Animals)
      animal = pick(animals);
      const possibleThemes = smartThemes[animal] || themes;
      theme = pick(possibleThemes);
      const possibleObjects = smartObjects[theme] || objects;
      const possibleClothing = smartclothing[theme] || clothing;
      const possibleColors = smartColors[theme] || colors;
      const possiblePersonalities = smartPersonalities[theme] || personalities;
      object = pick(possibleObjects);
      color = pick(possibleColors);
      personality = pick(possiblePersonalities);
      clothingVal = pick(possibleClothing);
    } else if (QUEST_CONFIG.mode === '3') {
      // 3 · Smart Match (เฉพาะเผ่าพันธุ์ Monster Girl)
      animal = pick(mgeRaces);
      const possibleThemes = smartThemes[animal] || themes;
      theme = pick(possibleThemes);
      const possibleObjects = smartObjects[theme] || objects;
      const possibleClothing = smartclothing[theme] || clothing;
      const possibleColors = smartColors[theme] || colors;
      const possiblePersonalities = smartPersonalities[theme] || personalities;
      object = pick(possibleObjects);
      color = pick(possibleColors);
      personality = pick(possiblePersonalities);
      clothingVal = pick(possibleClothing);
    } else {
      // 4 · Smart Match (ทั้งสองอย่าง สัตว์ + Monster)
      const speciesPool = [...animals, ...mgeRaces];
      animal = pick(speciesPool);
      const possibleThemes = smartThemes[animal] || themes;
      theme = pick(possibleThemes);
      const possibleObjects = smartObjects[theme] || objects;
      const possibleClothing = smartclothing[theme] || clothing;
      const possibleColors = smartColors[theme] || colors;
      const possiblePersonalities = smartPersonalities[theme] || personalities;
      object = pick(possibleObjects);
      color = pick(possibleColors);
      personality = pick(possiblePersonalities);
      clothingVal = pick(possibleClothing);
    }

    return {
      animal,
      theme,
      object,
      color,
      personality,
      clothing: clothingVal,
      dateKey: seedInfo.dateKey,
      formattedThai: seedInfo.formattedThai,
      cycleRangeStr: seedInfo.cycleRangeStr
    };
  }

  // ===== DAILY THEME & COLOR GENERATOR (SURFACE & PRIMARY) =====
  function hslToHexStr(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return '#' + f(0) + f(8) + f(4);
  }

  function getColorHueFromName(name) {
    if (!name) return 35;
    const n = name.toLowerCase();
    if (n.includes('pink') || n.includes('rose') || n.includes('magenta')) return 330;
    if (n.includes('red') || n.includes('crimson') || n.includes('ruby')) return 4;
    if (n.includes('orange') || n.includes('amber') || n.includes('coral') || n.includes('terracotta') || n.includes('peach') || n.includes('cream')) return 26;
    if (n.includes('gold') || n.includes('yellow')) return 48;
    if (n.includes('lime') || n.includes('mint')) return 120;
    if (n.includes('green') || n.includes('emerald') || n.includes('forest') || n.includes('jade')) return 145;
    if (n.includes('teal') || n.includes('cyan') || n.includes('aqua')) return 175;
    if (n.includes('blue') || n.includes('sky') || n.includes('azure') || n.includes('navy')) return 215;
    if (n.includes('purple') || n.includes('violet') || n.includes('indigo') || n.includes('lavender')) return 270;
    if (n.includes('brown') || n.includes('bronze') || n.includes('copper')) return 25;
    return 35;
  }

  function getDailyThemePalette(colorName) {
    const baseHue = getColorHueFromName(colorName);
    const bg = hslToHexStr(baseHue, 16, 96);
    const cardBg = hslToHexStr(baseHue, 22, 92);
    const surfaceAlt = hslToHexStr(baseHue, 24, 87);
    let primaryHue = (baseHue + 20) % 360;
    if (baseHue > 170 && baseHue < 260) {
      primaryHue = (baseHue + 150) % 360;
    }
    const primary = hslToHexStr(primaryHue, 84, 52);
    const text = '#181615';
    const text2 = '#6a655f';
    const text3 = '#969087';
    const line = 'rgba(24, 22, 21, 0.08)';
    const line2 = 'rgba(24, 22, 21, 0.16)';
    return { bg, cardBg, surfaceAlt, primary, text, text2, text3, line, line2 };
  }

  // ===== SITE-WIDE DYNAMIC THEME COLOR SWITCHING =====
  let previousThemeSnapshot = null;

  function applyDailyTheme(palette) {
    if (!palette) return;
    const docEl = document.documentElement;
    if (!previousThemeSnapshot) {
      previousThemeSnapshot = {
        dataTheme: docEl.getAttribute('data-theme'),
        dataThemeMode: docEl.getAttribute('data-theme-mode'),
        styles: {}
      };
      const keys = ['--bg', '--bg2', '--bg3', '--line', '--line2', '--text', '--text2', '--text3', '--accent', '--primary', '--secondary'];
      keys.forEach(k => {
        previousThemeSnapshot.styles[k] = docEl.style.getPropertyValue(k);
      });
    }

    docEl.style.setProperty('--bg', palette.bg);
    docEl.style.setProperty('--bg2', palette.cardBg);
    docEl.style.setProperty('--bg3', palette.surfaceAlt);
    docEl.style.setProperty('--line', palette.line);
    docEl.style.setProperty('--line2', palette.line2);
    docEl.style.setProperty('--text', palette.text);
    docEl.style.setProperty('--text2', palette.text2);
    docEl.style.setProperty('--text3', palette.text3);
    docEl.style.setProperty('--accent', palette.primary);
    docEl.style.setProperty('--primary', palette.primary);
    docEl.setAttribute('data-theme', 'light');
    docEl.setAttribute('data-daily-theme', 'active');
  }

  function revertDailyTheme() {
    const docEl = document.documentElement;
    if (previousThemeSnapshot) {
      const keys = ['--bg', '--bg2', '--bg3', '--line', '--line2', '--text', '--text2', '--text3', '--accent', '--primary', '--secondary'];
      keys.forEach(k => {
        if (previousThemeSnapshot.styles[k]) {
          docEl.style.setProperty(k, previousThemeSnapshot.styles[k]);
        } else {
          docEl.style.removeProperty(k);
        }
      });
      if (previousThemeSnapshot.dataTheme) {
        docEl.setAttribute('data-theme', previousThemeSnapshot.dataTheme);
      } else {
        docEl.removeAttribute('data-theme');
      }
      if (previousThemeSnapshot.dataThemeMode) {
        docEl.setAttribute('data-theme-mode', previousThemeSnapshot.dataThemeMode);
      } else {
        docEl.removeAttribute('data-theme-mode');
      }
      docEl.removeAttribute('data-daily-theme');
      previousThemeSnapshot = null;
    }
  }

  // ===== REALTIME COUNTDOWN TIMER (Countdown to Cycle End Midnight) =====
  function updateDailyCountdownDOM() {
    const el = document.getElementById("cg-daily-countdown-time");
    if (!el) return;
    const seedInfo = getDailySeed();
    const now = new Date();

    let diffMs = seedInfo.currentCycleEndMs - now.getTime();
    if (diffMs <= 0) diffMs = 0;

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const pad = (n) => String(n).padStart(2, '0');

    if (days > 0) {
      el.textContent = `${days}วัน ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
      el.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
  }

  function startDailyCountdown() {
    stopDailyCountdown();
    updateDailyCountdownDOM();
    dailyCountdownTimer = setInterval(updateDailyCountdownDOM, 1000);
  }

  function stopDailyCountdown() {
    if (dailyCountdownTimer) {
      clearInterval(dailyCountdownTimer);
      dailyCountdownTimer = null;
    }
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ===== CUSTOM THEME-MATCHED TOOLTIP (POPUPS & MOBILE LONG-PRESS) =====
  let cgTooltipEl = null;
  let cgLongPressTimer = null;
  let cgTouchStartPos = { x: 0, y: 0 };
  let cgDidLongPress = false;
  let cgSuppressClickUntil = 0;
  let cgIsTooltipOpen = false;

  function ensureCGTooltipEl() {
    if (!cgTooltipEl || !document.body.contains(cgTooltipEl)) {
      let el = document.getElementById("cg-tooltip-popup");
      if (!el) {
        el = document.createElement("div");
        el.id = "cg-tooltip-popup";
        el.className = "cg-tooltip-popup";
        document.body.appendChild(el);
      }
      cgTooltipEl = el;
    }
    return cgTooltipEl;
  }

  function showCGTooltip(targetEl, enWord, extraHint = "") {
    const tt = ensureCGTooltipEl();
    if (!tt || !targetEl) return;

    const parsed = parseTranslation(enWord);
    if (!parsed.full && !extraHint) return;

    let contentHTML = `
      <div class="cg-tt-header">
        <span class="cg-tt-en">${escapeHTML(enWord)}</span>
        ${parsed.main ? `<span class="cg-tt-th">${escapeHTML(parsed.main)}</span>` : ''}
        <button type="button" class="cg-tt-close-btn" onclick="event.stopPropagation(); CharacterGenerator.hideWordTooltip();" title="ปิด">✕</button>
      </div>
    `;

    if (parsed.desc) {
      contentHTML += `
        <div class="cg-tt-desc">
          <span class="cg-tt-desc-tag">คำอธิบาย</span>
          <span class="cg-tt-desc-text">${escapeHTML(parsed.desc)}</span>
        </div>
      `;
    }

    if (extraHint) {
      contentHTML += `<div class="cg-tt-hint">${escapeHTML(extraHint)}</div>`;
    }

    tt.innerHTML = contentHTML;
    tt.style.display = "block";
    tt.classList.remove("show");

    const rect = targetEl.getBoundingClientRect();
    const ttRect = tt.getBoundingClientRect();

    const edgeMargin = 16;
    const gap = 8;

    // Default to ABOVE the target element as requested by user
    let top = rect.top - ttRect.height - gap;

    // If not enough room above and fits below, flip below:
    if (top < edgeMargin) {
      const topBelow = rect.bottom + gap;
      if (topBelow + ttRect.height <= window.innerHeight - edgeMargin) {
        top = topBelow;
      } else {
        top = edgeMargin;
      }
    }

    // Horizontal centering with safe edge margins so it never clings to edges
    let left = rect.left + (rect.width / 2) - (ttRect.width / 2);
    if (left < edgeMargin) {
      left = edgeMargin;
    }
    if (left + ttRect.width > window.innerWidth - edgeMargin) {
      left = window.innerWidth - ttRect.width - edgeMargin;
    }

    tt.style.top = `${Math.round(top)}px`;
    tt.style.left = `${Math.round(left)}px`;
    cgIsTooltipOpen = true;

    requestAnimationFrame(() => {
      tt.classList.add("show");
    });
  }

  function hideCGTooltip() {
    if (cgLongPressTimer) {
      clearTimeout(cgLongPressTimer);
      cgLongPressTimer = null;
    }
    cgIsTooltipOpen = false;
    const tt = document.getElementById("cg-tooltip-popup");
    if (tt) {
      tt.classList.remove("show");
      tt.style.display = "none";
    }
  }

  // Auto dismiss tooltip on outside touch
  document.addEventListener('touchstart', (e) => {
    if (cgIsTooltipOpen && !e.target.closest('#cg-tooltip-popup, .cg-picker-chip, .cg-result-val-link, .cg-pin-link')) {
      hideCGTooltip();
    }
  }, { passive: true });

  // Auto dismiss tooltip on scroll so it doesn't float disconnected
  window.addEventListener('scroll', () => {
    if (cgIsTooltipOpen) hideCGTooltip();
  }, { passive: true });

  document.addEventListener('scroll', (e) => {
    if (cgIsTooltipOpen && e.target && e.target.closest && e.target.closest('.cg-modal, .cg-picker-grid, .cg-modal-body, .cg-app')) {
      hideCGTooltip();
    }
  }, { capture: true, passive: true });

  // Suppress accidental click/navigation after mobile long-press
  document.addEventListener('click', (e) => {
    if (Date.now() < cgSuppressClickUntil) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);

  // ===== UNDO / REDO HISTORY =====
  const undoHistory = [];
  const redoHistory = [];
  const MAX_CG_HISTORY = 40;

  function captureCGState() {
    return {
      result: { ...currentResult },
      locked: { ...lockedState },
      mode: currentMode
    };
  }

  function pushCGHistory() {
    undoHistory.push(captureCGState());
    if (undoHistory.length > MAX_CG_HISTORY) undoHistory.shift();
    redoHistory.length = 0;
  }

  // ===== VECTOR / SVG ICONS (VECTOR SEARCH ICON AS REQUESTED) =====
  const SVG_ICONS = {
    search: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    translate: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`
  };

  function renderValLinkContent(val) {
    const escapedVal = escapeHTML(val);
    if (!showMainCardTranslations) {
      return `
        <span class="cg-val-text">${escapedVal}</span>
        <span class="cg-arrow">&gt;</span>
      `;
    }
    const parsed = parseTranslation(val);
    const thMain = parsed.main || getThaiTranslation(val);
    if (thMain) {
      return `
        <div class="cg-val-text-stack">
          <span class="cg-val-th">${escapeHTML(thMain)}</span>
          <span class="cg-val-en-sub">${escapedVal}</span>
        </div>
        <span class="cg-arrow">&gt;</span>
      `;
    }
    return `
      <span class="cg-val-text">${escapedVal}</span>
      <span class="cg-arrow">&gt;</span>
    `;
  }

  function updateCardDOMFromState(state) {
    const card = document.getElementById("cg-card");
    if (!card || !state || !state.result) return;

    Object.entries(state.result).forEach(([key, val]) => {
      if (key === '_id') return;
      const row = card.querySelector(`.cg-result-row[data-key="${key}"]`);
      if (!row) return;

      const isLocked = !!state.locked[key];
      row.classList.toggle('is-locked-row', isLocked);

      const valLink = row.querySelector('.cg-result-val-link');
      if (valLink) {
        valLink.href = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(val)}`;
        valLink.removeAttribute('title');
        const escapedVal = escapeHTML(val).replace(/'/g, "\\'");
        valLink.setAttribute('onmouseenter', `CharacterGenerator.showWordTooltip(this, '${escapedVal}', 'คลิกเพื่อค้นหาภาพไอเดียบน Pinterest')`);
        valLink.setAttribute('ontouchstart', `CharacterGenerator.onWordTouchStart(event, this, '${escapedVal}', 'คลิกเพื่อค้นหาภาพไอเดียบน Pinterest')`);
        valLink.setAttribute('ontouchend', `CharacterGenerator.onWordTouchEnd(event)`);
        valLink.setAttribute('ontouchmove', `CharacterGenerator.onWordTouchMove(event)`);
        valLink.innerHTML = renderValLinkContent(val);
      }

      const lockBtn = row.querySelector('.cg-lock-btn');
      if (lockBtn) {
        lockBtn.classList.toggle('locked', isLocked);
        lockBtn.textContent = isLocked ? '🔒' : '🔓';
        lockBtn.title = isLocked ? 'ปลดล็อก' : 'ล็อกค่านี้ไว้';
      }

      if (key === 'animal') {
        const isMGE = mgeRaces.includes(val);
        const iconEl = row.querySelector('.cg-icon');
        const textEl = row.querySelector('.cg-key-text');
        if (iconEl) iconEl.textContent = isMGE ? "🧜‍♀️" : "🐱";
        if (textEl) textEl.textContent = isMGE ? "Species" : "Animal";
      }
    });
  }

  function cgUndo(isSwipe = false) {
    if (undoHistory.length === 0) {
      showCGToast('ไม่มีประวัติย้อนกลับแล้ว');
      return;
    }
    redoHistory.push(captureCGState());
    const prev = undoHistory.pop();
    currentResult = { ...prev.result };
    Object.assign(lockedState, prev.locked);
    currentMode = prev.mode;

    if (isSwipe) {
      updateCardDOMFromState(prev);
    } else {
      renderApp();
    }
  }

  function cgRedo(isSwipe = false) {
    if (redoHistory.length === 0) {
      showCGToast('ไม่มีการทำซ้ำแล้ว');
      return;
    }
    undoHistory.push(captureCGState());
    const next = redoHistory.pop();
    currentResult = { ...next.result };
    Object.assign(lockedState, next.locked);
    currentMode = next.mode;

    if (isSwipe) {
      updateCardDOMFromState(next);
    } else {
      renderApp();
    }
  }

  function showCGToast(msg) {
    if (typeof showToast === 'function') {
      showToast(msg);
      return;
    }
    let toast = document.getElementById('cg-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cg-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #f0f0f0;
        color: #0d0d0d;
        padding: 8px 18px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        z-index: 100000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: inherit;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2000);
  }

  // Load saved list from LocalStorage
  try {
    const raw = localStorage.getItem("savedCharacters");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) savedList = parsed;
    }
  } catch (e) {
    console.error("Error reading savedCharacters:", e);
  }

  // ===== TRAIT PICKER HELPERS =====
  function getTraitPool(key, subFilter = traitSubFilter) {
    switch (key) {
      case 'animal':
        if (subFilter === 'mge') {
          return mgeRaces;
        } else if (subFilter === 'animal') {
          return animals;
        } else {
          // 'all': combine both if enabled, put MGE first so they are easily accessible
          let pool = [];
          if (smartConfig.includeMGE) pool.push(...mgeRaces);
          if (smartConfig.includeAnimals) pool.push(...animals);
          return pool.length > 0 ? pool : animals;
        }
      case 'theme':
        return themes;
      case 'object':
        return objects;
      case 'color':
        return colors;
      case 'personality':
        return personalities;
      case 'clothing':
        return clothing;
      default:
        return [];
    }
  }

  function getPickerModalMeta(key, subFilter = traitSubFilter) {
    if (key === 'animal') {
      const bothEnabled = smartConfig.includeMGE && smartConfig.includeAnimals;
      if (!bothEnabled) {
        if (smartConfig.includeMGE) return { label: "Species (เผ่าพันธุ์ MGE)", icon: "🧜‍♀️" };
        return { label: "Animal (สัตว์ทั่วไป)", icon: "🐱" };
      }
      if (subFilter === 'mge') {
        return { label: "Species (เผ่าพันธุ์ MGE)", icon: "🧜‍♀️" };
      } else if (subFilter === 'animal') {
        return { label: "Animal (สัตว์ทั่วไป)", icon: "🐱" };
      } else {
        return { label: "Species / Animal (ทั้งหมด)", icon: "🧬" };
      }
    }
    const defaultMeta = {
      theme: { label: "Theme", icon: "✨" },
      object: { label: "Object", icon: "🔮" },
      color: { label: "Color", icon: "🎨" },
      personality: { label: "Personality", icon: "🎭" },
      clothing: { label: "Clothing", icon: "👗" }
    };
    return defaultMeta[key] || { label: key, icon: "🔍" };
  }

  function buildTraitPickerChipsHTML(key, query, subFilter = traitSubFilter) {
    const pool = getTraitPool(key, subFilter);
    const q = (query || '').trim().toLowerCase();
    const items = q ? pool.filter(item => matchTraitQuery(item, q)) : pool;
    const currentVal = currentResult[key];

    if (items.length === 0) {
      return `
        <div class="cg-empty-state" style="padding: 24px 16px;">
          <div class="cg-empty-icon">${SVG_ICONS.search}</div>
          <p class="cg-empty-title">ไม่พบคำที่ตรงกับ "${escapeHTML(query)}"</p>
          <p class="cg-empty-sub">ลองพิมพ์ค้นหาด้วยคำอื่น (ค้นหาได้ทั้งภาษาไทยและอังกฤษ) หรือกดปุ่มล้างการค้นหา</p>
          <button type="button" class="cg-modal-btn cg-modal-btn-cancel" style="margin-top: 10px; display: inline-flex; width: auto; padding: 6px 16px;" onclick="CharacterGenerator.clearTraitSearch()">ล้างการค้นหา</button>
        </div>
      `;
    }

    return `
      <div class="cg-picker-grid">
        ${items.map(val => {
          const isCurrent = val === currentVal;
          const parsed = parseTranslation(val);
          const showThaiTag = showChipTranslations && parsed.main;
          const escapedVal = escapeHTML(val).replace(/'/g, "\\'");
          return `
            <button
              type="button"
              class="cg-picker-chip ${isCurrent ? 'active' : ''}"
              onclick="CharacterGenerator.selectTrait('${key}', '${escapedVal}')"
              onmouseenter="CharacterGenerator.showWordTooltip(this, '${escapedVal}')"
              onmouseleave="CharacterGenerator.hideWordTooltip()"
              ontouchstart="CharacterGenerator.onWordTouchStart(event, this, '${escapedVal}')"
              ontouchend="CharacterGenerator.onWordTouchEnd(event)"
              ontouchmove="CharacterGenerator.onWordTouchMove(event)"
            >
              <span class="cg-chip-en">${val}</span>
              ${showThaiTag ? `<span class="cg-chip-th-fixed">${escapeHTML(parsed.main)}</span>` : ''}
              ${isCurrent ? '<span class="cg-picker-check">✓</span>' : ''}
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  function updateTraitPickerDOM() {
    const body = document.getElementById("cg-picker-body");
    const countEl = document.getElementById("cg-picker-count");
    if (!body || !activeTraitPicker) return;

    // Update modal title dynamically
    const titleEl = document.getElementById("cg-picker-modal-title");
    if (titleEl) {
      const meta = getPickerModalMeta(activeTraitPicker, traitSubFilter);
      titleEl.innerHTML = `<span>${meta.icon}</span> <span>เลือก ${meta.label}</span>`;
    }

    // Update sub-tabs active state
    const tabBtns = document.querySelectorAll(".cg-picker-tab");
    tabBtns.forEach(btn => {
      const filterAttr = btn.getAttribute("data-filter");
      if (filterAttr) {
        btn.classList.toggle("active", filterAttr === traitSubFilter);
      }
    });

    // Update translation toggle button state
    const transBtn = document.getElementById("cg-picker-trans-btn");
    if (transBtn) {
      transBtn.classList.toggle("active", showChipTranslations);
      transBtn.innerHTML = `<span class="cg-picker-trans-icon">${SVG_ICONS.translate}</span> <span>${showChipTranslations ? 'คำแปลไทย' : 'แสดงคำแปล'}</span>`;
      transBtn.title = showChipTranslations ? 'คลิกเพื่อซ่อนคำแปลบนชิป' : 'คลิกเพื่อแสดงคำแปลไทยบนชิป';
    }

    const pool = getTraitPool(activeTraitPicker, traitSubFilter);
    const q = (traitSearchQuery || '').trim().toLowerCase();
    const items = q ? pool.filter(item => matchTraitQuery(item, q)) : pool;

    if (countEl) {
      countEl.textContent = q
        ? `พบ ${items.length} จาก ${pool.length} คำ`
        : `ทั้งหมด ${pool.length} คำ`;
    }

    body.innerHTML = buildTraitPickerChipsHTML(activeTraitPicker, traitSearchQuery, traitSubFilter);

    const searchBar = document.querySelector(".cg-picker-search-bar");
    if (searchBar) {
      const existingClear = searchBar.querySelector(".cg-picker-search-clear");
      if (traitSearchQuery) {
        if (!existingClear) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "cg-picker-search-clear";
          btn.title = "ล้างการค้นหา";
          btn.textContent = "✕";
          btn.onclick = () => window.CharacterGenerator.clearTraitSearch();
          searchBar.appendChild(btn);
        }
      } else if (existingClear) {
        existingClear.remove();
      }
    }
  }

  // ===== SAVED RESULTS FILTERING HELPERS =====
  function getFilteredSavedList() {
    const q = (savedSearchQuery || '').trim().toLowerCase();
    const indexedSaved = savedList.map((item, origIndex) => ({ item, origIndex }));
    if (!q) return { items: indexedSaved, isFiltered: false, total: savedList.length };

    const filtered = indexedSaved.filter(({ item }) => {
      const fields = [item.animal, item.theme, item.object, item.color, item.personality, item.clothing].filter(Boolean);
      return fields.some(val => matchTraitQuery(val, q));
    });
    return { items: filtered, isFiltered: true, total: savedList.length };
  }

  function buildSavedCardsHTML(filteredData) {
    const { items, isFiltered, total } = filteredData;
    if (total === 0) {
      return `
        <div class="cg-empty-state">
          <div class="cg-empty-icon">📁</div>
          <p class="cg-empty-title">ยังไม่มีรายการที่บันทึกไว้</p>
          <p class="cg-empty-sub">กดปุ่ม ⭐ Save ด้านบนเพื่อบันทึกไอเดียตัวละครที่ชอบ</p>
        </div>
      `;
    }
    if (isFiltered && items.length === 0) {
      return `
        <div class="cg-empty-state">
          <div class="cg-empty-icon">${SVG_ICONS.search}</div>
          <p class="cg-empty-title">ไม่พบการ์ดที่ตรงกับ "${escapeHTML(savedSearchQuery)}"</p>
          <p class="cg-empty-sub">ลองค้นหาด้วยชื่อสัตว์, ธีม, สิ่งของ, สี หรือเสื้อผ้าอื่น</p>
          <button type="button" class="cg-modal-btn cg-modal-btn-cancel" style="margin-top: 14px; display: inline-flex; width: auto; padding: 6px 18px;" onclick="CharacterGenerator.clearSavedSearch()">ล้างการค้นหา</button>
        </div>
      `;
    }

    return items.map(({ item, origIndex }) => {
      if (!item._id) {
        item._id = 'cg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      }

      const isItemMGE = mgeRaces.includes(item.animal);
      const itemSpeciesInfo = isItemMGE
        ? { label: "Species", icon: "🧜‍♀️" }
        : { label: "Animal", icon: "🐱" };

      const fields = [
        { key: "animal", ...itemSpeciesInfo },
        { key: "theme", label: "Theme", icon: "✨" },
        { key: "object", label: "Object", icon: "🔮" },
        { key: "color", label: "Color", icon: "🎨" },
        { key: "personality", label: "Personality", icon: "🎭" },
        { key: "clothing", label: "Clothing", icon: "👗" }
      ];

      const rowsHTML = fields
        .filter(f => item[f.key])
        .map(f => {
          const val = item[f.key];
          const th = getThaiTranslation(val);
          const titleStr = th ? `${val} (${th}) • คลิกเพื่อค้นหาภาพไอเดียบน Pinterest` : `ค้นหา ${val} ใน Pinterest`;
          return `
          <div class="cg-saved-row">
            <span class="cg-saved-key"><span class="cg-saved-key-icon">${f.icon}</span> ${f.label}</span>
            <div class="cg-saved-val-group">
              <a
                href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(val)}"
                target="_blank"
                rel="noopener noreferrer"
                class="cg-pin-link"
                onmouseenter="CharacterGenerator.showWordTooltip(this, '${escapeHTML(val).replace(/'/g, "\\'")}', 'ค้นหาบน Pinterest')"
                onmouseleave="CharacterGenerator.hideWordTooltip()"
                ontouchstart="CharacterGenerator.onWordTouchStart(event, this, '${escapeHTML(val).replace(/'/g, "\\'")}', 'ค้นหาบน Pinterest')"
                ontouchend="CharacterGenerator.onWordTouchEnd(event)"
                ontouchmove="CharacterGenerator.onWordTouchMove(event)"
              >
                ${renderValLinkContent(val)}
              </a>
              <button class="cg-row-delete-btn" onclick="CharacterGenerator.confirmDeleteField(${origIndex}, '${f.key}', '${f.label}', '${escapeHTML(val)}')" title="ลบเฉพาะ ${f.label}">✕</button>
            </div>
          </div>
        `;
        }).join("");

      const queryTerms = fields.map(f => item[f.key]).filter(Boolean);
      const fullQuery = queryTerms.join(" ");

      const isFirst = origIndex === 0;
      const isLast = origIndex === savedList.length - 1;

      return `
        <div class="cg-saved-card" data-index="${origIndex}" data-id="${item._id}">
          <div class="cg-saved-content">
            ${rowsHTML}
          </div>

          <div class="cg-saved-footer">
            <div class="cg-order-group">
              <button class="cg-order-btn" onclick="CharacterGenerator.moveSaved(${origIndex}, -1)" ${isFirst || isFiltered ? 'disabled' : ''} title="${isFiltered ? 'ไม่สามารถเรียงลำดับขณะค้นหาได้' : 'เลื่อนขึ้น'}">▲</button>
              <button class="cg-order-btn" onclick="CharacterGenerator.moveSaved(${origIndex}, 1)" ${isLast || isFiltered ? 'disabled' : ''} title="${isFiltered ? 'ไม่สามารถเรียงลำดับขณะค้นหาได้' : 'เลื่อนลง'}">▼</button>
            </div>

            <a href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(fullQuery)}" target="_blank" rel="noopener noreferrer" class="cg-search-all-btn">
              ${SVG_ICONS.search} <span>ค้นหาภาพใน Pinterest</span>
            </a>
            <button class="cg-edit-btn" onclick="CharacterGenerator.editSaved(${origIndex})" title="นำข้อมูลนี้กลับไปที่กล่องสุ่มและล็อกไว้">⚙️</button>
            <button class="cg-delete-btn" onclick="CharacterGenerator.deleteSaved(${origIndex})" title="ลบทั้งการ์ด">🗑️ <span>ลบ</span></button>
          </div>
        </div>
      `;
    }).join("");
  }

  function updateSavedListDOM() {
    const filteredData = getFilteredSavedList();
    const countBadge = document.getElementById("cg-saved-count-badge");
    if (countBadge) {
      countBadge.textContent = filteredData.isFiltered
        ? `พบ ${filteredData.items.length} จาก ${filteredData.total} / ${MAX_SAVED_ITEMS}`
        : `${filteredData.total} / ${MAX_SAVED_ITEMS}`;
    }

    const grid = document.getElementById("cg-saved-grid");
    if (grid) {
      grid.innerHTML = buildSavedCardsHTML(filteredData);
    }

    const searchBox = document.querySelector(".cg-saved-search-box");
    if (searchBox) {
      const existingClear = searchBox.querySelector(".cg-saved-search-clear");
      if (savedSearchQuery) {
        if (!existingClear) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "cg-saved-search-clear";
          btn.title = "ล้างการค้นหา";
          btn.textContent = "✕";
          btn.onclick = () => window.CharacterGenerator.clearSavedSearch();
          searchBox.appendChild(btn);
        }
      } else if (existingClear) {
        existingClear.remove();
      }
    }
  }

  // ===== RENDER ENGINE =====
  function renderApp() {
    const root = document.getElementById("character-generator-root");
    if (!root) return;

    const isRandom = currentMode === "random";
    const isSmart = currentMode === "smart";

    const getSpeciesLabel = () => {
      if (smartConfig.includeMGE && !smartConfig.includeAnimals) {
        return { label: "Species", icon: "🧜‍♀️" };
      } else if (smartConfig.includeMGE && smartConfig.includeAnimals) {
        return { label: "Species", icon: "🧬" };
      } else {
        return { label: "Animal", icon: "🐱" };
      }
    };

    const speciesInfo = getSpeciesLabel();

    const keyLabels = {
      animal: speciesInfo,
      theme: { label: "Theme", icon: "✨" },
      object: { label: "Object", icon: "🔮" },
      color: { label: "Color", icon: "🎨" },
      personality: { label: "Personality", icon: "🎭" },
      clothing: { label: "Clothing", icon: "👗" }
    };

    // Filtered Saved items
    const filteredSaved = getFilteredSavedList();
    const savedBadgeText = filteredSaved.isFiltered
      ? `พบ ${filteredSaved.items.length} จาก ${filteredSaved.total} / ${MAX_SAVED_ITEMS}`
      : `${filteredSaved.total} / ${MAX_SAVED_ITEMS}`;
    const savedCardsHTML = buildSavedCardsHTML(filteredSaved);

    // Build result entries HTML (Filtered to exclude internal _id property)
    const resultEntries = Object.entries(currentResult)
      .filter(([key]) => key !== "_id")
      .map(([key, val]) => {
        const isCurrentMGE = key === "animal" && mgeRaces.includes(val);
        const meta = key === "animal"
          ? (isCurrentMGE ? { label: "Species", icon: "🧜‍♀️" } : { label: "Animal", icon: "🐱" })
          : (keyLabels[key] || { label: key, icon: "✨" });
        const isLocked = !!lockedState[key];
        return `
          <div class="cg-result-row ${isLocked ? 'is-locked-row' : ''}" data-key="${key}">
            <button type="button" class="cg-result-key-btn" onclick="CharacterGenerator.openTraitPicker('${key}')" title="คลิกเพื่อค้นหา / เลือก ${meta.label}">
              <span class="cg-icon">${meta.icon}</span>
              <span class="cg-key-text">${meta.label}</span>
              <span class="cg-key-search-icon" aria-hidden="true">${SVG_ICONS.search}</span>
            </button>
            <div class="cg-result-right">
              ${(() => {
                const escapedVal = escapeHTML(val).replace(/'/g, "\\'");
                return `
                <a
                  href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(val)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cg-result-val-link"
                  onmouseenter="CharacterGenerator.showWordTooltip(this, '${escapedVal}', 'คลิกเพื่อค้นหาภาพไอเดียบน Pinterest')"
                  onmouseleave="CharacterGenerator.hideWordTooltip()"
                  ontouchstart="CharacterGenerator.onWordTouchStart(event, this, '${escapedVal}', 'คลิกเพื่อค้นหาภาพไอเดียบน Pinterest')"
                  ontouchend="CharacterGenerator.onWordTouchEnd(event)"
                  ontouchmove="CharacterGenerator.onWordTouchMove(event)"
                >
                  ${renderValLinkContent(val)}
                </a>
                `;
              })()}
              <button class="cg-lock-btn ${isLocked ? 'locked' : ''}" data-key="${key}" onclick="CharacterGenerator.toggleLock('${key}')" title="${isLocked ? 'ปลดล็อก' : 'ล็อกค่านี้ไว้'}">
                ${isLocked ? '🔒' : '🔓'}
              </button>
            </div>
          </div>
        `;
      }).join("");

    // Build Daily Challenge card data & rows (Pinterest links, no lock buttons)
    const daily = getDailyChallengeResult();
    const dailySeed = getDailySeed();
    const dailyPalette = getDailyThemePalette(daily.color);

    const dailyTraits = [
      { key: 'animal', label: 'Species', icon: '🧜‍♀️', val: daily.animal },
      { key: 'theme', label: 'Theme', icon: '✨', val: daily.theme },
      { key: 'object', label: 'Object', icon: '🔮', val: daily.object },
      { key: 'color', label: 'Color', icon: '🎨', val: daily.color },
      { key: 'personality', label: 'Personality', icon: '🎭', val: daily.personality },
      { key: 'clothing', label: 'Clothing', icon: '👗', val: daily.clothing }
    ];

    const dailyRowsHTML = dailyTraits.map(t => {
      const escapedVal = escapeHTML(t.val).replace(/'/g, "\\'");
      return `
        <div class="cg-daily-row" data-key="${t.key}">
          <div class="cg-daily-key-box">
            <span class="cg-icon">${t.icon}</span>
            <span class="cg-key-text">${t.label}</span>
          </div>
          <div class="cg-daily-val-box">
            <a
              href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(t.val)}"
              target="_blank"
              rel="noopener noreferrer"
              class="cg-result-val-link cg-daily-val-link"
              onmouseenter="CharacterGenerator.showWordTooltip(this, '${escapedVal}', 'คลิกเพื่อค้นหาภาพไอเดียบน Pinterest')"
              onmouseleave="CharacterGenerator.hideWordTooltip()"
              ontouchstart="CharacterGenerator.onWordTouchStart(event, this, '${escapedVal}', 'คลิกเพื่อค้นหาภาพไอเดียบน Pinterest')"
              ontouchend="CharacterGenerator.onWordTouchEnd(event)"
              ontouchmove="CharacterGenerator.onWordTouchMove(event)"
            >
              ${renderValLinkContent(t.val)}
            </a>
          </div>
        </div>
      `;
    }).join("");

    root.innerHTML = `
      <div class="cg-container">
        <!-- RADIAL EXPANSION BACKDROP (Storyboard Frame 6 & 10) -->
        <div
          class="cg-daily-radial-backdrop ${isDailyMode ? 'active' : ''}"
          id="cg-daily-radial-backdrop"
          style="--daily-glow: ${dailyPalette.primary}88; --daily-glow-soft: ${dailyPalette.primary}28; --daily-bg: ${dailyPalette.cardBg};"
          aria-hidden="true"
        ></div>

        <!-- HEADER -->
        <div class="cg-header-block">
          <div class="cg-title-row">
            <h1 class="cg-title">Character Generator</h1>
            <button
              type="button"
              id="cg-title-trans-btn"
              class="cg-title-trans-btn ${showMainCardTranslations ? 'active' : ''}"
              onclick="CharacterGenerator.toggleMainCardTranslations()"
              title="${showMainCardTranslations ? 'คลิกเพื่อปิดคำแปลไทย' : 'คลิกเพื่อเปิดคำแปลไทย'}"
              aria-label="แปลภาษาไทย"
            >
              <span class="cg-trans-icon">${SVG_ICONS.translate}</span>
              <span class="cg-trans-label">${showMainCardTranslations ? 'แปลไทย: เปิด' : 'แปลไทย'}</span>
            </button>
          </div>
          <p class="cg-subtitle">✨ OC Idea Randomizer for Artists & Creators</p>
        </div>

        <!-- MODE SWITCHER BUTTONS -->
        <div class="cg-mode-group ${isSmart ? 'is-smart' : ''}">
          <div class="cg-mode-indicator"></div>
          <button class="cg-mode-btn ${isRandom ? 'active' : ''}" onclick="CharacterGenerator.setMode('random')">
            <span class="cg-mode-icon">🎲</span>
            <span>Random Everything</span>
          </button>
          <button class="cg-mode-btn ${isSmart ? 'active' : ''}" onclick="CharacterGenerator.setMode('smart')">
            <span class="cg-mode-icon">🧠</span>
            <span>Smart Match</span>
            ${isSmart ? `
              <span class="cg-wrench-btn" onclick="event.stopPropagation(); CharacterGenerator.openSmartSettings()" title="ตั้งค่าเผ่าพันธุ์ & การสุ่ม">
                🔧
              </span>
            ` : ''}
          </button>
        </div>

        <!-- RESULT CARD WRAPPER WITH 2-STAGE SLIDE CHOREOGRAPHY -->
        <div class="cg-card-wrap ${isDailyMode ? 'daily-active' : ''}">
          <div class="cg-card-outer" id="cg-card-outer">
            <!-- Background Action Track (Revealed on Swipe) -->
            <div class="cg-card-track" aria-hidden="true">
              <div class="cg-slot-side left" id="cg-slot-redo">
                <div class="cg-slot-action" id="cg-action-redo">
                  <div class="cg-slot-icon-disc">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 7v6h-6"/>
                      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
                    </svg>
                  </div>
                  <span class="cg-slot-label">(Redo)</span>
                </div>
              </div>
              <div class="cg-slot-side right" id="cg-slot-undo">
                <div class="cg-slot-action" id="cg-action-undo">
                  <div class="cg-slot-icon-disc">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 7v6h6"/>
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                    </svg>
                  </div>
                  <span class="cg-slot-label">(Undo)</span>
                </div>
              </div>
            </div>

            <!-- Foreground Sliding Card -->
            <div class="cg-card" id="cg-card">
              <div class="cg-result-list">
                ${resultEntries}
              </div>

              <div class="cg-action-group">
                <button class="cg-btn cg-btn-generate" onclick="CharacterGenerator.generate()">
                  <span>⚡ Random</span>
                </button>
                <button class="cg-btn cg-btn-save" onclick="CharacterGenerator.saveResult()">
                  <span>⭐ Save</span>
                </button>
              </div>
            </div>
          </div>

          <!-- DAILY / ROUTINE CHALLENGE CARD (Tucked behind card 1 initially, with single ribbon attached) -->
          <div
            class="cg-daily-card-outer"
            id="cg-daily-card-outer"
            aria-hidden="${!isDailyMode}"
            style="
              --daily-bg: ${dailyPalette.bg};
              --daily-card-bg: ${dailyPalette.cardBg};
              --daily-surface-alt: ${dailyPalette.surfaceAlt};
              --daily-primary: ${dailyPalette.primary};
              --daily-text: ${dailyPalette.text};
              --daily-text2: ${dailyPalette.text2};
              --daily-text3: ${dailyPalette.text3};
              --daily-line: ${dailyPalette.line};
              --daily-line2: ${dailyPalette.line2};
            "
          >
            <!-- THE SINGLE RIBBON: Attached to Daily Card all the time, longer bookmark cut (Image 4) -->
            <button
              type="button"
              id="cg-daily-ribbon"
              class="cg-daily-ribbon"
              onclick="CharacterGenerator.toggleDailyMode()"
              title="คลิกเพื่อเปิด/ปิดโจทย์ชาเลนจ์ (#DailyOCAdopt #สุ่มวาดOC)"
              aria-label="ชาเลนจ์ประจำวัน"
            ></button>

            <div class="cg-daily-card-inner" id="cg-daily-card-inner">
              <div class="cg-daily-header">
                <div class="cg-daily-header-left">
                  <div class="cg-daily-title-row">
                    <span class="cg-daily-badge">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span>${QUEST_CONFIG.intervalDays === 1 ? 'Daily Quest' : `${QUEST_CONFIG.intervalDays}-Day Quest`}</span>
                    </span>
                    <h2 class="cg-daily-title">${QUEST_CONFIG.intervalDays === 1 ? 'Daily Character Challenge' : 'Character Quest Challenge'}</h2>
                  </div>
                  <p class="cg-daily-desc">โจทย์สุ่มวาดและออกแบบตัวละคร ${QUEST_CONFIG.intervalDays === 1 ? `ประจำวัน (${escapeHTML(dailySeed.formattedThai)})` : `(รอบ ${escapeHTML(dailySeed.cycleRangeStr)})`}</p>
                </div>

                <div class="cg-daily-header-right">
                  <div class="cg-daily-timer-box" title="เวลานับถอยหลังสู่การรีเซ็ตโจทย์รอบถัดไป">
                    <svg class="cg-daily-timer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="cg-daily-timer-val" id="cg-daily-countdown-time">--:--:--</span>
                  </div>
                  <div class="cg-daily-hashtags-pill">
                    <span>#DailyOCAdopt</span>
                    <span class="cg-daily-tag-sep">·</span>
                    <span>#สุ่มวาดOC</span>
                  </div>
                </div>
              </div>

              <!-- 6 TRAIT ROWS -->
              <div class="cg-daily-trait-list">
                ${dailyRowsHTML}
              </div>
            </div>
          </div>
        </div>

        <!-- SAVED RESULTS SECTION -->
        <div class="cg-saved-section">
          <div class="cg-saved-header">
            <div class="cg-saved-header-left">
              <h2 class="cg-saved-title">Saved Results</h2>
              <span class="cg-saved-count" id="cg-saved-count-badge">${savedBadgeText}</span>
            </div>
            ${savedList.length > 0 ? `
              <div class="cg-saved-search-box">
                <span class="cg-saved-search-icon">${SVG_ICONS.search}</span>
                <input
                  type="text"
                  id="cg-saved-search-input"
                  class="cg-saved-search-input"
                  placeholder="ค้นหาในการ์ดที่บันทึก..."
                  value="${escapeHTML(savedSearchQuery)}"
                  oninput="CharacterGenerator.onSavedSearch(this.value)"
                  autocomplete="off"
                />
                ${savedSearchQuery ? `
                  <button type="button" class="cg-saved-search-clear" onclick="CharacterGenerator.clearSavedSearch()" title="ล้างการค้นหา">✕</button>
                ` : ''}
              </div>
            ` : ''}
          </div>
          <div class="cg-saved-grid" id="cg-saved-grid">
            ${savedCardsHTML}
          </div>
        </div>

        <!-- EXPLAIN BOX -->
        <div class="cg-explain-card">
          <div class="cg-explain-item ${isRandom ? 'active-mode-item' : ''}">
            <span class="cg-explain-badge">🎲 Random Everything</span>
            <span class="cg-explain-text">สุ่มไอเดียองค์ประกอบทุกอย่างแบบอิสระ 100%</span>
          </div>
          <div class="cg-explain-item ${isSmart ? 'active-mode-item' : ''}">
            <span class="cg-explain-badge">🧠 Smart Match</span>
            <span class="cg-explain-text">ระบบจับคู่ธีมและสิ่งของให้เหมาะสมกลมกลืนกับสัตว์ที่สุ่มได้</span>
          </div>
          <div class="cg-explain-item">
            <span class="cg-explain-badge">🔍 Click-to-Search</span>
            <span class="cg-explain-text">คลิกที่แถบหัวข้อด้านหน้า (Animal, Theme...) เพื่อค้นหาและเลือกคำจากคลัง</span>
          </div>
          <div class="cg-explain-item">
            <span class="cg-explain-badge">🔒 Slot Lock</span>
            <span class="cg-explain-text">กดแม่กุญแจเพื่อล็อกค่าที่ชอบไว้ แล้วสุ่มใหม่เฉพาะช่องที่ไม่ได้ล็อก</span>
          </div>
          <div class="cg-explain-item">
            <span class="cg-explain-badge">📌 Pinterest Search</span>
            <span class="cg-explain-text">คลิกที่ตัวคำสุ่มเพื่อเปิดค้นหาภาพไอเดียและเรฟแต่งตัวบน Pinterest ได้ทันที</span>
          </div>
          <div class="cg-explain-item">
            <span class="cg-explain-badge">⚙️ Edit Saved</span>
            <span class="cg-explain-text">ดึงไอเดียที่เซฟไว้กลับมาสุ่มต่อ โดยระบบจะล็อกค่าเดิมให้อัตโนมัติ</span>
          </div>
          <div class="cg-explain-item">
            <span class="cg-explain-badge">▲▼ Reorder Cards</span>
            <span class="cg-explain-text">กดลูกศรขึ้น-ลงเพื่อปรับเลื่อนลำดับการ์ดผลลัพธ์ที่เซฟไว้</span>
          </div>
          <div class="cg-explain-item">
            <span class="cg-explain-badge">✕ Delete Item</span>
            <span class="cg-explain-text">กด ✕ ที่ท้ายคำสุ่มเพื่อเลือกลบเฉพาะบางหัวข้อที่ไม่ต้องการ</span>
          </div>
        </div>

        <!-- TRAIT PICKER & SEARCH MODAL -->
        ${activeTraitPicker ? (() => {
          const modalMeta = getPickerModalMeta(activeTraitPicker, traitSubFilter);
          const showSubTabs = activeTraitPicker === 'animal' && smartConfig.includeMGE && smartConfig.includeAnimals;
          return `
          <div class="cg-modal-overlay" onclick="if(event.target === this) CharacterGenerator.closeTraitPicker()">
            <div class="cg-modal-box cg-trait-picker-modal">
              <div class="cg-picker-header">
                <div class="cg-picker-title-row">
                  <h3 class="cg-modal-title" id="cg-picker-modal-title">
                    <span>${modalMeta.icon}</span>
                    <span>เลือก ${modalMeta.label}</span>
                  </h3>
                  <button type="button" class="cg-picker-close-btn" onclick="CharacterGenerator.closeTraitPicker()" title="ปิดหน้าต่าง">✕</button>
                </div>
                <p class="cg-modal-text" style="margin-bottom: 12px; text-align: left;">
                  คลิกเลือกคำที่ต้องการจากคลัง หรือพิมพ์ค้นหาคำในช่องด้านล่าง
                </p>
                <div class="cg-picker-search-bar">
                  <span class="cg-picker-search-icon">${SVG_ICONS.search}</span>
                  <input
                    type="text"
                    id="cg-trait-search-input"
                    class="cg-picker-search-input"
                    placeholder="พิมพ์ค้นหาคำในหมวดนี้..."
                    value="${escapeHTML(traitSearchQuery)}"
                    oninput="CharacterGenerator.onTraitSearch(this.value)"
                    autocomplete="off"
                  />
                  ${traitSearchQuery ? `
                    <button type="button" class="cg-picker-search-clear" onclick="CharacterGenerator.clearTraitSearch()" title="ล้างการค้นหา">✕</button>
                  ` : ''}
                </div>

                ${showSubTabs ? `
                  <div class="cg-picker-tabs">
                    <button
                      type="button"
                      class="cg-picker-tab ${traitSubFilter === 'mge' ? 'active' : ''}"
                      data-filter="mge"
                      onclick="CharacterGenerator.setTraitSubFilter('mge')"
                    >
                      <span>🧜‍♀️</span> เผ่าพันธุ์ MGE <span class="cg-picker-tab-count">(${mgeRaces.length})</span>
                    </button>
                    <button
                      type="button"
                      class="cg-picker-tab ${traitSubFilter === 'animal' ? 'active' : ''}"
                      data-filter="animal"
                      onclick="CharacterGenerator.setTraitSubFilter('animal')"
                    >
                      <span>🐱</span> สัตว์ทั่วไป <span class="cg-picker-tab-count">(${animals.length})</span>
                    </button>
                    <button
                      type="button"
                      class="cg-picker-tab ${traitSubFilter === 'all' ? 'active' : ''}"
                      data-filter="all"
                      onclick="CharacterGenerator.setTraitSubFilter('all')"
                    >
                      <span>🧬</span> ทั้งหมด <span class="cg-picker-tab-count">(${mgeRaces.length + animals.length})</span>
                    </button>
                  </div>
                ` : ''}

                <div class="cg-picker-meta-row">
                  <span class="cg-picker-count" id="cg-picker-count"></span>
                  <div class="cg-picker-meta-btns">
                    <button
                      type="button"
                      id="cg-picker-trans-btn"
                      class="cg-picker-meta-btn ${showChipTranslations ? 'active' : ''}"
                      onclick="CharacterGenerator.toggleShowTranslations()"
                      title="${showChipTranslations ? 'คลิกเพื่อซ่อนคำแปลบนชิป' : 'คลิกเพื่อแสดงคำแปลไทยบนชิป'}"
                    >
                      <span class="cg-picker-trans-icon">${SVG_ICONS.translate}</span>
                      <span>${showChipTranslations ? 'คำแปลไทย' : 'แสดงคำแปล'}</span>
                    </button>
                    <button
                      type="button"
                      class="cg-picker-meta-btn cg-picker-roll-btn"
                      onclick="CharacterGenerator.randomizeSingleSlot('${activeTraitPicker}')"
                      title="สุ่มเฉพาะหมวดนี้ใหม่"
                    >
                      <span>🎲</span> สุ่มเฉพาะช่องนี้
                    </button>
                  </div>
                </div>
              </div>

              <div class="cg-picker-body" id="cg-picker-body">
                ${buildTraitPickerChipsHTML(activeTraitPicker, traitSearchQuery, traitSubFilter)}
              </div>
            </div>
          </div>
        `;
        })() : ''}

        <!-- CONFIRM DELETE FIELD MODAL -->
        ${pendingDeleteField ? `
          <div class="cg-modal-overlay" onclick="if(event.target === this) CharacterGenerator.cancelDeleteField()">
            <div class="cg-modal-box">
              <div class="cg-modal-icon">⚠️</div>
              <h3 class="cg-modal-title">ยืนยันการลบ</h3>
              <p class="cg-modal-text">ลบ <b>${pendingDeleteField.fieldLabel} (${pendingDeleteField.fieldValue})</b> ออกจากรายการนี้ไหม?</p>
              <div class="cg-modal-actions">
                <button class="cg-modal-btn cg-modal-btn-confirm" onclick="CharacterGenerator.executeDeleteField()">ใช่ (Yes)</button>
                <button class="cg-modal-btn cg-modal-btn-cancel" onclick="CharacterGenerator.cancelDeleteField()">ไม่ (No)</button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- ALERT LIMIT MODAL -->
        ${pendingAlertModal ? `
          <div class="cg-modal-overlay" onclick="if(event.target === this) CharacterGenerator.closeAlertModal()">
            <div class="cg-modal-box">
              <div class="cg-modal-icon">⚠️</div>
              <h3 class="cg-modal-title">บันทึกเต็มแล้ว (${MAX_SAVED_ITEMS}/${MAX_SAVED_ITEMS})</h3>
              <p class="cg-modal-text">${pendingAlertModal}</p>
              <div class="cg-modal-actions">
                <button class="cg-modal-btn cg-modal-btn-confirm" onclick="CharacterGenerator.closeAlertModal()">ตกลง (OK)</button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- SMART MATCH SETTINGS MODAL -->
        ${pendingSmartModal ? `
          <div class="cg-modal-overlay" onclick="if(event.target === this) CharacterGenerator.closeSmartSettings()">
            <div class="cg-modal-box cg-modal-settings">
              <div class="cg-modal-icon">⚙️</div>
              <h3 class="cg-modal-title">ตั้งค่าเผ่าพันธุ์ Smart Match</h3>
              <p class="cg-modal-text">ปรับเลือกแหล่งข้อมูลเผ่าพันธุ์ที่จะนำมาสุ่มในระบบ</p>
              
              <div class="cg-settings-list">
                <label class="cg-setting-item">
                  <input type="checkbox" id="cfg-mge" ${smartConfig.includeMGE ? 'checked' : ''}>
                  <div class="cg-setting-info">
                    <span class="cg-setting-title">เผ่าพันธุ์ Monster Girl (MGE)</span>
                    <span class="cg-setting-sub">Lamia, Harpy, Dullahan, Slime Girl, Succubus, Arachne, Alraune ฯลฯ</span>
                  </div>
                </label>

                <label class="cg-setting-item">
                  <input type="checkbox" id="cfg-animals" ${smartConfig.includeAnimals ? 'checked' : ''}>
                  <div class="cg-setting-info">
                    <span class="cg-setting-title">สัตว์ทั่วไป (Standard Animals)</span>
                    <span class="cg-setting-sub">Fox, Cat, Wolf, Owl, Rabbit, Lion, Bear, Eagle ฯลฯ</span>
                  </div>
                </label>
              </div>

              <div class="cg-modal-actions" style="margin-top: 20px;">
                <button class="cg-modal-btn cg-modal-btn-confirm" onclick="CharacterGenerator.saveSmartSettings()">บันทึก (Save)</button>
                <button class="cg-modal-btn cg-modal-btn-cancel" onclick="CharacterGenerator.closeSmartSettings()">ยกเลิก (Cancel)</button>
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    setupCGCardSwipe();
    if (isDailyMode) {
      updateDailyCountdownDOM();
    }
  }

  // FLIP Animation Helpers
  function getCardPositions() {
    const map = new Map();
    document.querySelectorAll('.cg-saved-card').forEach(card => {
      const id = card.getAttribute('data-id');
      if (id) {
        map.set(id, card.getBoundingClientRect());
      }
    });
    return map;
  }

  function animateFlip(firstPositionsMap) {
    if (!firstPositionsMap || firstPositionsMap.size === 0) return;
    const newCards = document.querySelectorAll('.cg-saved-card');

    newCards.forEach(card => {
      const id = card.getAttribute('data-id');
      const firstRect = firstPositionsMap.get(id);
      if (firstRect) {
        const lastRect = card.getBoundingClientRect();
        const deltaY = firstRect.top - lastRect.top;

        if (deltaY !== 0) {
          card.style.transition = 'none';
          card.style.transform = `translateY(${deltaY}px)`;
          card.classList.add('swapped-anim');

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.transform = 'translateY(0)';
              setTimeout(() => {
                card.classList.remove('swapped-anim');
              }, 550);
            });
          });
        }
      }
    });
  }

  function animateLockedSlots() {
    const lockedKeys = Object.keys(lockedState).filter(k => lockedState[k]);
    if (lockedKeys.length === 0) return;

    requestAnimationFrame(() => {
      lockedKeys.forEach(key => {
        const lockBtn = document.querySelector(`.cg-lock-btn[data-key="${key}"]`);
        const rowEl = document.querySelector(`.cg-result-row[data-key="${key}"]`);

        if (lockBtn) {
          lockBtn.classList.remove("lock-pop-shake");
          void lockBtn.offsetWidth;
          lockBtn.classList.add("lock-pop-shake");
        }

        if (rowEl) {
          rowEl.classList.remove("lock-pop-shake");
          void rowEl.offsetWidth;
          rowEl.classList.add("lock-pop-shake");
        }
      });
    });
  }

  function animateSaveInsert(firstPositionsMap, newId) {
    requestAnimationFrame(() => {
      // 1. Vertical Stretch for Count Badge
      const countEl = document.querySelector('.cg-saved-count');
      if (countEl) {
        countEl.classList.remove('cg-stretch-y');
        void countEl.offsetWidth;
        countEl.classList.add('cg-stretch-y');
      }

      // 2. Animate new card expanding from top header & old cards sliding down
      const allCards = document.querySelectorAll('.cg-saved-card');
      allCards.forEach(card => {
        const id = card.getAttribute('data-id');
        if (id === newId) {
          // New Card: Expand from top underneath header
          card.classList.remove('cg-card-expand-top');
          void card.offsetWidth;
          card.classList.add('cg-card-expand-top');
        } else if (firstPositionsMap && firstPositionsMap.has(id)) {
          // Existing Card: FLIP calculation to smoothly slide down
          const firstRect = firstPositionsMap.get(id);
          const lastRect = card.getBoundingClientRect();
          const deltaY = firstRect.top - lastRect.top;

          if (deltaY !== 0) {
            card.style.transition = 'none';
            card.style.transform = `translateY(${deltaY}px)`;

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = 'translateY(0)';
                setTimeout(() => {
                  card.style.transition = '';
                  card.style.transform = '';
                }, 550);
              });
            });
          }
        }
      });
    });
  }

  function animateModeSwitch(mode) {
    requestAnimationFrame(() => {
      // Smooth mode transition animation on result card
      const cardEl = document.querySelector('.cg-card');
      if (cardEl) {
        cardEl.classList.remove('mode-switch-anim');
        void cardEl.offsetWidth;
        cardEl.classList.add('mode-switch-anim');
      }
    });
  }

  // Inject Styles into Document Head
  function injectStyles() {
    if (document.getElementById("cg-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "cg-styles";
    styleEl.innerHTML = `
      .cg-container {
        max-width: 760px;
        margin: 0 auto;
        padding: 24px 12px 60px 12px;
        font-family: inherit;
        color: var(--text);
      }
      .cg-header-block {
        position: relative;
        text-align: center;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .cg-title-row {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 6px;
        position: relative;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cg-title {
        font-size: 36px;
        font-weight: 800;
        margin: 0;
        color: var(--text);
        letter-spacing: -0.5px;
        line-height: 1.15;
        white-space: nowrap;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cg-title-trans-btn {
        width: 34px;
        height: 34px;
        padding: 0;
        border-radius: 50%;
        background: var(--bg2, #18181c);
        border: 1px solid var(--line2, #383842);
        color: var(--text, #f0f0f0);
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        flex-shrink: 0;
        transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    background 0.25s ease,
                    border-color 0.25s ease,
                    color 0.25s ease,
                    box-shadow 0.25s ease,
                    transform 0.25s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .cg-title-trans-btn .cg-trans-icon {
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .cg-title-trans-btn .cg-trans-icon svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cg-title-trans-btn .cg-trans-label {
        font-size: 12px;
        font-weight: 600;
        color: inherit;
        opacity: 0;
        transform: translateX(-8px);
        transition: opacity 0.25s ease 0.06s, transform 0.25s ease 0.06s;
        padding-right: 12px;
        pointer-events: none;
      }
      .cg-title-trans-btn:hover,
      .cg-title-trans-btn:focus-visible {
        width: 104px;
        border-radius: 999px;
        background: var(--bg3, #222);
        color: var(--text, #fff);
        border-color: var(--text2, #888);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
        transform: translateY(-1px);
      }
      .cg-title-trans-btn:hover .cg-trans-icon svg,
      .cg-title-trans-btn:focus-visible .cg-trans-icon svg {
        transform: scale(1.1) rotate(6deg);
      }
      .cg-title-trans-btn.active:hover,
      .cg-title-trans-btn.active:focus-visible {
        width: 124px;
      }
      .cg-title-trans-btn:hover .cg-trans-label,
      .cg-title-trans-btn:focus-visible .cg-trans-label {
        opacity: 1;
        transform: translateX(0);
      }
      .cg-title-trans-btn.active {
        background: var(--text, #fff);
        color: var(--bg, #0d0d0d);
        border-color: var(--text, #fff);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }
      .cg-title-trans-btn.active .cg-trans-icon svg {
        stroke: var(--bg, #0d0d0d);
      }
      .cg-title-trans-btn.active:hover {
        background: var(--text, #fff);
        color: var(--bg, #0d0d0d);
        border-color: var(--text, #fff);
      }
      .cg-title-trans-btn.active .cg-trans-label {
        color: var(--bg, #0d0d0d);
      }

      [data-theme="light"] .cg-title-trans-btn {
        background: var(--bg2, #f0f0f0);
        border-color: var(--line2, #d0d0d0);
        color: var(--text, #0a0a0a);
      }
      [data-theme="light"] .cg-title-trans-btn:hover,
      [data-theme="light"] .cg-title-trans-btn:focus-visible {
        background: var(--bg3, #e8e8e8);
        color: var(--text, #0a0a0a);
        border-color: var(--text, #0a0a0a);
      }
      [data-theme="light"] .cg-title-trans-btn.active {
        background: var(--text, #0a0a0a);
        color: var(--bg, #fafafa);
        border-color: var(--text, #0a0a0a);
      }
      [data-theme="light"] .cg-title-trans-btn.active .cg-trans-icon svg {
        stroke: var(--bg, #fafafa);
      }
      [data-theme="light"] .cg-title-trans-btn.active:hover {
        background: var(--text, #0a0a0a);
        color: var(--bg, #fafafa);
      }
      [data-theme="light"] .cg-title-trans-btn.active .cg-trans-label {
        color: var(--bg, #fafafa);
      }
      .cg-subtitle {
        color: var(--text2);
        font-size: 14px;
        font-weight: 500;
      }
      .cg-mode-group {
        position: relative;
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        background: var(--bg2);
        padding: 6px;
        border-radius: 18px;
        border: 1px solid var(--line);
      }
      .cg-mode-indicator {
        position: absolute;
        top: 6px;
        bottom: 6px;
        left: 6px;
        width: calc(50% - 11px);
        background: var(--bg);
        border-radius: 13px;
        border: 1px solid var(--line);
        box-shadow: 0 4px 14px rgba(0,0,0,0.12);
        transition: transform 0.48s cubic-bezier(0.2, 1, 0.25, 1);
        pointer-events: none;
        z-index: 1;
      }
      .cg-mode-group.is-smart .cg-mode-indicator {
        transform: translateX(calc(100% + 10px));
      }
      .cg-mode-btn {
        flex: 1;
        padding: 12px;
        border-radius: 13px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        transition: color 0.35s ease;
        background: transparent !important;
        color: var(--text2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        position: relative;
        z-index: 2;
      }
      .cg-mode-btn:hover {
        color: var(--text);
      }
      .cg-mode-btn.active {
        color: var(--text);
      }

      /* MODE SWITCH CARD TRANSITION */
      @keyframes cgCardModeSwitch {
        0% {
          opacity: 0.7;
          transform: translateY(6px) scale(0.988);
        }
        50% {
          transform: translateY(-2px) scale(1.005);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .cg-card.mode-switch-anim {
        animation: cgCardModeSwitch 0.48s cubic-bezier(0.2, 1, 0.25, 1) both;
      }

      .cg-explain-item.active-mode-item {
        background: rgba(255, 71, 87, 0.08);
        border: 1px solid rgba(255, 71, 87, 0.25);
        border-radius: 12px;
        padding: 8px 12px;
        transition: all 0.3s ease;
      }
      /* FIXED RADIAL AMBIENT GLOW BACKDROP (Pure opacity fade, no transform scale or heavy blur to eliminate lag) */
      .cg-daily-radial-backdrop {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        background: radial-gradient(ellipse 75% 65% at 50% 36%, var(--daily-glow, rgba(255, 120, 60, 0.45)) 0%, var(--daily-glow-soft, rgba(255, 120, 60, 0.16)) 45%, transparent 75%);
        transition: opacity 0.4s ease;
        will-change: opacity;
      }
      .cg-daily-radial-backdrop.active {
        opacity: 0.35; /* ลด opacity ลง 65% และอยู่หลังหน้าต่าง Daily ตลอด */
      }

      /* CARD WRAPPER WITH 2-STAGE SLIDE CHOREOGRAPHY */
      .cg-card-wrap {
        position: relative;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 1fr;
        align-items: stretch;
        width: 100%;
        perspective: 1200px;
      }
      .cg-card-outer,
      .cg-daily-card-outer {
        grid-column: 1;
        grid-row: 1;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }

      /* BLACK MAIN CARD */
      .cg-card-outer {
        position: relative;
        z-index: 2;
        overflow: hidden;
        border-radius: 24px;
        background: var(--bg);
        border: 1px solid var(--line);
        box-shadow: none;
        transform: translate3d(0, 0, 0);
        transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease;
        will-change: transform, opacity;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      /* DAILY CHALLENGE CARD (Tucked behind black card initially, never peeks out) */
      .cg-daily-card-outer {
        position: relative;
        z-index: 1; /* Resting behind black card */
        overflow: visible;
        border-radius: 24px;
        background: transparent;
        border: 1px solid transparent;
        box-shadow: none;
        padding: 0;
        transform: translate3d(0, 0, 0);
        transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      /* Prevent any part of Daily Card from showing under black card when resting */
      .cg-card-wrap:not(.daily-active):not(.daily-phase-out):not(.daily-closing-out):not(.daily-tucking-in) .cg-daily-card-outer {
        pointer-events: none;
      }
      .cg-card-wrap:not(.daily-active):not(.daily-phase-out):not(.daily-closing-out):not(.daily-tucking-in) .cg-daily-ribbon {
        pointer-events: auto;
      }

      /* DAILY CARD INNER (Matching black card size 100% so both cover each other perfectly, flat minimal without drop-shadow) */
      .cg-daily-card-inner {
        position: relative;
        z-index: 2; /* In front of ribbon */
        height: 100%;
        min-height: 100%;
        box-sizing: border-box;
        padding: 24px;
        border-radius: 24px;
        background: var(--daily-card-bg, #f5f2eb);
        border: 1px solid var(--daily-line2, rgba(0, 0, 0, 0.12));
        color: var(--daily-text, #181615);
        opacity: 0;
        pointer-events: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* THE SINGLE RIBBON: Tucked behind card on layer 1, sticking out on right */
      .cg-daily-ribbon {
        position: absolute;
        right: -32px;
        top: 110px;
        width: 64px;
        height: 34px;
        background: var(--daily-primary, #ff5722);
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 1; /* Behind card surface layer 2 */
        display: flex;
        align-items: center;
        justify-content: center;
        clip-path: polygon(0% 0%, 100% 0%, 78% 50%, 100% 100%, 0% 100%);
        box-shadow: none;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
      }
      .cg-daily-ribbon:hover {
        transform: translate3d(4px, 0, 0);
        opacity: 0.9;
      }

      /* ══ CHOREOGRAPHY STAGES (PC) ══ */
      /* Stage 1: Pull out to the right (behind black card) */
      .cg-card-wrap.daily-phase-out .cg-card-outer {
        transform: scale(0.975) translate3d(0, 4px, 0);
        opacity: 0.88;
      }
      .cg-card-wrap.daily-phase-out .cg-daily-card-outer {
        z-index: 1;
        transform: translate3d(104%, 0, 0);
      }
      .cg-card-wrap.daily-phase-out .cg-daily-card-inner {
        opacity: 1;
        pointer-events: auto;
      }

      /* Stage 2: Swapped in front & resting in center */
      .cg-card-wrap.daily-active .cg-card-outer {
        transform: scale(0.975) translate3d(0, 4px, 0);
        opacity: 0.88;
        pointer-events: none;
        z-index: 2;
      }
      .cg-card-wrap.daily-active .cg-daily-card-outer {
        z-index: 5; /* In front! */
        transform: translate3d(0, 0, 0);
      }
      .cg-card-wrap.daily-active .cg-daily-card-inner {
        opacity: 1;
        pointer-events: auto;
        box-shadow: none;
      }
      .cg-card-wrap.daily-active .cg-daily-ribbon:hover {
        transform: translate3d(-4px, 0, 0);
        opacity: 0.9;
      }

      /* Stage A of Closing: Slide out to right (in front) */
      .cg-card-wrap.daily-closing-out .cg-card-outer {
        transform: scale(0.975) translate3d(0, 4px, 0);
        opacity: 0.88;
      }
      .cg-card-wrap.daily-closing-out .cg-daily-card-outer {
        z-index: 5;
        transform: translate3d(104%, 0, 0);
      }
      .cg-card-wrap.daily-closing-out .cg-daily-card-inner {
        opacity: 1;
        pointer-events: auto;
      }

      /* Stage B of Closing: Drop behind black card & slide back in */
      .cg-card-wrap.daily-tucking-in .cg-card-outer {
        transform: scale(1) translate3d(0, 0, 0);
        opacity: 1;
      }
      .cg-card-wrap.daily-tucking-in .cg-daily-card-outer {
        z-index: 1; /* Drops behind! */
        transform: translate3d(0, 0, 0);
      }
      .cg-card-wrap.daily-tucking-in .cg-daily-card-inner {
        opacity: 1;
        pointer-events: auto;
      }

      /* DAILY CARD INTERNAL COMPACT STYLES (Scoped to Daily Palette) */
      .cg-daily-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 14px;
        padding-right: 4px;
      }
      .cg-daily-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 3px;
        flex-wrap: wrap;
      }
      .cg-daily-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11.5px;
        font-weight: 800;
        color: #ffffff;
        background: var(--daily-text, #181615);
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 4px 10px;
        border-radius: 20px;
        letter-spacing: 0.4px;
        box-shadow: none;
      }
      .cg-daily-badge svg {
        color: var(--daily-primary, #f59e0b);
      }
      .cg-daily-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--daily-text, #181615);
        margin: 0;
      }
      .cg-daily-desc {
        font-size: 13px;
        color: var(--daily-text2, #6a655f);
        margin: 0;
      }
      .cg-daily-header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 5px;
      }
      .cg-daily-timer-box {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--daily-surface-alt, rgba(0, 0, 0, 0.05));
        border: 1px solid var(--daily-line2, rgba(0, 0, 0, 0.12));
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        color: var(--daily-text, #181615);
        letter-spacing: 0.3px;
      }
      .cg-daily-timer-icon {
        color: var(--daily-primary, #ff5722);
      }
      .cg-daily-hashtags-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 600;
        color: var(--daily-text2, #6a655f);
      }
      .cg-daily-tag-sep {
        opacity: 0.5;
      }

      .cg-daily-trait-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .cg-daily-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-radius: 12px;
        background: var(--daily-surface-alt, rgba(0, 0, 0, 0.03));
        border: 1px solid var(--daily-line, rgba(0, 0, 0, 0.08));
        transition: border-color 0.2s ease, background 0.2s ease;
      }
      .cg-daily-row:hover {
        border-color: var(--daily-line2, rgba(0, 0, 0, 0.18));
      }
      .cg-daily-key-box {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--daily-text, #181615);
      }
      .cg-daily-val-box {
        display: flex;
        align-items: center;
      }
      .cg-daily-val-link {
        color: var(--daily-text, #181615);
        background: var(--daily-card-bg, #fff);
        border: 1px solid var(--daily-line2, rgba(0, 0, 0, 0.12));
        padding: 6px 14px;
        border-radius: 14px;
        text-decoration: none;
        font-size: 14px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        transition: all 0.2s ease;
      }
      .cg-daily-val-link:hover {
        border-color: var(--daily-primary, #ff5722);
        color: var(--daily-primary, #ff5722);
        box-shadow: none;
      }
      .cg-card-track {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg);
      }
      .cg-slot-side {
        position: absolute;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        user-select: none;
        box-sizing: border-box;
        overflow: hidden;
        width: 0;
      }
      .cg-slot-side.left {
        left: 0;
        border-right: 1px solid var(--line);
      }
      .cg-slot-side.right {
        right: 0;
        border-left: 1px solid var(--line);
      }
      .cg-slot-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        flex-shrink: 0;
        opacity: 0;
        transform: scale(0.85);
        transition: opacity 0.15s ease, transform 0.15s ease;
        user-select: none;
      }
      .cg-slot-icon-disc {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--bg3);
        border: 1px solid var(--line2);
        color: var(--text);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.18s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      .cg-slot-icon-disc svg {
        display: block;
        stroke: currentColor;
      }
      .cg-slot-label {
        font-family: var(--font, 'DM Sans', sans-serif);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.4px;
        color: var(--text2);
        line-height: 1;
        transition: color 0.18s ease;
      }
      .cg-slot-action.ready .cg-slot-icon-disc {
        background: var(--text);
        color: var(--bg);
        border-color: var(--text);
        transform: scale(1.1);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      }
      .cg-slot-action.ready .cg-slot-label {
        color: var(--text);
        font-weight: 700;
      }
      .cg-card {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
        min-height: 100%;
        background: var(--bg2);
        border-radius: 23px;
        padding: 24px;
        box-sizing: border-box;
        touch-action: pan-y;
        user-select: none;
        will-change: transform;
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.12);
        cursor: default;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .cg-card.is-dragging {
        cursor: grabbing;
      }
      .cg-result-row {
        cursor: grab;
      }
      .cg-card.is-dragging .cg-result-row {
        cursor: grabbing;
      }
      .cg-result-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 8px;
        border-bottom: 1px solid var(--line);
        transition: all 0.2s ease;
      }
      .cg-result-row:last-child {
        border-bottom: none;
      }
      .cg-result-row.is-locked-row {
        background: rgba(255, 71, 87, 0.05);
        border-radius: 12px;
      }
      .cg-result-key {
        font-weight: 700;
        font-size: 14px;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .cg-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        color: var(--text2);
        flex-shrink: 0;
      }
      .cg-icon svg {
        display: block;
        stroke: currentColor;
      }
      .cg-key-text {
        letter-spacing: -0.2px;
      }
      .cg-result-right {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .cg-lock-btn {
        background: var(--bg3);
        border: 1px solid var(--line2);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text2);
        padding: 0;
        flex-shrink: 0;
      }
      .cg-lock-btn svg {
        display: block;
        stroke: currentColor;
      }
      .cg-lock-btn:hover {
        background: var(--line);
        color: var(--text);
        transform: scale(1.08);
      }
      .cg-lock-btn.locked {
        background: rgba(255, 71, 87, 0.12);
        border-color: #ff4757;
        color: #ff4757;
        box-shadow: 0 0 10px rgba(255, 71, 87, 0.2);
      }

      /* POP & ROTATION SHAKE ANIMATION FOR LOCKED SLOTS (GENTLE & BALANCED) */
      @keyframes cgLockPopShake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        25% {
          transform: scale(1.18) rotate(-7deg);
        }
        50% {
          transform: scale(1.15) rotate(7deg);
        }
        75% {
          transform: scale(1.06) rotate(-3deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }

      .cg-lock-btn.lock-pop-shake {
        animation: cgLockPopShake 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        z-index: 5;
      }

      /* VERTICAL STRETCH ANIMATION FOR COUNT BADGE */
      @keyframes cgStretchY {
        0% {
          transform: scaleY(1) scaleX(1);
        }
        30% {
          transform: scaleY(1.45) scaleX(0.9);
        }
        60% {
          transform: scaleY(0.9) scaleX(1.05);
        }
        80% {
          transform: scaleY(1.08) scaleX(0.98);
        }
        100% {
          transform: scaleY(1) scaleX(1);
        }
      }

      .cg-saved-count.cg-stretch-y {
        animation: cgStretchY 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        transform-origin: center center;
      }

      /* NEW CARD EXPAND & SLIDE FROM UNDERNEATH HEADER */
      @keyframes cgExpandFromTop {
        0% {
          opacity: 0;
          transform: translateY(-25px) scaleY(0.3) scaleX(0.92);
          transform-origin: top center;
        }
        40% {
          opacity: 0.7;
          transform: translateY(-10px) scaleY(1.06) scaleX(0.98);
        }
        70% {
          transform: translateY(2px) scaleY(0.98) scaleX(1.01);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
          transform-origin: top center;
        }
      }

      .cg-saved-card.cg-card-expand-top {
        animation: cgExpandFromTop 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        will-change: transform, opacity;
      }

      @keyframes cgRowLockedPulse {
        0% { transform: scale(1); }
        40% { transform: scale(1.008); }
        100% { transform: scale(1); }
      }

      .cg-result-row.lock-pop-shake {
        animation: cgRowLockedPulse 0.35s ease-in-out both;
      }

      /* CATEGORY HEADER LABEL BUTTON WITH HOVER SEARCH ICON */
      .cg-result-key-btn {
        background: transparent;
        border: 1px solid transparent;
        padding: 6px 10px;
        border-radius: 12px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text);
        font-family: inherit;
        font-weight: 700;
        font-size: 14px;
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        user-select: none;
      }
      .cg-result-key-btn:hover {
        background: var(--bg3);
        border-color: var(--line2);
        color: #ff4757;
        transform: translateX(2px);
      }
      .cg-key-search-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        max-width: 0;
        overflow: hidden;
        transform: translateX(-4px) scale(0.85);
        color: #ff4757;
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cg-key-search-icon svg {
        display: block;
        stroke: currentColor;
      }
      .cg-result-key-btn:hover .cg-key-search-icon {
        opacity: 1;
        max-width: 18px;
        margin-left: 3px;
        transform: translateX(0) scale(1);
      }

      /* VALUE PILL LINK (PINTEREST SEARCH) */
      .cg-result-val-link {
        font-size: 15px;
        color: var(--text);
        font-weight: 600;
        text-align: right;
        background: var(--bg3);
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid var(--line2);
        text-decoration: none;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .cg-result-val-link:hover {
        color: #ff4757;
        border-color: #ff4757;
        background: var(--bg);
        transform: translateX(2px);
      }
      .cg-arrow {
        font-size: 13px;
        font-weight: 800;
        color: #ff4757;
      }
      .cg-val-text-stack {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.25;
        text-align: right;
      }
      .cg-val-th {
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
        letter-spacing: -0.2px;
      }
      .cg-val-en-sub {
        font-size: 11px;
        font-weight: 500;
        color: var(--text2, #888);
        margin-top: 1px;
        letter-spacing: 0.2px;
      }
      .cg-result-val-link:hover .cg-val-th {
        color: #ff4757;
      }
      .cg-result-val-link:hover .cg-val-en-sub {
        color: rgba(255, 71, 87, 0.85);
      }
      .cg-pin-link .cg-val-th {
        color: inherit;
        font-size: 14px;
        font-weight: 700;
      }
      .cg-pin-link .cg-val-en-sub {
        color: var(--text2, #888);
        font-size: 11px;
        font-weight: 500;
      }

      .cg-action-group {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }
      .cg-btn {
        flex: 1;
        padding: 14px;
        border-radius: 14px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 700;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .cg-btn-generate {
        background: var(--bg3);
        color: var(--text);
        border: 1px solid var(--line2);
      }
      .cg-btn-generate:hover {
        background: var(--line2);
        transform: translateY(-2px);
      }
      .cg-btn-save {
        background: var(--text);
        color: var(--bg);
        border: 1px solid var(--text);
      }
      .cg-btn-save:hover {
        opacity: 0.88;
        transform: translateY(-2px);
      }
      .cg-saved-section {
        margin-top: 40px;
      }
      .cg-saved-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
        padding-left: 4px;
        padding-right: 4px;
      }
      .cg-saved-header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .cg-saved-title {
        font-size: 22px;
        font-weight: 800;
        color: var(--text);
        margin: 0;
      }
      .cg-saved-count {
        background: var(--bg3);
        color: var(--text2);
        padding: 2px 10px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
        border: 1px solid var(--line2);
        display: inline-block;
      }

      /* SAVED SEARCH BOX */
      .cg-saved-search-box {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 220px;
        max-width: 320px;
        flex: 1;
      }
      .cg-saved-search-icon {
        position: absolute;
        left: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text2);
        pointer-events: none;
      }
      .cg-saved-search-icon svg {
        display: block;
        stroke: currentColor;
      }
      .cg-saved-search-input {
        width: 100%;
        padding: 8px 32px 8px 34px;
        border-radius: 20px;
        background: var(--bg2);
        border: 1px solid var(--line2);
        color: var(--text);
        font-family: inherit;
        font-size: 13px;
        outline: none;
        transition: all 0.2s ease;
        box-sizing: border-box;
      }
      .cg-saved-search-input:focus {
        border-color: #ff4757;
        box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.15);
        background: var(--bg);
      }
      .cg-saved-search-input::placeholder {
        color: var(--text2);
        opacity: 0.7;
      }
      .cg-saved-search-clear {
        position: absolute;
        right: 8px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: none;
        background: var(--bg3);
        color: var(--text2);
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cg-saved-search-clear:hover {
        background: #ff4757;
        color: #fff;
      }

      .cg-saved-grid {
        display: grid;
        gap: 16px;
      }
      .cg-saved-card {
        border: 1px solid var(--line);
        background: var(--bg2);
        border-radius: 20px;
        padding: 16px 20px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        position: relative;
        will-change: transform;
      }
      .cg-saved-card:hover {
        transform: translateY(-2px);
      }
      .cg-saved-card.swapped-anim {
        box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.6), 0 8px 24px rgba(255, 71, 87, 0.2);
        z-index: 10;
      }
      .cg-saved-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 9px 8px;
        border-bottom: 1px solid var(--line);
        font-size: 14px;
      }
      .cg-saved-row:last-child {
        border-bottom: none;
      }
      .cg-saved-key {
        font-weight: 600;
        color: var(--text2);
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .cg-saved-key-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
      }
      .cg-pin-link {
        color: #ff4757;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
        transition: 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .cg-pin-link:hover {
        text-decoration: underline;
        color: #e60023;
      }
      .cg-saved-val-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cg-row-delete-btn {
        background: transparent;
        border: none;
        color: var(--text3);
        cursor: pointer;
        padding: 4px 7px;
        border-radius: 50%;
        font-size: 12px;
        font-weight: 700;
        opacity: 0.45;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .cg-saved-row:hover .cg-row-delete-btn {
        opacity: 1;
      }
      .cg-row-delete-btn:hover {
        color: #ff4757;
        background: rgba(255, 71, 87, 0.15);
      }

      /* WRENCH BUTTON & SETTINGS MODAL */
      .cg-wrench-btn {
        margin-left: 6px;
        padding: 3px 7px;
        border-radius: 8px;
        background: var(--bg2);
        border: 1px solid var(--line2);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--text2);
      }
      .cg-wrench-btn:hover {
        background: var(--text);
        color: var(--bg);
        border-color: var(--text);
        transform: scale(1.15) rotate(15deg);
      }
      .cg-settings-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-align: left;
        margin: 16px 0;
      }
      .cg-setting-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 14px;
        background: var(--bg3);
        border: 1px solid var(--line2);
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .cg-setting-item:hover {
        border-color: #ff4757;
        background: var(--bg);
      }
      .cg-setting-item input[type="checkbox"] {
        margin-top: 3px;
        width: 18px;
        height: 18px;
        accent-color: #ff4757;
        cursor: pointer;
      }
      .cg-setting-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .cg-setting-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--text);
      }
      .cg-setting-sub {
        font-size: 12px;
        color: var(--text2);
        line-height: 1.4;
      }

      /* CONFIRMATION MODAL & ALERT NOTIFICATIONS */
      .cg-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000000 !important;
        padding: 16px;
        overflow-y: auto;
        box-sizing: border-box;
        animation: cgFadeIn 0.2s ease;
      }
      .cg-modal-box {
        background: var(--bg2);
        border: 1px solid var(--line);
        border-radius: 24px;
        padding: 28px 24px;
        max-width: 380px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }
      .cg-modal-icon {
        font-size: 34px;
        line-height: 1;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cg-modal-title {
        font-size: 20px;
        font-weight: 800;
        color: var(--text);
        margin-bottom: 8px;
      }
      .cg-modal-text {
        font-size: 14px;
        color: var(--text2);
        margin-bottom: 24px;
        line-height: 1.5;
      }
      .cg-modal-text b {
        color: var(--text);
      }
      .cg-modal-actions {
        display: flex;
        gap: 12px;
      }
      .cg-modal-btn {
        flex: 1;
        padding: 12px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }
      .cg-modal-btn-confirm {
        background: #ff4757;
        color: #ffffff;
      }
      .cg-modal-btn-confirm:hover {
        background: #e60023;
        transform: translateY(-1px);
      }
      .cg-modal-btn-cancel {
        background: var(--bg3);
        color: var(--text);
        border: 1px solid var(--line2);
      }
      .cg-modal-btn-cancel:hover {
        background: var(--line2);
        transform: translateY(-1px);
      }

      /* TRAIT PICKER MODAL STYLES (HEADER FULLY PINNED, NEVER SLIPS OFF) */
      .cg-trait-picker-modal {
        max-width: 560px !important;
        width: 100% !important;
        margin: auto !important;
        max-height: calc(100vh - 32px) !important;
        height: min(720px, calc(100vh - 32px)) !important;
        padding: 20px 20px 16px 20px !important;
        text-align: left !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        box-sizing: border-box;
      }
      .cg-picker-header {
        margin-bottom: 8px;
        flex-shrink: 0 !important;
      }
      .cg-picker-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
      }
      .cg-picker-title-row .cg-modal-title {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
      }
      .cg-picker-close-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--line2);
        background: var(--bg3);
        color: var(--text);
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .cg-picker-close-btn:hover {
        background: #ff4757;
        color: #fff;
        border-color: #ff4757;
      }
      .cg-picker-search-bar {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .cg-picker-search-icon {
        position: absolute;
        left: 12px;
        display: flex;
        align-items: center;
        color: var(--text2);
        pointer-events: none;
      }
      .cg-picker-search-icon svg {
        display: block;
        stroke: currentColor;
      }
      .cg-picker-search-input {
        width: 100%;
        padding: 10px 36px 10px 36px;
        border-radius: 14px;
        background: var(--bg3);
        border: 1px solid var(--line2);
        color: var(--text);
        font-family: inherit;
        font-size: 14px;
        outline: none;
        transition: all 0.2s ease;
        box-sizing: border-box;
      }
      .cg-picker-search-input:focus {
        border-color: #ff4757;
        background: var(--bg);
        box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.15);
      }
      .cg-picker-search-clear {
        position: absolute;
        right: 10px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: none;
        background: var(--line2);
        color: var(--text);
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cg-picker-search-clear:hover {
        background: #ff4757;
        color: #fff;
      }
      .cg-picker-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: var(--text2);
        padding: 0 4px;
        gap: 8px;
        flex-wrap: wrap;
      }
      .cg-picker-meta-btns {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .cg-picker-meta-btn {
        background: transparent;
        border: 1px solid var(--line2);
        color: var(--text);
        font-size: 12px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.18s ease;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-family: inherit;
      }
      .cg-picker-meta-btn:hover {
        background: var(--text);
        color: var(--bg);
      }
      .cg-picker-meta-btn.active {
        background: rgba(255, 71, 87, 0.15);
        border-color: #ff4757;
        color: #ff4757;
        font-weight: 700;
      }
      /* PICKER SUB-TABS (MGE vs ANIMALS) */
      .cg-picker-tabs {
        display: flex;
        gap: 6px;
        background: var(--bg3);
        padding: 4px;
        border-radius: 12px;
        border: 1px solid var(--line2);
        margin: 10px 0 6px 0;
      }
      .cg-picker-tab {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 7px 8px;
        border-radius: 8px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--text2);
        font-family: inherit;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s ease;
        white-space: nowrap;
      }
      .cg-picker-tab:hover {
        color: var(--text);
        background: rgba(255, 255, 255, 0.05);
      }
      .cg-picker-tab.active {
        background: var(--bg);
        color: var(--text);
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        border-color: var(--line);
      }
      .cg-picker-tab-count {
        font-size: 11px;
        opacity: 0.65;
        font-weight: normal;
      }
      .cg-picker-tab.active .cg-picker-tab-count {
        opacity: 0.95;
        font-weight: 700;
        color: #ff4757;
      }

      /* CUSTOM MINIMALIST SCROLLBAR FOR PICKER BODY */
      .cg-picker-body {
        flex: 1 1 0 !important;
        min-height: 0 !important;
        max-height: none !important;
        overflow-y: auto !important;
        padding-right: 6px;
        margin-top: 6px;
        scrollbar-width: thin;
        scrollbar-color: var(--line2) transparent;
      }
      .cg-picker-body::-webkit-scrollbar {
        width: 6px;
      }
      .cg-picker-body::-webkit-scrollbar-track {
        background: transparent;
      }
      .cg-picker-body::-webkit-scrollbar-thumb {
        background: var(--line2);
        border-radius: 999px;
        transition: background 0.2s ease;
      }
      .cg-picker-body::-webkit-scrollbar-thumb:hover {
        background: var(--text3, #888);
      }
      .cg-picker-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .cg-picker-chip {
        padding: 7px 14px;
        border-radius: 20px;
        background: var(--bg3);
        border: 1px solid var(--line2);
        color: var(--text);
        font-size: 13px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.18s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }
      .cg-picker-chip:hover {
        background: var(--line);
        border-color: #ff4757;
        color: #ff4757;
        transform: translateY(-1px);
      }
      .cg-chip-th-fixed {
        font-size: 11px;
        font-weight: 600;
        color: #ff4757;
        opacity: 0.95;
        border-left: 1px solid var(--line2);
        padding-left: 6px;
        margin-left: 3px;
        white-space: nowrap;
      }
      .cg-picker-chip.active {
        background: rgba(255, 71, 87, 0.15);
        border-color: #ff4757;
        color: #ff4757;
        font-weight: 700;
        box-shadow: 0 0 10px rgba(255, 71, 87, 0.2);
      }
      .cg-picker-check {
        font-size: 11px;
        font-weight: 800;
      }

      /* CUSTOM THEME-MATCHED TOOLTIP POPUP (DESKTOP HOVER & MOBILE LONG-PRESS) */
      .cg-tooltip-popup {
        position: fixed;
        z-index: 99999999 !important;
        pointer-events: none;
        background: var(--bg2, #18181c);
        border: 1px solid var(--line2, #383842);
        border-radius: 12px;
        padding: 10px 14px;
        box-shadow: none !important;
        backdrop-filter: blur(12px);
        color: var(--text, #f0f0f5);
        font-family: inherit;
        font-size: 13px;
        max-width: min(340px, calc(100vw - 36px));
        line-height: 1.4;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.15s ease, transform 0.15s ease;
        box-sizing: border-box;
      }
      .cg-tooltip-popup.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .cg-tt-header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
        font-weight: 700;
      }
      .cg-tt-close-btn {
        margin-left: auto;
        background: transparent;
        border: none;
        color: var(--text2, #888);
        font-size: 13px;
        font-family: inherit;
        line-height: 1;
        cursor: pointer;
        padding: 3px 6px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: color 0.15s ease, background 0.15s ease;
      }
      .cg-tt-close-btn:hover,
      .cg-tt-close-btn:active {
        color: var(--text, #fff);
        background: var(--line, rgba(255, 255, 255, 0.12));
      }
      [data-theme="light"] .cg-tt-close-btn:hover,
      [data-theme="light"] .cg-tt-close-btn:active {
        color: var(--text, #0a0a0a);
        background: var(--line, rgba(0, 0, 0, 0.08));
      }
      .cg-tt-en {
        color: var(--text, #fff);
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
      }
      .cg-tt-th {
        color: #ff4757;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.35;
      }
      .cg-tt-desc {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--text2, #a0a0a8);
        margin-top: 5px;
        line-height: 1.35;
        background: rgba(255, 71, 87, 0.08);
        padding: 4px 8px;
        border-radius: 6px;
        border-left: 2px solid #ff4757;
      }
      .cg-tt-desc-tag {
        font-size: 10px;
        font-weight: 700;
        background: rgba(255, 71, 87, 0.2);
        color: #ff4757;
        padding: 1px 5px;
        border-radius: 4px;
        white-space: nowrap;
      }
      .cg-tt-desc-text {
        color: var(--text, #f0f0f5);
      }
      .cg-picker-trans-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .cg-picker-trans-icon svg {
        display: block;
      }
      .cg-tt-hint {
        font-size: 11px;
        color: var(--text3, #777);
        margin-top: 6px;
        padding-top: 5px;
        border-top: 1px solid var(--line, #28282e);
      }

      @keyframes cgFadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      
      /* SAVED FOOTER: Action bar with Reorder controls, Pinterest search, and Delete button */
      .cg-saved-footer {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 12px;
        padding-top: 14px;
        border-top: 1px solid var(--line);
      }
      .cg-order-group {
        display: flex;
        gap: 4px;
      }
      .cg-order-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--line2);
        background: var(--bg3);
        color: var(--text);
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .cg-order-btn:hover:not(:disabled) {
        background: var(--text);
        color: var(--bg);
        border-color: var(--text);
      }
      .cg-order-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .cg-search-all-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 14px;
        background: var(--bg3);
        color: #ff4757;
        border: 1.5px solid #ff4757;
        border-radius: 50px;
        font-weight: 700;
        font-size: 13px;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .cg-search-all-btn svg {
        display: block;
        stroke: currentColor;
      }
      .cg-search-all-btn:hover {
        background: #e60023;
        border-color: #e60023;
        color: #ffffff;
      }
      .cg-delete-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 8px 14px;
        border-radius: 50px;
        border: 1.5px solid rgba(230, 0, 35, 0.4);
        background: rgba(230, 0, 35, 0.08);
        color: #e60023;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .cg-delete-btn:hover {
        background: #e60023;
        color: #ffffff;
        border-color: #e60023;
      }
      .cg-edit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 50px;
        border: 1.5px solid var(--line2);
        background: var(--bg3);
        color: var(--text);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .cg-edit-btn:hover {
        background: var(--text);
        color: var(--bg);
        border-color: var(--text);
        transform: rotate(45deg) scale(1.06);
      }

      .cg-empty-state {
        text-align: center;
        padding: 30px 20px;
        background: var(--bg2);
        border: 1px solid var(--line2);
        border-radius: 20px;
      }
      .cg-empty-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }
      .cg-empty-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 4px;
      }
      .cg-empty-sub {
        font-size: 13px;
        color: var(--text2);
      }

      .cg-explain-card {
        margin-top: 36px;
        background: var(--bg2);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 18px 22px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .cg-explain-item {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .cg-explain-badge {
        font-size: 13px;
        font-weight: 700;
        color: var(--text);
        background: var(--bg3);
        padding: 4px 10px;
        border-radius: 8px;
        white-space: nowrap;
      }
      .cg-explain-text {
        font-size: 13px;
        color: var(--text2);
      }

      @media (max-width: 600px) {
        .cg-header-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cg-title-row {
          gap: 8px;
          margin-bottom: 4px;
        }
        .cg-title {
          font-size: clamp(20px, 5.8vw, 28px);
        }
        .cg-title-trans-btn {
          width: 32px;
          height: 32px;
        }
        .cg-title-trans-btn .cg-trans-icon {
          width: 30px;
          height: 30px;
        }
        .cg-title-trans-btn:hover,
        .cg-title-trans-btn:focus-visible {
          width: 98px;
        }
        .cg-title-trans-btn.active:hover,
        .cg-title-trans-btn.active:focus-visible {
          width: 116px;
        }
        .cg-card-wrap {
          margin-bottom: 24px;
        }
        .cg-daily-ribbon {
          right: 24px;
          top: auto;
          bottom: -32px;
          width: 34px;
          height: 56px;
          z-index: 1;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 78%, 0% 100%);
        }
        .cg-daily-ribbon:hover {
          transform: translate3d(0, 3px, 0);
          opacity: 0.9;
        }
        .cg-card-wrap.daily-active .cg-daily-ribbon:hover {
          transform: translate3d(0, -3px, 0);
          opacity: 0.9;
        }

        /* MOBILE 2-STAGE SLIDE CHOREOGRAPHY (Vertical axis) */
        .cg-daily-card-outer {
          padding: 0;
          transform: translate3d(0, 0, 0);
        }
        .cg-card,
        .cg-daily-card-inner {
          padding: 18px 16px;
          border-radius: 20px;
        }

        /* Stage 1: Pull out to the bottom (behind black card) */
        .cg-card-wrap.daily-phase-out .cg-card-outer {
          transform: scale(0.975);
          opacity: 0.88;
        }
        .cg-card-wrap.daily-phase-out .cg-daily-card-outer {
          z-index: 1;
          transform: translate3d(0, 104%, 0);
        }
        .cg-card-wrap.daily-phase-out .cg-daily-card-inner {
          opacity: 1;
          pointer-events: auto;
        }

        /* Stage 2: Swapped in front & in center */
        .cg-card-wrap.daily-active .cg-card-outer {
          transform: scale(0.975);
          opacity: 0.88;
          pointer-events: none;
        }
        .cg-card-wrap.daily-active .cg-daily-card-outer {
          z-index: 5;
          transform: translate3d(0, 0, 0);
        }
        .cg-card-wrap.daily-active .cg-daily-card-inner {
          opacity: 1;
          pointer-events: auto;
        }

        /* Stage A of Closing: Slide down (in front) */
        .cg-card-wrap.daily-closing-out .cg-card-outer {
          transform: scale(0.975);
          opacity: 0.88;
        }
        .cg-card-wrap.daily-closing-out .cg-daily-card-outer {
          z-index: 5;
          transform: translate3d(0, 104%, 0);
        }
        .cg-card-wrap.daily-closing-out .cg-daily-card-inner {
          opacity: 1;
          pointer-events: auto;
        }

        /* Stage B of Closing: Drop behind black card & slide up into place */
        .cg-card-wrap.daily-tucking-in .cg-card-outer {
          transform: scale(1);
          opacity: 1;
        }
        .cg-card-wrap.daily-tucking-in .cg-daily-card-outer {
          z-index: 1;
          transform: translate3d(0, 0, 0);
        }
        .cg-card-wrap.daily-tucking-in .cg-daily-card-inner {
          opacity: 1;
          pointer-events: auto;
        }

        .cg-daily-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding-right: 0;
          margin-bottom: 12px;
        }
        .cg-daily-header-right {
          align-items: flex-start;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
        .cg-daily-title {
          font-size: 18px;
        }
        .cg-daily-desc {
          font-size: 12px;
        }
        .cg-daily-key-box {
          font-size: 13px;
        }
        .cg-daily-val-link {
          font-size: 13px;
          padding: 5px 12px;
        }
        .cg-explain-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .cg-saved-footer {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 4px;
        }
        .cg-order-group {
          flex-shrink: 0;
          display: flex;
          gap: 3px;
        }
        .cg-order-btn {
          width: 28px;
          height: 28px;
          font-size: 10px;
        }
        .cg-search-all-btn {
          flex: 1;
          width: auto;
          font-size: 11px;
          padding: 7px 8px;
          white-space: nowrap;
        }
        .cg-edit-btn {
          width: auto;
          padding: 7px 10px;
          font-size: 11px;
          flex-shrink: 0;
        }
        .cg-delete-btn {
          width: auto;
          padding: 7px 10px;
          font-size: 11px;
          flex-shrink: 0;
        }
        .cg-saved-search-box {
          min-width: 100%;
          max-width: 100%;
        }
        .cg-result-key-btn {
          padding: 4px 6px;
          font-size: 13px;
        }
        .cg-picker-tabs {
          gap: 4px;
          padding: 3px;
        }
        .cg-picker-tab {
          font-size: 11px;
          padding: 6px 4px;
          gap: 3px;
        }
        .cg-picker-tab-count {
          font-size: 10px;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Global Controller Object
  window.CharacterGenerator = {
    init: function () {
      injectStyles();
      if (window._pendingQuestConfigFromSheet) {
        window.CharacterGenerator.updateQuestConfigFromSheet(window._pendingQuestConfigFromSheet);
        window._pendingQuestConfigFromSheet = null;
      } else {
        fetchQuestConfigFromSheet();
      }
      renderApp();
      setupCGGestures();
    },
    updateQuestConfigFromSheet: function (cfg) {
      if (!cfg) return;
      let hasChange = false;
      if (cfg.mode !== undefined && cfg.mode !== null) {
        QUEST_CONFIG.mode = String(cfg.mode);
        hasChange = true;
      }
      if (cfg.intervalDays !== undefined && cfg.intervalDays !== null) {
        const intVal = parseInt(cfg.intervalDays, 10);
        if (!isNaN(intVal) && intVal >= 1) {
          QUEST_CONFIG.intervalDays = intVal;
          hasChange = true;
        }
      }
      if (cfg.startDate !== undefined && cfg.startDate) {
        QUEST_CONFIG.startDate = String(cfg.startDate);
        hasChange = true;
      }
      if (hasChange) {
        renderApp();
        if (isDailyMode) {
          updateDailyCountdownDOM();
        }
      }
    },
    undo: function () {
      cgUndo();
    },
    redo: function () {
      cgRedo();
    },
    showWordTooltip: function (targetEl, enWord, extraHint) {
      showCGTooltip(targetEl, enWord, extraHint);
    },
    hideWordTooltip: function () {
      hideCGTooltip();
    },
    onWordTouchStart: function (e, targetEl, enWord, extraHint) {
      const evt = e || window.event;
      if (!evt || !evt.touches || evt.touches.length === 0) return;
      const touch = evt.touches[0];
      cgTouchStartPos = { x: touch.clientX, y: touch.clientY };
      cgDidLongPress = false;
      if (cgLongPressTimer) {
        clearTimeout(cgLongPressTimer);
        cgLongPressTimer = null;
      }
      cgLongPressTimer = setTimeout(() => {
        cgDidLongPress = true;
        cgSuppressClickUntil = Date.now() + 650;
        showCGTooltip(targetEl, enWord, extraHint);
        if (navigator.vibrate) {
          try { navigator.vibrate(25); } catch (_) {}
        }
      }, 350);
    },
    onWordTouchMove: function (e) {
      const evt = e || window.event;
      if (!evt || !evt.touches || evt.touches.length === 0) return;
      const touch = evt.touches[0];
      const dist = Math.hypot(touch.clientX - cgTouchStartPos.x, touch.clientY - cgTouchStartPos.y);
      if (!cgDidLongPress) {
        if (dist > 18) {
          if (cgLongPressTimer) {
            clearTimeout(cgLongPressTimer);
            cgLongPressTimer = null;
          }
        }
      } else {
        if (dist > 35) {
          hideCGTooltip();
        }
      }
    },
    onWordTouchEnd: function () {
      if (cgLongPressTimer) {
        clearTimeout(cgLongPressTimer);
        cgLongPressTimer = null;
      }
      if (cgDidLongPress) {
        cgSuppressClickUntil = Date.now() + 650;
      }
    },
    toggleMainCardTranslations: function () {
      showMainCardTranslations = !showMainCardTranslations;
      try {
        localStorage.setItem('cg_show_main_translations', String(showMainCardTranslations));
      } catch (e) {}
      renderApp();
      showCGToast(showMainCardTranslations ? 'เปิดแสดงคำแปลภาษาไทย' : 'ปิดแสดงคำแปลภาษาไทย');
    },
    toggleShowTranslations: function () {
      showChipTranslations = !showChipTranslations;
      updateTraitPickerDOM();
    },
    openTraitPicker: function (key) {
      activeTraitPicker = key;
      traitSearchQuery = '';
      if (key === 'animal') {
        const cur = currentResult.animal;
        if (mgeRaces.includes(cur)) {
          traitSubFilter = 'mge';
        } else if (animals.includes(cur)) {
          traitSubFilter = 'animal';
        } else {
          traitSubFilter = 'all';
        }
      } else {
        traitSubFilter = 'all';
      }
      renderApp();
      setTimeout(() => {
        const input = document.getElementById("cg-trait-search-input");
        if (input) input.focus();
      }, 40);
    },
    setTraitSubFilter: function (sub) {
      traitSubFilter = sub;
      updateTraitPickerDOM();
    },
    closeTraitPicker: function () {
      activeTraitPicker = null;
      traitSearchQuery = '';
      renderApp();
    },
    onTraitSearch: function (query) {
      traitSearchQuery = query;
      updateTraitPickerDOM();
    },
    clearTraitSearch: function () {
      traitSearchQuery = '';
      const input = document.getElementById("cg-trait-search-input");
      if (input) {
        input.value = '';
        input.focus();
      }
      updateTraitPickerDOM();
    },
    selectTrait: function (key, value) {
      pushCGHistory();
      currentResult[key] = value;
      lockedState[key] = true;
      activeTraitPicker = null;
      traitSearchQuery = '';
      renderApp();
      showCGToast(`เลือก "${value}" เรียบร้อยแล้ว (ล็อกช่องนี้ไว้ให้อัตโนมัติ)`);
    },
    randomizeSingleSlot: function (key) {
      pushCGHistory();
      const pool = getTraitPool(key, traitSubFilter);
      if (pool && pool.length > 0) {
        const newVal = random(pool);
        currentResult[key] = newVal;
        renderApp();
        showCGToast(`สุ่มเฉพาะช่องนี้: ${newVal}`);
        setTimeout(() => {
          const input = document.getElementById("cg-trait-search-input");
          if (input) input.focus();
        }, 40);
      }
    },
    onSavedSearch: function (query) {
      savedSearchQuery = query;
      updateSavedListDOM();
    },
    clearSavedSearch: function () {
      savedSearchQuery = '';
      const input = document.getElementById("cg-saved-search-input");
      if (input) {
        input.value = '';
        input.focus();
      }
      updateSavedListDOM();
    },
    toggleLock: function (key) {
      if (lockedState.hasOwnProperty(key)) {
        lockedState[key] = !lockedState[key];
        renderApp();
      }
    },
    setMode: function (mode) {
      if (currentMode === mode) return;
      currentMode = mode;
      renderApp();
      animateModeSwitch(mode);
    },
    generate: function () {
      pushCGHistory();
      if (currentMode === "random") {
        currentResult = randomMode();
      } else {
        currentResult = smartMode();
      }
      delete currentResult._id;
      renderApp();
      animateLockedSlots();
    },
    saveResult: function () {
      try {
        if (savedList.length >= MAX_SAVED_ITEMS) {
          pendingAlertModal = `บันทึกผลลัพธ์ครบ ${MAX_SAVED_ITEMS} รายการแล้ว กรุณาลบบางรายการออกก่อนบันทึกใหม่ครับ`;
          renderApp();
          return;
        }

        // Reset saved search query so new card is immediately visible
        savedSearchQuery = '';

        // Capture existing cards positions for FLIP slide-down animation
        const firstPositionsMap = getCardPositions();

        const { _id, ...cleanResult } = currentResult;
        const newItem = { ...cleanResult, _id: 'cg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6) };
        savedList = [newItem, ...savedList];
        localStorage.setItem("savedCharacters", JSON.stringify(savedList));

        // Unlock all slots after saving!
        Object.keys(lockedState).forEach(k => { lockedState[k] = false; });

        renderApp();
        animateSaveInsert(firstPositionsMap, newItem._id);
      } catch (e) {
        console.error("Error saving character:", e);
      }
    },
    closeAlertModal: function () {
      pendingAlertModal = null;
      renderApp();
    },
    openSmartSettings: function () {
      pendingSmartModal = true;
      renderApp();
    },
    closeSmartSettings: function () {
      pendingSmartModal = false;
      renderApp();
    },
    saveSmartSettings: function () {
      const mgeChecked = document.getElementById("cfg-mge")?.checked;
      const animalsChecked = document.getElementById("cfg-animals")?.checked;

      if (!mgeChecked && !animalsChecked) {
        alert("กรุณาเลือกแหล่งข้อมูลอย่างน้อย 1 อย่างครับ");
        return;
      }

      smartConfig.includeMGE = !!mgeChecked;
      smartConfig.includeAnimals = !!animalsChecked;

      try {
        localStorage.setItem("cgSmartConfig", JSON.stringify(smartConfig));
      } catch (e) {
        console.error("Error saving cgSmartConfig:", e);
      }

      pendingSmartModal = false;
      renderApp();
    },
    editSaved: function (index) {
      try {
        const item = savedList[index];
        if (!item) return;

        const fields = ["animal", "theme", "object", "color", "personality", "clothing"];

        // Reset lockedState first
        fields.forEach(k => { lockedState[k] = false; });

        // Load available non-empty fields into currentResult and lock them
        fields.forEach(k => {
          if (item[k]) {
            currentResult[k] = item[k];
            lockedState[k] = true;
          }
        });

        delete currentResult._id;
        renderApp();

        // Smooth scroll to generator card top
        const rootEl = document.getElementById("character-generator-root");
        if (rootEl) {
          rootEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e) {
        console.error("Error editing saved character:", e);
      }
    },
    confirmDeleteField: function (cardIndex, fieldKey, fieldLabel, fieldValue) {
      pendingDeleteField = { cardIndex, fieldKey, fieldLabel, fieldValue };
      renderApp();
    },
    executeDeleteField: function () {
      if (pendingDeleteField) {
        const { cardIndex, fieldKey } = pendingDeleteField;
        if (savedList[cardIndex]) {
          delete savedList[cardIndex][fieldKey];
          const remainingKeys = Object.keys(savedList[cardIndex]).filter(k => k !== '_id');
          if (remainingKeys.length === 0) {
            savedList.splice(cardIndex, 1);
          }
          localStorage.setItem("savedCharacters", JSON.stringify(savedList));
        }
        pendingDeleteField = null;
        renderApp();
      }
    },
    cancelDeleteField: function () {
      pendingDeleteField = null;
      renderApp();
    },
    deleteSaved: function (index) {
      try {
        savedList = savedList.filter((_, i) => i !== index);
        localStorage.setItem("savedCharacters", JSON.stringify(savedList));
        renderApp();
      } catch (e) {
        console.error("Error deleting character:", e);
      }
    },
    moveSaved: function (index, direction) {
      try {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= savedList.length) return;
        const prevPositions = getCardPositions();
        const temp = savedList[index];
        savedList[index] = savedList[newIndex];
        savedList[newIndex] = temp;
        localStorage.setItem("savedCharacters", JSON.stringify(savedList));
        renderApp();
        animateFlip(prevPositions);
      } catch (e) {
        console.error("Error moving saved character:", e);
      }
    },
    toggleDailyMode: function () {
      if (isDailyAnimating) return;
      if (isDailyMode) {
        window.CharacterGenerator.closeDailyMode();
      } else {
        window.CharacterGenerator.openDailyMode();
      }
    },
    setDailyGenMode: function (mode) {
      dailyGenMode = String(mode);
      try { localStorage.setItem('cg_daily_mode', dailyGenMode); } catch (_) {}
      renderApp();
    },
    setDailyInterval: function (days) {
      dailyIntervalDays = parseInt(days, 10) || 1;
      try { localStorage.setItem('cg_daily_interval', String(dailyIntervalDays)); } catch (_) {}
      renderApp();
      updateDailyCountdownDOM();
    },
    openDailyMode: function () {
      if (isDailyAnimating || isDailyMode) return;
      isDailyAnimating = true;

      const cardWrap = document.querySelector('.cg-card-wrap');
      const dailyCard = document.getElementById('cg-daily-card-outer');
      const backdrop = document.getElementById('cg-daily-radial-backdrop');

      // Apply site-wide dynamic theme matching the daily challenge palette
      const dailyResult = getDailyChallengeResult();
      const dailyPalette = getDailyThemePalette(dailyResult.color);
      applyDailyTheme(dailyPalette);

      // Stage 1: Pull out to the right (or bottom on mobile) behind black card
      if (cardWrap) {
        cardWrap.classList.remove('daily-closing-out', 'daily-tucking-in', 'daily-active');
        cardWrap.classList.add('daily-phase-out');
      }

      setTimeout(() => {
        // Stage 2: Swap z-index to front (5) and slide back into center
        isDailyMode = true;
        if (dailyCard) dailyCard.setAttribute('aria-hidden', 'false');
        if (cardWrap) {
          cardWrap.classList.remove('daily-phase-out');
          cardWrap.classList.add('daily-active');
        }
        if (backdrop) backdrop.classList.add('active');

        startDailyCountdown();

        setTimeout(() => {
          isDailyAnimating = false;
        }, 380);
      }, 320);
    },
    closeDailyMode: function () {
      if (isDailyAnimating || !isDailyMode) return;
      isDailyAnimating = true;

      const cardWrap = document.querySelector('.cg-card-wrap');
      const dailyCard = document.getElementById('cg-daily-card-outer');
      const backdrop = document.getElementById('cg-daily-radial-backdrop');

      // Revert site-wide theme back to previous state
      revertDailyTheme();

      // Stage A: Slide out to right (or bottom on mobile) in front of black card
      if (cardWrap) {
        cardWrap.classList.remove('daily-active', 'daily-phase-out', 'daily-tucking-in');
        cardWrap.classList.add('daily-closing-out');
      }
      if (backdrop) backdrop.classList.remove('active');
      stopDailyCountdown();

      setTimeout(() => {
        // Stage B: Drop z-index behind black card (1) and slide back into resting position
        if (cardWrap) {
          cardWrap.classList.remove('daily-closing-out');
          cardWrap.classList.add('daily-tucking-in');
        }

        setTimeout(() => {
          if (cardWrap) {
            cardWrap.classList.remove('daily-tucking-in');
          }
          isDailyMode = false;
          if (dailyCard) dailyCard.setAttribute('aria-hidden', 'true');
          isDailyAnimating = false;
        }, 360);
      }, 300);
    },
    openDailyChallengeModal: function () {
      window.CharacterGenerator.openDailyMode();
    },
    closeDailyChallengeModal: function () {
      window.CharacterGenerator.closeDailyMode();
    },
    copyDailyChallenge: function () {
      const daily = getDailyChallengeResult();
      const seed = getDailySeed();
      const titleStr = seed.interval === 1
        ? `โจทย์ชาเลนจ์ประจำวัน (${seed.formattedThai})`
        : `โจทย์ชาเลนจ์ (${seed.interval}-Day Quest: ${seed.cycleRangeStr})`;
      const text = [
        titleStr,
        `• Species (เผ่าพันธุ์): ${daily.animal}${getThaiTranslation(daily.animal) ? ` (${getThaiTranslation(daily.animal)})` : ''}`,
        `• Theme (ธีม): ${daily.theme}${getThaiTranslation(daily.theme) ? ` (${getThaiTranslation(daily.theme)})` : ''}`,
        `• Object (ไอเทม): ${daily.object}${getThaiTranslation(daily.object) ? ` (${getThaiTranslation(daily.object)})` : ''}`,
        `• Color (สี): ${daily.color}${getThaiTranslation(daily.color) ? ` (${getThaiTranslation(daily.color)})` : ''}`,
        `• Personality (นิสัย): ${daily.personality}${getThaiTranslation(daily.personality) ? ` (${getThaiTranslation(daily.personality)})` : ''}`,
        `• Clothing (ชุด): ${daily.clothing}${getThaiTranslation(daily.clothing) ? ` (${getThaiTranslation(daily.clothing)})` : ''}`,
        '',
        '#DailyOCAdopt #สุ่มวาดOC',
        'https://toruotora.github.io/Portfolio/'
      ].join('\n');

      function copyTextFallback(str) {
        const ta = document.createElement('textarea');
        ta.value = str;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showCGToast("คัดลอกโจทย์และแฮชแท็กเรียบร้อยแล้ว!");
        } catch (e) {
          showCGToast("ไม่สามารถคัดลอกข้อความได้");
        }
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showCGToast("คัดลอกโจทย์และแฮชแท็กเรียบร้อยแล้ว!");
        }).catch(() => {
          copyTextFallback(text);
        });
      } else {
        copyTextFallback(text);
      }
    },
    loadDailyToMainCard: function () {
      const daily = getDailyChallengeResult();
      pushCGHistory();
      const fields = ['animal', 'theme', 'object', 'color', 'personality', 'clothing'];
      fields.forEach(k => {
        lockedState[k] = false;
        currentResult[k] = daily[k];
      });
      delete currentResult._id;
      window.CharacterGenerator.closeDailyMode();
      renderApp();
      showCGToast("โหลดโจทย์ประจำวันลงในการ์ดสุ่มเรียบร้อย!");
    }
  };

  // ── Multi-Touch Gestures for Character Generator (2-finger tap: Undo | 3-finger tap: Redo) ──
  function setupCGGestures() {
    const root = document.getElementById("character-generator-root");
    if (!root || root._gesturesAttached) return;
    root._gesturesAttached = true;

    let maxTouches = 0;
    let startTime = 0;
    let startPoints = [];
    let hasMoved = false;

    root.addEventListener('touchstart', (e) => {
      const currentTouches = e.touches.length;
      if (currentTouches > maxTouches) maxTouches = currentTouches;

      if (currentTouches >= 2) {
        startTime = Date.now();
        hasMoved = false;
        startPoints = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
      }
    }, { passive: true });

    root.addEventListener('touchmove', (e) => {
      if (hasMoved || startPoints.length < 2) return;
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const p = startPoints[i];
        if (p && Math.hypot(t.clientX - p.x, t.clientY - p.y) > 15) {
          hasMoved = true;
          break;
        }
      }
    }, { passive: true });

    root.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        const duration = Date.now() - startTime;
        if (!hasMoved && duration >= 40 && duration <= 380) {
          if (maxTouches === 2) {
            cgUndo();
          } else if (maxTouches === 3) {
            cgRedo();
          }
        }
        maxTouches = 0;
        hasMoved = false;
        startPoints = [];
      }
    }, { passive: true });

    root.addEventListener('touchcancel', () => {
      maxTouches = 0;
      hasMoved = false;
      startPoints = [];
    });
  }

  // ── Swipe Gestures for Character Generator Card (Swipe Left: Undo | Swipe Right: Redo) ──
  function setupCGCardSwipe() {
    const outer = document.getElementById('cg-card-outer');
    const card = document.getElementById('cg-card');
    const slotRedo = document.getElementById('cg-slot-redo');
    const slotUndo = document.getElementById('cg-slot-undo');
    const actionRedo = document.getElementById('cg-action-redo');
    const actionUndo = document.getElementById('cg-action-undo');

    if (!outer || !card) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isHorizontalGesture = false;
    let activePointerId = null;

    const threshold = 45;
    const maxOffset = 115;

    card.setAttribute('title', 'เลื่อนซ้าย: (Undo) | เลื่อนขวา: (Redo)');

    function handleStart(clientX, clientY, target, pointerId) {
      if (target.closest('button, a, input, select, textarea')) {
        return false;
      }
      isDragging = true;
      startX = clientX;
      startY = clientY;
      currentX = 0;
      isHorizontalGesture = false;
      activePointerId = pointerId;

      card.classList.add('is-dragging');
      card.style.transition = 'none';
      if (slotUndo) slotUndo.style.transition = 'none';
      if (slotRedo) slotRedo.style.transition = 'none';
      if (actionUndo) actionUndo.style.transition = 'none';
      if (actionRedo) actionRedo.style.transition = 'none';
      return true;
    }

    function handleMove(clientX, clientY) {
      if (!isDragging) return;
      const diffX = clientX - startX;
      const diffY = clientY - startY;

      if (!isHorizontalGesture) {
        if (Math.abs(diffX) > 6 && Math.abs(diffX) > Math.abs(diffY)) {
          isHorizontalGesture = true;
        } else if (Math.abs(diffY) > 8) {
          handleEnd(false);
          return;
        }
      }

      if (isHorizontalGesture) {
        currentX = Math.max(-maxOffset, Math.min(maxOffset, diffX * 0.65));
        card.style.transform = `translateX(${currentX}px)`;

        const gapWidth = Math.abs(currentX);
        const isReady = gapWidth >= threshold;

        if (currentX < 0) {
          // Slide left -> reveal right slot (Undo)
          if (slotUndo) slotUndo.style.width = gapWidth + 'px';
          if (slotRedo) slotRedo.style.width = '0px';

          if (actionUndo) {
            actionUndo.style.opacity = Math.min(1, gapWidth / 28);
            actionUndo.style.transform = `scale(${Math.min(1, 0.8 + (gapWidth / threshold) * 0.2)})`;
            actionUndo.classList.toggle('ready', isReady);
          }
          if (actionRedo) {
            actionRedo.style.opacity = '0';
            actionRedo.classList.remove('ready');
          }
        } else if (currentX > 0) {
          // Slide right -> reveal left slot (Redo)
          if (slotRedo) slotRedo.style.width = gapWidth + 'px';
          if (slotUndo) slotUndo.style.width = '0px';

          if (actionRedo) {
            actionRedo.style.opacity = Math.min(1, gapWidth / 28);
            actionRedo.style.transform = `scale(${Math.min(1, 0.8 + (gapWidth / threshold) * 0.2)})`;
            actionRedo.classList.toggle('ready', isReady);
          }
          if (actionUndo) {
            actionUndo.style.opacity = '0';
            actionUndo.classList.remove('ready');
          }
        } else {
          if (slotUndo) slotUndo.style.width = '0px';
          if (slotRedo) slotRedo.style.width = '0px';
          if (actionUndo) { actionUndo.style.opacity = '0'; actionUndo.classList.remove('ready'); }
          if (actionRedo) { actionRedo.style.opacity = '0'; actionRedo.classList.remove('ready'); }
        }
      }
    }

    function handleEnd(commit = true) {
      if (!isDragging) return;
      isDragging = false;
      activePointerId = null;
      card.classList.remove('is-dragging');

      let triggered = false;
      if (commit && isHorizontalGesture) {
        if (currentX <= -threshold) {
          cgUndo(true);
          triggered = true;
        } else if (currentX >= threshold) {
          cgRedo(true);
          triggered = true;
        }
      }

      const easeCurve = 'cubic-bezier(0.25, 1, 0.5, 1)';
      card.style.transition = `transform 0.5s ${easeCurve}`;
      card.style.transform = 'translateX(0px)';

      if (slotUndo) {
        slotUndo.style.transition = `width 0.5s ${easeCurve}`;
        slotUndo.style.width = '0px';
      }
      if (slotRedo) {
        slotRedo.style.transition = `width 0.5s ${easeCurve}`;
        slotRedo.style.width = '0px';
      }

      if (actionUndo) {
        actionUndo.classList.remove('ready');
        actionUndo.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        actionUndo.style.opacity = '0';
        actionUndo.style.transform = 'scale(0.85)';
      }
      if (actionRedo) {
        actionRedo.classList.remove('ready');
        actionRedo.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        actionRedo.style.opacity = '0';
        actionRedo.style.transform = 'scale(0.85)';
      }

      setTimeout(() => {
        card.style.transition = '';
        if (slotUndo) slotUndo.style.transition = '';
        if (slotRedo) slotRedo.style.transition = '';
        if (actionUndo) actionUndo.style.transition = '';
        if (actionRedo) actionRedo.style.transition = '';
        if (triggered) {
          renderApp();
        }
      }, 520);
    }

    card.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (handleStart(e.clientX, e.clientY, e.target, e.pointerId)) {
        try { card.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });

    card.addEventListener('pointermove', (e) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        handleMove(e.clientX, e.clientY);
        if (isHorizontalGesture && e.cancelable) {
          e.preventDefault();
        }
      }
    });

    card.addEventListener('pointerup', (e) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        try { card.releasePointerCapture(e.pointerId); } catch (_) {}
        handleEnd(true);
      }
    });

    card.addEventListener('pointercancel', (e) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        try { card.releasePointerCapture(e.pointerId); } catch (_) {}
        handleEnd(false);
      }
    });
  }

  // Keyboard shortcuts (Escape & Ctrl+Z / Ctrl+Y)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isDailyMode) {
        window.CharacterGenerator.closeDailyMode();
        return;
      }
      if (activeTraitPicker) {
        window.CharacterGenerator.closeTraitPicker();
        return;
      }
      if (pendingDeleteField) window.CharacterGenerator.cancelDeleteField();
      if (pendingAlertModal) window.CharacterGenerator.closeAlertModal();
      if (pendingSmartModal) window.CharacterGenerator.closeSmartSettings();
    }
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
    if (!isInput) {
      const root = document.getElementById("character-generator-root");
      const isOverRoot = root && (
        root.contains(e.target) ||
        root.contains(document.activeElement) ||
        root.matches(':hover') ||
        (document.querySelector('#character-generator-root:hover') !== null)
      );
      if (isOverRoot) {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        const key = (e.key || '').toLowerCase();
        const code = e.code || '';
        if (isCtrlOrCmd && (code === 'KeyZ' || key === 'z')) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (e.shiftKey) {
            cgRedo();
          } else {
            cgUndo();
          }
          return;
        } else if (isCtrlOrCmd && (code === 'KeyY' || key === 'y')) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          cgRedo();
          return;
        }
      }
    }
  });

  // Auto Init on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.CharacterGenerator.init());
  } else {
    window.CharacterGenerator.init();
  }
})();

