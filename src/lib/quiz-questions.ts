export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "oak-name",
    question: "What is the roaming tree NPC called in Heartopia?",
    options: ["Oak-Oak", "Timber Tom", "Rooty", "Mr. Branch"],
    correctIndex: 0,
  },
  {
    id: "fluorite-tool",
    question: "Which tool do you use to harvest Flawless Fluorite?",
    options: ["Fishing rod", "Pickaxe", "Watering can", "Bug net"],
    correctIndex: 1,
  },
  {
    id: "oak-tool",
    question: "Which tool frees Oak-Oak from his roots?",
    options: ["Shovel", "Axe", "Hammer", "Scythe"],
    correctIndex: 1,
  },
  {
    id: "daily-requests",
    question: "How many Daily Resident Requests can you complete per day?",
    options: ["3", "5", "7", "10"],
    correctIndex: 1,
  },
  {
    id: "reset-time",
    question: "When does the daily server reset happen?",
    options: ["12:00 AM", "6:00 AM server time", "12:00 PM", "6:00 PM"],
    correctIndex: 1,
  },
  {
    id: "oak-timber-yield",
    question: "How many Roaming Oak Timber do you get per day from Oak-Oak?",
    options: ["1", "3", "5", "10"],
    correctIndex: 1,
  },
  {
    id: "fluorite-yield",
    question: "How many Flawless Fluorite can you collect per day?",
    options: ["1", "3", "5", "Unlimited"],
    correctIndex: 1,
  },
  {
    id: "unlock-forest",
    question: "Which quest line unlocks Oak-Oak?",
    options: ["Astralis in Forest", "Astralis in Onsen Mountain", "Cozy Café", "Flower Festival"],
    correctIndex: 0,
  },
  {
    id: "unlock-fluorite",
    question: "Which quest unlocks daily Flawless Fluorite spawns?",
    options: ["Astralis in Forest", "Astralis in Onsen Mountain", "Pet Paradise", "Garden Glory"],
    correctIndex: 1,
  },
  {
    id: "dg-level-oak",
    question: "What D.G. Member level is required to unlock Oak-Oak?",
    options: ["Level 4", "Level 6", "Level 10", "Level 14"],
    correctIndex: 1,
  },
  {
    id: "fishing-mentor",
    question: "Who is the Fishing mentor in Heartopia?",
    options: ["Massimo", "Vanya", "Blanc", "Naniwa"],
    correctIndex: 1,
  },
  {
    id: "cooking-mentor",
    question: "Who is the Cooking mentor in Heartopia?",
    options: ["Massimo", "Vanya", "Blanc", "Dorothee"],
    correctIndex: 0,
  },
  {
    id: "clothing-shop",
    question: "Who runs the clothing store on Residential Street?",
    options: ["Bob", "Dorothee", "Ka Ching", "Mrs. Joan"],
    correctIndex: 1,
  },
  {
    id: "mole-fluorite",
    question: "What hides beneath the Flawless Fluorite deposit?",
    options: ["A fox", "A mole with glasses", "A capybara", "A penguin"],
    correctIndex: 1,
  },
  {
    id: "max-plots",
    question: "What is the current maximum number of home plots you can own?",
    options: ["4", "8", "9", "12"],
    correctIndex: 2,
  },
  {
    id: "mayor-npc",
    question: "Who is the mayor of Heartopia?",
    options: ["Atara", "Vanya", "Massimo", "Ka Ching"],
    correctIndex: 0,
  },
  {
    id: "gardening-mentor",
    question: "Who is the Gardening mentor in Heartopia?",
    options: ["Blanc", "Vanya", "Dorothee", "Bob"],
    correctIndex: 0,
  },
  {
    id: "general-store",
    question: "Who runs the general store in Heartopia?",
    options: ["Ka Ching", "Dorothee", "Mrs. Joan", "Atara"],
    correctIndex: 0,
  },
  {
    id: "builder-npc",
    question: "Which NPC helps you with construction and building?",
    options: ["Builder Bob", "Massimo", "Blanc", "Vernie"],
    correctIndex: 0,
  },
  {
    id: "dg-guild-name",
    question: "What is the main progression guild called in Heartopia?",
    options: ["D.G. Member's Guild", "Cozy Crafters", "Starlight Society", "Heartopia Rangers"],
    correctIndex: 0,
  },
  {
    id: "fishing-unlock",
    question: "When can you start Fishing in Heartopia?",
    options: ["From the tutorial", "D.G. Level 6", "D.G. Level 12", "After buying a boat"],
    correctIndex: 0,
  },
  {
    id: "gardening-unlock",
    question: "When can you start Gardening in Heartopia?",
    options: ["From the tutorial", "D.G. Level 6", "D.G. Level 8", "After your second plot"],
    correctIndex: 0,
  },
  {
    id: "cooking-unlock-level",
    question: "At which D.G. Member level do you unlock Cooking?",
    options: ["Level 4", "Level 6", "Level 10", "Level 12"],
    correctIndex: 1,
  },
  {
    id: "bug-catching-unlock",
    question: "At which D.G. Member level do you unlock Bug Catching?",
    options: ["Level 4", "Level 6", "Level 10", "Level 14"],
    correctIndex: 1,
  },
  {
    id: "birdwatching-unlock",
    question: "At which D.G. Member level do you unlock Birdwatching?",
    options: ["Level 4", "Level 6", "Level 10", "Level 14"],
    correctIndex: 1,
  },
  {
    id: "cat-care-unlock",
    question: "At which D.G. Member level do you unlock Cat Care?",
    options: ["Level 6", "Level 10", "Level 12", "Level 14"],
    correctIndex: 2,
  },
  {
    id: "dog-care-unlock",
    question: "At which D.G. Member level do you unlock Dog Care?",
    options: ["Level 6", "Level 10", "Level 12", "Level 14"],
    correctIndex: 2,
  },
  {
    id: "painting-unlock",
    question: "At which D.G. Member level do you unlock Painting?",
    options: ["Level 6", "Level 10", "Level 12", "Level 14"],
    correctIndex: 3,
  },
  {
    id: "hobby-count",
    question: "How many main hobbies can you master in Heartopia?",
    options: ["5", "6", "7", "9"],
    correctIndex: 2,
  },
  {
    id: "friend-request-cost",
    question: "How many Stars does it cost to send a friend request in Heartopia?",
    options: ["0", "1", "5", "10"],
    correctIndex: 1,
  },
  {
    id: "redeem-codes-menu",
    question: "Where do you redeem gift codes in Heartopia?",
    options: ["Mailbox only", "Watch → Settings", "Mayor's office", "General store checkout"],
    correctIndex: 1,
  },
  {
    id: "plot-unlock-level-4",
    question: "At which D.G. level can you unlock your 3rd and 4th home plots?",
    options: ["Level 2", "Level 4", "Level 6", "Level 8"],
    correctIndex: 1,
  },
  {
    id: "plot-unlock-level-6",
    question: "At which D.G. level can you unlock your 5th home plot?",
    options: ["Level 4", "Level 6", "Level 8", "Level 10"],
    correctIndex: 1,
  },
  {
    id: "plot-unlock-level-8",
    question: "At which D.G. level can you unlock your 6th home plot?",
    options: ["Level 4", "Level 6", "Level 8", "Level 10"],
    correctIndex: 2,
  },
  {
    id: "first-fishing-rod",
    question: "Who gives you your first fishing rod in Heartopia?",
    options: ["Atara", "Vanya", "Massimo", "Ka Ching"],
    correctIndex: 1,
  },
  {
    id: "premium-currency",
    question: "What is Heartopia's premium currency called?",
    options: ["Moonlight Crystals", "Wishing Stars", "Gold Coins", "Heart Tokens"],
    correctIndex: 0,
  },
  {
    id: "wishing-star-use",
    question: "Wishing Stars are often used for gacha pulls and what else?",
    options: ["Paying plot taxes", "Sending friend requests", "Buying pickaxes", "Renting boats"],
    correctIndex: 1,
  },
  {
    id: "bug-catching-tool",
    question: "Which tool do you use for Bug Catching?",
    options: ["Bug net", "Pickaxe", "Camera", "Fishing rod"],
    correctIndex: 0,
  },
  {
    id: "birdwatching-tool",
    question: "Which tool do you use for Birdwatching?",
    options: ["Bug net", "Camera", "Watering can", "Axe"],
    correctIndex: 1,
  },
  {
    id: "daily-request-reward",
    question: "Daily Resident Requests mainly reward Gold and what else?",
    options: ["Contribution Medals", "Moonlight Crystals", "Roaming Oak Timber", "Flawless Fluorite"],
    correctIndex: 0,
  },
  {
    id: "f2p-question",
    question: "Is Heartopia free to play?",
    options: ["Yes, with optional purchases", "No, subscription only", "PC only with a fee", "Mobile only with a fee"],
    correctIndex: 0,
  },
  {
    id: "platforms",
    question: "On which platforms can you play Heartopia?",
    options: ["iOS and Android only", "PC only", "iOS, Android, and PC", "Nintendo Switch only"],
    correctIndex: 2,
  },
  {
    id: "cross-platform",
    question: "Does Heartopia support cross-platform play?",
    options: ["Yes", "No, mobile only", "No, PC only", "Only between iOS and Android"],
    correctIndex: 0,
  },
  {
    id: "annie-role",
    question: "Annie in Heartopia is best known for what shop theme?",
    options: ["Music and sheet music", "Fishing bait", "Garden seeds", "Bug cages"],
    correctIndex: 0,
  },
  {
    id: "goldfish-rarity",
    question: "A common pond fish like Goldfish is usually which rarity?",
    options: ["1 star", "3 stars", "5 stars", "Limited event only"],
    correctIndex: 0,
  },
  {
    id: "cooking-purpose",
    question: "Why do players cook dishes in Heartopia?",
    options: ["Only for quests", "Restore energy and earn Gold", "Unlock home plots", "Tame wild pets"],
    correctIndex: 1,
  },
  {
    id: "gardening-purpose",
    question: "What is a main reason to grow crops in Heartopia?",
    options: ["Craft pickaxes", "Ingredients for cooking", "Unlock fishing spots", "Spawn Oak-Oak"],
    correctIndex: 1,
  },
  {
    id: "dog-requires-cat",
    question: "Dog Care requires which hobby to be unlocked first?",
    options: ["Cat Care", "Birdwatching", "Painting", "Bug Catching"],
    correctIndex: 0,
  },
  {
    id: "code-reward-mailbox",
    question: "After redeeming a code, where do rewards usually arrive?",
    options: ["Your mailbox", "Ka Ching's counter", "Directly in your Watch", "The mayor's desk"],
    correctIndex: 0,
  },
  {
    id: "uid-purpose",
    question: "What do players exchange when adding friends in Heartopia?",
    options: ["Home plot numbers", "Player UIDs", "D.G. level codes", "Recipe IDs"],
    correctIndex: 1,
  },
];

export function pickRandomQuestions(count: number): QuizQuestion[] {
  const pool = [...QUIZ_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
