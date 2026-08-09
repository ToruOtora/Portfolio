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
    "Rose Crown", "Butterfly Pin", "Spider Ring", "Crow Feather", "Wolf Fang", "Cat Bell", "Rabbit Doll", "Shark Tooth", "Jellyfish Lamp"
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
    "Arcade", "Zombie", "Vampire", "Werewolf", "Haunted Mansion"
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
    "Galaxy Purple & Cyan"
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
    "Dreamlike", "Softhearted", "Heartless", "Obsessively Loving", "Hopelessly Devoted"
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
    "Galaxy Printed Hoodie", "Moon & Stars Kimono", "Crow Feather Jacket", "Fox Spirit Kimono", "Wolf Fur Armor", "Butterfly Fairy Dress"
  ];

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
  let currentMode = "random"; // 'random' | 'smart'
  let currentResult = randomMode();
  let savedList = [];
  let pendingDeleteField = null; // { cardIndex, fieldKey, fieldLabel, fieldValue }
  let pendingAlertModal = null; // alert message string
  let pendingSmartModal = false; // boolean for settings modal

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

    // Build saved items HTML
    let savedHTML = "";
    if (savedList.length === 0) {
      savedHTML = `
        <div class="cg-empty-state">
          <div class="cg-empty-icon">🎨</div>
          <p class="cg-empty-title">ยังไม่มีรายการที่บันทึกไว้</p>
          <p class="cg-empty-sub">กดปุ่ม "⭐ Save" ด้านบนเพื่อบันทึกไอเดียตัวละครที่ชอบ</p>
        </div>
      `;
    } else {
      savedHTML = savedList.map((item, index) => {
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

        // Filter and build rows only for available non-empty fields
        const rowsHTML = fields
          .filter(f => item[f.key])
          .map(f => `
            <div class="cg-saved-row">
              <span class="cg-saved-key">${f.icon} ${f.label}</span>
              <div class="cg-saved-val-group">
                <a href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(item[f.key])}" target="_blank" rel="noopener noreferrer" class="cg-pin-link">${item[f.key]} ></a>
                <button class="cg-row-delete-btn" onclick="CharacterGenerator.confirmDeleteField(${index}, '${f.key}', '${f.label}', '${item[f.key]}')" title="ลบเฉพาะ ${f.label}">✕</button>
              </div>
            </div>
          `).join("");

        // Build search query from remaining fields
        const queryTerms = fields.map(f => item[f.key]).filter(Boolean);
        const fullQuery = queryTerms.join(" ");

        const isFirst = index === 0;
        const isLast = index === savedList.length - 1;

        return `
          <div class="cg-saved-card" data-index="${index}" data-id="${item._id}">
            <div class="cg-saved-content">
              ${rowsHTML}
            </div>

            <!-- ACTION FOOTER: Reorder buttons, Pinterest Search, Edit button, Delete button -->
            <div class="cg-saved-footer">
              <div class="cg-order-group">
                <button class="cg-order-btn" onclick="CharacterGenerator.moveSaved(${index}, -1)" ${isFirst ? 'disabled' : ''} title="เลื่อนขึ้น">▲</button>
                <button class="cg-order-btn" onclick="CharacterGenerator.moveSaved(${index}, 1)" ${isLast ? 'disabled' : ''} title="เลื่อนลง">▼</button>
              </div>

              <a href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(fullQuery)}" target="_blank" rel="noopener noreferrer" class="cg-search-all-btn">
                🔍 Search on Pinterest
              </a>
              <button class="cg-edit-btn" onclick="CharacterGenerator.editSaved(${index})" title="นำข้อมูลนี้กลับไปที่กล่องสุ่มและล็อกไว้">
                ⚙️
              </button>
              <button class="cg-delete-btn" onclick="CharacterGenerator.deleteSaved(${index})" title="ลบทั้งการ์ด">
                🗑️ ลบ
              </button>
            </div>
          </div>
        `;
      }).join("");
    }

    // Build result entries HTML (Filtered to exclude internal _id property)
    const resultEntries = Object.entries(currentResult)
      .filter(([key]) => key !== "_id")
      .map(([key, val]) => {
        const isCurrentMGE = key === "animal" && mgeRaces.includes(val);
        const meta = key === "animal"
          ? (isCurrentMGE ? { label: "Species", icon: "🧜‍♀️" } : { label: "Animal", icon: "🐱" })
          : (keyLabels[key] || { label: key, icon: "📌" });
        const isLocked = !!lockedState[key];
        return `
          <div class="cg-result-row ${isLocked ? 'is-locked-row' : ''}" data-key="${key}">
            <span class="cg-result-key">
              <span class="cg-icon">${meta.icon}</span>
              <span>${meta.label}</span>
            </span>
            <div class="cg-result-right">
              <a href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(val)}" target="_blank" rel="noopener noreferrer" class="cg-result-val-link" title="ค้นหา ${val} ใน Pinterest">
                <span>${val}</span>
              </a>
              <button class="cg-lock-btn ${isLocked ? 'locked' : ''}" data-key="${key}" onclick="CharacterGenerator.toggleLock('${key}')" title="${isLocked ? 'ปลดล็อก' : 'ล็อกค่านี้ไว้'}">
                ${isLocked ? '🔒' : '🔓'}
              </button>
            </div>
          </div>
        `;
      }).join("");

    root.innerHTML = `
      <div class="cg-container">
        <!-- HEADER -->
        <div class="cg-header-block">
          <h1 class="cg-title">Character Randomizer</h1>
          <p class="cg-subtitle">✨ OC idea randomizer for artists & creators</p>
        </div>

        <!-- MODE SWITCHER BUTTONS -->
        <div class="cg-mode-group ${isSmart ? 'is-smart' : ''}">
          <div class="cg-mode-indicator"></div>
          <button class="cg-mode-btn ${isRandom ? 'active' : ''}" onclick="CharacterGenerator.setMode('random')">
            <span class="cg-mode-icon">🎲</span> Random Everything
          </button>
          <button class="cg-mode-btn ${isSmart ? 'active' : ''}" onclick="CharacterGenerator.setMode('smart')">
            <span class="cg-mode-icon">🧠</span> Smart Match
            ${isSmart ? `
              <span class="cg-wrench-btn" onclick="event.stopPropagation(); CharacterGenerator.openSmartSettings()" title="ตั้งค่าเผ่าพันธุ์ & การสุ่ม">
                🔧
              </span>
            ` : ''}
          </button>
        </div>

        <!-- RESULT CARD -->
        <div class="cg-card">
          <div class="cg-result-list">
            ${resultEntries}
          </div>

          <div class="cg-action-group">
            <button class="cg-btn cg-btn-generate" onclick="CharacterGenerator.generate()">
              ⚡ random
            </button>
            <button class="cg-btn cg-btn-save" onclick="CharacterGenerator.saveResult()">
              ⭐ Save Result
            </button>
          </div>
        </div>

        <!-- SAVED RESULTS SECTION -->
        <div class="cg-saved-section">
          <div class="cg-saved-header">
            <h2 class="cg-saved-title">Saved Results</h2>
            <span class="cg-saved-count">${savedList.length} / 15</span>
          </div>
          <div class="cg-saved-grid">
            ${savedHTML}
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
            <span class="cg-explain-badge">🔒 Slot Lock</span>
            <span class="cg-explain-text">กดแม่กุญแจเพื่อล็อกค่าที่ชอบไว้ แล้วสุ่มใหม่เฉพาะช่องที่ไม่ได้ล็อก</span>
          </div>
          <div class="cg-explain-item">
            <span class="cg-explain-badge">🔍 Pinterest Search</span>
            <span class="cg-explain-text">คลิกที่ชื่อคำสุ่มเพื่อค้นหาภาพไอเดียและเรฟแต่งตัวบน Pinterest ได้ทันที</span>
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
              <h3 class="cg-modal-title">บันทึกเต็มแล้ว (15/15)</h3>
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
                    <span class="cg-setting-title">🧜‍♀️ เผ่าพันธุ์ Monster Girl (MGE)</span>
                    <span class="cg-setting-sub">Lamia, Harpy, Dullahan, Slime Girl, Succubus, Arachne, Alraune ฯลฯ</span>
                  </div>
                </label>

                <label class="cg-setting-item">
                  <input type="checkbox" id="cfg-animals" ${smartConfig.includeAnimals ? 'checked' : ''}>
                  <div class="cg-setting-info">
                    <span class="cg-setting-title">🐱 สัตว์ทั่วไป (Standard Animals)</span>
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
        text-align: center;
        margin-bottom: 24px;
      }
      .cg-title {
        font-size: 36px;
        font-weight: 800;
        margin-bottom: 6px;
        color: var(--text);
        letter-spacing: -0.5px;
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
      .cg-card {
        border: 1px solid var(--line);
        background: var(--bg2);
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
      }
      .cg-result-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 4px;
        border-bottom: 1px solid var(--line);
        transition: all 0.2s ease;
      }
      .cg-result-row:last-child {
        border-bottom: none;
      }
      .cg-result-row.is-locked-row {
        background: rgba(255, 71, 87, 0.05);
        border-radius: 8px;
      }
      .cg-result-key {
        font-weight: 700;
        font-size: 15px;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cg-icon {
        font-size: 16px;
      }
      .cg-result-right {
        display: flex;
        align-items: center;
        gap: 8px;
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
        font-size: 13px;
        transition: all 0.2s ease;
        color: var(--text);
        padding: 0;
        flex-shrink: 0;
      }
      .cg-lock-btn:hover {
        background: var(--line2);
        transform: scale(1.08);
      }
      .cg-lock-btn.locked {
        background: rgba(255, 71, 87, 0.15);
        border-color: #ff4757;
        color: #ff4757;
        box-shadow: 0 0 10px rgba(255, 71, 87, 0.25);
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
        align-items: center;
        gap: 10px;
        margin-bottom: 18px;
        padding-left: 8px;
      }
      .cg-saved-title {
        font-size: 22px;
        font-weight: 800;
        color: var(--text);
        display: inline-block;
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
      }
      .cg-pin-link {
        color: #ff4757;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
        transition: 0.2s;
      }
      .cg-pin-link:hover {
        text-decoration: underline;
        color: #e60023;
      }
      .cg-saved-val-group {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .cg-row-delete-btn {
        background: transparent;
        border: none;
        color: var(--text3);
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        padding: 2px 5px;
        border-radius: 50%;
        opacity: 0.5;
        transition: all 0.2s ease;
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
      }
      .cg-wrench-btn:hover {
        background: var(--text);
        color: var(--bg);
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

      /* CONFIRMATION MODAL */
      .cg-modal-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: rgba(0, 0, 0, 0.65) !important;
        backdrop-filter: blur(4px) !important;
        -webkit-backdrop-filter: blur(4px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 99999999 !important;
        padding: 20px !important;
        animation: cgFadeIn 0.2s ease !important;
      }
      .cg-modal-box {
        background: var(--bg2);
        border: 1px solid var(--line);
        border-radius: 24px;
        padding: 28px 24px;
        max-width: 380px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      .cg-modal-icon {
        font-size: 36px;
        margin-bottom: 12px;
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
        padding: 9px 14px;
        background: var(--bg3);
        color: #ff4757;
        border: 1.5px solid #ff4757;
        border-radius: 50px;
        font-weight: 700;
        font-size: 13px;
        text-decoration: none;
        transition: all 0.2s ease;
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
        padding: 9px 14px;
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
        padding: 9px 12px;
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
        .cg-title {
          font-size: 28px;
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
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Global Controller Object
  window.CharacterGenerator = {
    init: function () {
      injectStyles();
      renderApp();
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
        if (savedList.length >= 15) {
          pendingAlertModal = "บันทึกผลลัพธ์ครบ 15 รายการแล้ว กรุณาลบบางรายการออกก่อนบันทึกใหม่ครับ";
          renderApp();
          return;
        }

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
    }
  };

  // Close modal on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (pendingDeleteField) window.CharacterGenerator.cancelDeleteField();
      if (pendingAlertModal) window.CharacterGenerator.closeAlertModal();
    }
  });

  // Auto Init on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.CharacterGenerator.init());
  } else {
    window.CharacterGenerator.init();
  }
})();
