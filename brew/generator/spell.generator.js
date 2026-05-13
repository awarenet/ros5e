import fs from "node:fs";

const classSource = "RuinsOfSymbaroumC";
const subclassSource = "RuinsOfSymbaroumSC";
const spellSource = "RuinsOfSymbaroumS";
const classes = {
    "blood": {
        class: "Mystic",
        subclass: "Blood Mage"
    },
    "theurg": {
        class: "Mystic",
        subclass: "Theurg"
    },
    "symbolist": {
        class: "Mystic",
        subclass: "Symbolist"
    },
    "staff": {
        class: "Mystic",
        subclass: "Staff Mage"
    },
    "sorc": {
        class: "Mystic",
        subclass: "Sorcerer"
    },
    "self": {
        class: "Mystic",
        subclass: "Self-taught"
    },
    "crafter": {
        class: "Mystic",
        subclass: "Artifact Crafter"
    },
    "singer": {
        class: "Mystic",
        subclass: "Troll Singer"
    },
    "wizard": {
        class: "Mystic",
        subclass: "Wizard"
    },
    "witch": {
        class: "Mystic",
        subclass: "Witch"
    },
    "cultist": {
        class: "Scoundrel",
        subclass: "Former Cultist"
    }
}


const spells = [
    {
        "name": "Accurate Strike",
        "copyFrom": "True Strike",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Contingency",
        "copyFrom": "Contingency",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Mage Hand",
        "copyFrom": "Mage Hand",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Foresight",
        "copyFrom": "Foresight",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Message",
        "copyFrom": "Message",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Sequester",
        "copyFrom": "Sequester",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Earthquake",
        "copyFrom": "Earthquake",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "theurg",
            "cultist"
        ]
    },
    {
        "name": "Stinking Cloud",
        "copyFrom": "Stinking Cloud",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Telepathic Bond",
        "copyFrom": "Rary's Telepathic Bond",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Darkvision",
        "copyFrom": "Darkvision",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Alarm",
        "copyFrom": "Alarm",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Greater Invisibility",
        "copyFrom": "Greater Invisibility",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Hypnotic Pattern",
        "copyFrom": "Hypnotic Pattern",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Programmed Illusion",
        "copyFrom": "Programmed Illusion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Thaumaturgy",
        "copyFrom": "Thaumaturgy",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Prestidigitation",
        "copyFrom": "Prestidigitation",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Commune",
        "copyFrom": "Commune",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Glibness",
        "copyFrom": "Glibness",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer",
            "witch"
        ]
    },
    {
        "name": "Heroes' Feast",
        "copyFrom": "Heroes' Feast",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Stone Shape",
        "copyFrom": "Stone Shape",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "theurg",
            "wizard"
        ]
    },
    {
        "name": "Mirage Arcane",
        "copyFrom": "Mirage Arcane",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Legend Lore",
        "copyFrom": "Legend Lore",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Resilient Sphere",
        "copyFrom": "Otiluke's Resilient Sphere",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Instant Summons",
        "copyFrom": "Drawmij's Instant Summons",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Protection from Poison",
        "copyFrom": "Protection from Poison",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Speak with Plants",
        "copyFrom": "Speak with Plants",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Dream",
        "copyFrom": "Dream",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Wall of Stone",
        "copyFrom": "Wall of Stone",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Enlarge/Reduce",
        "copyFrom": "Enlarge/Reduce",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Sleet Storm",
        "copyFrom": "Sleet Storm",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Vicious Mockery",
        "copyFrom": "Vicious Mockery",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Silent Image",
        "copyFrom": "Silent Image",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Reverse Gravity",
        "copyFrom": "Reverse Gravity",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Tongues",
        "copyFrom": "Tongues",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Floating Disk",
        "copyFrom": "Tenser's Floating Disk",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Sunbeam",
        "copyFrom": "Sunbeam",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Hallucinatory Terrain",
        "copyFrom": "Hallucinatory Terrain",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Arcane Sword",
        "copyFrom": "Mordenkainen's Sword",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Resistance",
        "copyFrom": "Resistance",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Divination",
        "copyFrom": "Divination",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "See Invisibility",
        "copyFrom": "See Invisibility",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Move Earth",
        "copyFrom": "Move Earth",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Passwall",
        "copyFrom": "Passwall",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Maze",
        "copyFrom": "Maze",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Arcane Lock",
        "copyFrom": "Arcane Lock",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Speak with Animals",
        "copyFrom": "Speak with Animals",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Chill Touch",
        "copyFrom": "Chill Touch",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Unseen Servant",
        "copyFrom": "Unseen Servant",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Knock",
        "copyFrom": "Knock",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Dancing Lights",
        "copyFrom": "Dancing Lights",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Divine Word",
        "copyFrom": "Divine Word",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Nondetection",
        "copyFrom": "Nondetection",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Mending",
        "copyFrom": "Mending",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Sunburst",
        "copyFrom": "Sunburst",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Continual Flame",
        "copyFrom": "Continual Flame",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "theurg",
            "wizard"
        ]
    },
    {
        "name": "Forbiddance",
        "copyFrom": "Forbiddance",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Blur",
        "copyFrom": "Blur",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Silence",
        "copyFrom": "Silence",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Sanctuary",
        "copyFrom": "Sanctuary",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Sending",
        "copyFrom": "Sending",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Gust of Wind",
        "copyFrom": "Gust of Wind",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Holy Aura",
        "copyFrom": "Holy Aura",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Warding Bond",
        "copyFrom": "Warding Bond",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Light",
        "copyFrom": "Light",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Find Familiar",
        "copyFrom": "Find Familiar",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Magnificent Mansion",
        "copyFrom": "Mordenkainen's Magnificent Mansion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Fire Shield",
        "copyFrom": "Fire Shield",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Fire Bolt",
        "copyFrom": "Fire Bolt",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Phantom Steed",
        "copyFrom": "Phantom Steed",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Eldritch Blast",
        "copyFrom": "Eldritch Blast",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "witch"
        ]
    },
    {
        "name": "Arcane Eye",
        "copyFrom": "Arcane Eye",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "True Seeing",
        "copyFrom": "True Seeing",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Find the Path",
        "copyFrom": "Find the Path",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Grease",
        "copyFrom": "Grease",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Locate Creature",
        "copyFrom": "Locate Creature",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Awaken",
        "copyFrom": "Awaken",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Illusory Script",
        "copyFrom": "Illusory Script",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Disguise Self",
        "copyFrom": "Disguise Self",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Create Food and Water",
        "copyFrom": "Create Food and Water",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Detect Poison and Disease",
        "copyFrom": "Detect Poison and Disease",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Augury",
        "copyFrom": "Augury",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Feather Fall",
        "copyFrom": "Feather Fall",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Guardian of Faith",
        "copyFrom": "Guardian of Faith",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Stoneskin",
        "copyFrom": "Stoneskin",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Magic Mouth",
        "copyFrom": "Magic Mouth",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Fire Storm",
        "copyFrom": "Fire Storm",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "theurg",
            "cultist"
        ]
    },
    {
        "name": "Entangle",
        "copyFrom": "Entangle",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer",
            "witch"
        ]
    },
    {
        "name": "Weird",
        "copyFrom": "Weird",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Faithful Hound",
        "copyFrom": "Mordenkainen's Faithful Hound",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Slow",
        "copyFrom": "Slow",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Guidance",
        "copyFrom": "Guidance",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Telekinesis",
        "copyFrom": "Telekinesis",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Lesser Restoration",
        "copyFrom": "Lesser Restoration",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Identify",
        "copyFrom": "Identify",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Mirror Image",
        "copyFrom": "Mirror Image",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Control Water",
        "copyFrom": "Control Water",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "theurg",
            "wizard"
        ]
    },
    {
        "name": "Symbol",
        "copyFrom": "Symbol",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Seeming",
        "copyFrom": "Seeming",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Guards and Wards",
        "copyFrom": "Guards and Wards",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Sacred Flame",
        "copyFrom": "Sacred Flame",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Faerie Fire",
        "copyFrom": "Faerie Fire",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Water Breathing",
        "copyFrom": "Water Breathing",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Calm Emotions",
        "copyFrom": "Calm Emotions",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Detect Magic",
        "copyFrom": "Detect Magic",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Arcanist's Magic Aura",
        "copyFrom": "Nystul's Magic Aura",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Spare the Dying",
        "copyFrom": "Spare the Dying",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Expeditious Retreat",
        "copyFrom": "Expeditious Retreat",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Water Walk",
        "copyFrom": "Water Walk",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "theurg",
            "cultist"
        ]
    },
    {
        "name": "Antipathy/Sympathy",
        "copyFrom": "Antipathy/Sympathy",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Find Traps",
        "copyFrom": "Find Traps",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Locate Object",
        "copyFrom": "Locate Object",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Shield",
        "copyFrom": "Shield",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Secret Chest",
        "copyFrom": "Leomund's Secret Chest",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Meld into Stone",
        "copyFrom": "Meld into Stone",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Shield of Faith",
        "copyFrom": "Shield of Faith",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Gaseous Form",
        "copyFrom": "Gaseous Form",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Prismatic Wall",
        "copyFrom": "Prismatic Wall",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Mage Armor",
        "copyFrom": "Mage Armor",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Incendiary Cloud",
        "copyFrom": "Incendiary Cloud",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Freedom of Movement",
        "copyFrom": "Freedom of Movement",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Blade Barrier",
        "copyFrom": "Blade Barrier",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Meteor Swarm",
        "copyFrom": "Meteor Swarm",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Purify Food and Drink",
        "copyFrom": "Purify Food and Drink",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Darkness",
        "copyFrom": "Darkness",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Spider Climb",
        "copyFrom": "Spider Climb",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Project Image",
        "copyFrom": "Project Image",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Haste",
        "copyFrom": "Haste",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Prismatic Spray",
        "copyFrom": "Prismatic Spray",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Shocking Grasp",
        "copyFrom": "Shocking Grasp",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Lightning Bolt",
        "copyFrom": "Lightning Bolt",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Alter Self",
        "copyFrom": "Alter Self",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Blindness/Deafness",
        "copyFrom": "Blindness/Deafness",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Chain Lightning",
        "copyFrom": "Chain Lightning",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Circle of Death",
        "copyFrom": "Circle of Death",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "witch",
            "cultist"
        ]
    },
    {
        "name": "Detect Thoughts",
        "copyFrom": "Detect Thoughts",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Create Undead",
        "copyFrom": "Create Undead",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "cultist"
        ]
    },
    {
        "name": "Disintegrate",
        "copyFrom": "Disintegrate",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Eyebite",
        "copyFrom": "Eyebite",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Hold Person",
        "copyFrom": "Hold Person",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Mass Suggestion",
        "copyFrom": "Mass Suggestion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Levitate",
        "copyFrom": "Levitate",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Banishment",
        "copyFrom": "Banishment",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Black Tentacles",
        "copyFrom": "Evard's Black Tentacles",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Misty Step",
        "copyFrom": "Misty Step",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Blight",
        "copyFrom": "Blight",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "witch",
            "cultist"
        ]
    },
    {
        "name": "Confusion",
        "copyFrom": "Confusion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Etherealness",
        "copyFrom": "Etherealness",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Dimension Door",
        "copyFrom": "Dimension Door",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Finger of Death",
        "copyFrom": "Finger of Death",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "witch",
            "cultist"
        ]
    },
    {
        "name": "Burning Hands",
        "copyFrom": "Burning Hands",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Plane Shift",
        "copyFrom": "Plane Shift",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "theurg",
            "witch",
            "cultist"
        ]
    },
    {
        "name": "Charm Person",
        "copyFrom": "Charm Person",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Suggestion",
        "copyFrom": "Suggestion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Polymorph",
        "copyFrom": "Polymorph",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Animate Dead",
        "copyFrom": "Animate Dead",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "cultist"
        ]
    },
    {
        "name": "Dominate Monster",
        "copyFrom": "Dominate Monster",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "False Life",
        "copyFrom": "False Life",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Clairvoyance",
        "copyFrom": "Clairvoyance",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Counterspell",
        "copyFrom": "Counterspell",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Power Word Stun",
        "copyFrom": "Power Word Stun",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Dispel Magic",
        "copyFrom": "Dispel Magic",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Fear",
        "copyFrom": "Fear",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Magic Missile",
        "copyFrom": "Magic Missile",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Gate",
        "copyFrom": "Gate",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Dominate Person",
        "copyFrom": "Dominate Person",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Hold Monster",
        "copyFrom": "Hold Monster",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Power Word Kill",
        "copyFrom": "Power Word Kill",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Planar Binding",
        "copyFrom": "Planar Binding",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Wish",
        "copyFrom": "Wish",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Remove Curse",
        "copyFrom": "Remove Curse",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "theurg",
            "witch"
        ]
    },
    {
        "name": "Revivify",
        "copyFrom": "Revivify",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Speak with Dead",
        "copyFrom": "Speak with Dead",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer",
            "witch"
        ]
    },
    {
        "name": "Spirit Guardians",
        "copyFrom": "Spirit Guardians",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Harm",
        "copyFrom": "Harm",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Heal",
        "copyFrom": "Heal",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Death Ward",
        "copyFrom": "Death Ward",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Bane",
        "copyFrom": "Bane",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Zone of Truth",
        "copyFrom": "Zone of Truth",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Command",
        "copyFrom": "Command",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Cure Wounds",
        "copyFrom": "Cure Wounds",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Dispel Evil and Good",
        "copyFrom": "Dispel Evil and Good",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Flame Strike",
        "copyFrom": "Flame Strike",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Geas",
        "copyFrom": "Geas",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Greater Restoration",
        "copyFrom": "Greater Restoration",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Healing Word",
        "copyFrom": "Healing Word",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Mass Heal",
        "copyFrom": "Mass Heal",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Inflict Wounds",
        "copyFrom": "Inflict Wounds",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Protection from Evil and Good",
        "copyFrom": "Protection from Evil and Good",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "theurg",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Mass Cure Wounds",
        "copyFrom": "Mass Cure Wounds",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Mass Healing Word",
        "copyFrom": "Mass Healing Word",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Scrying",
        "copyFrom": "Scrying",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Bestow Curse",
        "copyFrom": "Bestow Curse",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Enthrall",
        "copyFrom": "Enthrall",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "singer",
            "witch"
        ]
    },
    {
        "name": "Hideous Laughter",
        "copyFrom": "Tasha's Hideous Laughter",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Irresistible Dance",
        "copyFrom": "Otto's Irresistible Dance",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Compulsion",
        "copyFrom": "Compulsion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Feeblemind",
        "copyFrom": "Feeblemind",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Mind Blank",
        "copyFrom": "Mind Blank",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Mislead",
        "copyFrom": "Mislead",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Modify Memory",
        "copyFrom": "Modify Memory",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Forcecage",
        "copyFrom": "Forcecage",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Flesh to Stone",
        "copyFrom": "Flesh to Stone",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Vampiric Touch",
        "copyFrom": "Vampiric Touch",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Ray of Enfeeblement",
        "copyFrom": "Ray of Enfeeblement",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Demiplane",
        "copyFrom": "Demiplane",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Contact Other Plane",
        "copyFrom": "Contact Other Plane",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "self",
            "witch"
        ]
    },
    {
        "name": "Hellish Rebuke",
        "copyFrom": "Hellish Rebuke",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "witch"
        ]
    },
    {
        "name": "Imprisonment",
        "copyFrom": "Imprisonment",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Fabricate",
        "copyFrom": "Fabricate",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Phantasmal Killer",
        "copyFrom": "Phantasmal Killer",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Delayed Blast Fireball",
        "copyFrom": "Delayed Blast Fireball",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Clone",
        "copyFrom": "Clone",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Fireball",
        "copyFrom": "Fireball",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Ray of Frost",
        "copyFrom": "Ray of Frost",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Thunderwave",
        "copyFrom": "Thunderwave",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Antimagic Field",
        "copyFrom": "Antimagic Field",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "theurg",
            "wizard"
        ]
    },
    {
        "name": "Freezing Sphere",
        "copyFrom": "Otiluke's Freezing Sphere",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Animal Friendship",
        "copyFrom": "Animal Friendship",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Poison Spray",
        "copyFrom": "Poison Spray",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Plant Growth",
        "copyFrom": "Plant Growth",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Globe of Invulnerability",
        "copyFrom": "Globe of Invulnerability",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Fog Cloud",
        "copyFrom": "Fog Cloud",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Enhance Ability",
        "copyFrom": "Enhance Ability",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "theurg",
            "singer"
        ]
    },
    {
        "name": "Glyph of Warding",
        "copyFrom": "Glyph of Warding",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "theurg",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Insect Plague",
        "copyFrom": "Insect Plague",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "theurg",
            "cultist"
        ]
    },
    {
        "name": "Ice Storm",
        "copyFrom": "Ice Storm",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Acid Splash",
        "copyFrom": "Acid Splash",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Time Stop",
        "copyFrom": "Time Stop",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Flaming Sphere",
        "copyFrom": "Flaming Sphere",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Hallow",
        "copyFrom": "Hallow",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Animal Messenger",
        "copyFrom": "Animal Messenger",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Magic Weapon",
        "copyFrom": "Magic Weapon",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Tiny Hut",
        "copyFrom": "Leomund's Tiny Hut",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Cone of Cold",
        "copyFrom": "Cone of Cold",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Spiritual Weapon",
        "copyFrom": "Spiritual Weapon",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Wall of Force",
        "copyFrom": "Wall of Force",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Major Image",
        "copyFrom": "Major Image",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Sleep",
        "copyFrom": "Sleep",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Arcane Hand",
        "copyFrom": "Bigby's Hand",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Prayer of Healing",
        "copyFrom": "Prayer of Healing",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Cloudkill",
        "copyFrom": "Cloudkill",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Heat Metal",
        "copyFrom": "Heat Metal",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Magic Circle",
        "copyFrom": "Magic Circle",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Wall of Ice",
        "copyFrom": "Wall of Ice",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Blink",
        "copyFrom": "Blink",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Wall of Fire",
        "copyFrom": "Wall of Fire",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Animate Objects",
        "copyFrom": "Animate Objects",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Detect Evil and Good",
        "copyFrom": "Detect Evil and Good",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Heroism",
        "copyFrom": "Heroism",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Create or Destroy Water",
        "copyFrom": "Create or Destroy Water",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Creation",
        "copyFrom": "Creation",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Minor Illusion",
        "copyFrom": "Minor Illusion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Dominate Beast",
        "copyFrom": "Dominate Beast",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "cultist"
        ]
    },
    {
        "name": "Teleportation Circle",
        "copyFrom": "Teleportation Circle",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Longstrider",
        "copyFrom": "Longstrider",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "staff",
            "symbolist",
            "singer",
            "wizard"
        ]
    },
    {
        "name": "Comprehend Languages",
        "copyFrom": "Comprehend Languages",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Gentle Repose",
        "copyFrom": "Gentle Repose",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Shatter",
        "copyFrom": "Shatter",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Beacon of Hope",
        "copyFrom": "Beacon of Hope",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Guiding Bolt",
        "copyFrom": "Guiding Bolt",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Private Sanctum",
        "copyFrom": "Mordenkainen's Private Sanctum",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Locate Animals or Plants",
        "copyFrom": "Locate Animals or Plants",
        "sourceFrom": "PHB",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "singer"
        ]
    },
    {
        "name": "Rope Trick",
        "copyFrom": "Rope Trick",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Jump",
        "copyFrom": "Jump",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Acid Arrow",
        "copyFrom": "Melf's Acid Arrow",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Bless",
        "copyFrom": "Bless",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Daylight",
        "copyFrom": "Daylight",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Scorching Ray",
        "copyFrom": "Scorching Ray",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Protection from Energy",
        "copyFrom": "Protection from Energy",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "theurg",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Invisibility",
        "copyFrom": "Invisibility",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "crafter",
            "self",
            "sorc",
            "staff",
            "symbolist",
            "singer",
            "witch",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Control Weather",
        "copyFrom": "Control Weather",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "theurg",
            "wizard"
        ]
    },
    {
        "name": "Fly",
        "copyFrom": "Fly",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": true,
        "classes": [
            "self",
            "wizard"
        ]
    },
    {
        "name": "Web",
        "copyFrom": "Web",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "wizard"
        ]
    },
    {
        "name": "Aid",
        "copyFrom": "Aid",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self"
        ]
    },
    {
        "name": "True Resurrection",
        "copyFrom": "True Resurrection",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Power Word Heal",
        "copyFrom": "Power Word Heal",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Antilife Shell",
        "copyFrom": "Antilife Shell",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Arms of Hadar",
        "copyFrom": "Arms of Hadar",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Aura of Life",
        "copyFrom": "Aura of Life",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Aura of Purity",
        "copyFrom": "Aura of Purity",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Aura of Vitality",
        "copyFrom": "Aura of Vitality",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Barkskin",
        "copyFrom": "Barkskin",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Blade Ward",
        "copyFrom": "Blade Ward",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Compelled Duel",
        "copyFrom": "Compelled Duel",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Contagion",
        "copyFrom": "Contagion",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Crown of Madness",
        "copyFrom": "Crown of Madness",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Feign Death",
        "copyFrom": "Feign Death",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Friends",
        "copyFrom": "Friends",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Hex",
        "copyFrom": "Hex",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Magic Jar",
        "copyFrom": "Magic Jar",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Raise Dead",
        "copyFrom": "Raise Dead",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Regenerate",
        "copyFrom": "Regenerate",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Reincarnate",
        "copyFrom": "Reincarnate",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Resurrection",
        "copyFrom": "Resurrection",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Power Word Pain",
        "copyFrom": "Power Word Pain",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Psychic Scream",
        "copyFrom": "Psychic Scream",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Horrid Wilting",
        "copyFrom": "Abi-Dalzim's Horrid Wilting",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Beast Bond",
        "copyFrom": "Beast Bond",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Beast Sense",
        "copyFrom": "Beast Sense",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Befuddlement",
        "copyFrom": "Befuddlement",
        "sourceFrom": "XPHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Catnap",
        "copyFrom": "Catnap",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Cause Fear",
        "copyFrom": "Cause Fear",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Charm Monster",
        "copyFrom": "Charm Monster",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Create Homunculus",
        "copyFrom": "Create Homunculus",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Danse Macabre",
        "copyFrom": "Danse Macabre",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Enemies Abound",
        "copyFrom": "Enemies Abound",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Enervation",
        "copyFrom": "Enervation",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Infestation",
        "copyFrom": "Infestation",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Intellect Fortress",
        "copyFrom": "Intellect Fortress",
        "sourceFrom": "TCE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Kinetic Jaunt",
        "copyFrom": "Kinetic Jaunt",
        "sourceFrom": "SCC",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Life Transference",
        "copyFrom": "Life Transference",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Mental Prison",
        "copyFrom": "Mental Prison",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Mind Sliver",
        "copyFrom": "Mind Sliver",
        "sourceFrom": "TCE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Mind Spike",
        "copyFrom": "Mind Spike",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Negative Energy Flood",
        "copyFrom": "Negative Energy Flood",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Primal Savagery",
        "copyFrom": "Primal Savagery",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Psychic Lance",
        "copyFrom": "Raulothim's Psychic Lance",
        "sourceFrom": "FTD",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Shadow of Moil",
        "copyFrom": "Shadow of Moil",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Skill Empowerment",
        "copyFrom": "Skill Empowerment",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Soul Cage",
        "copyFrom": "Soul Cage",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Synaptic Static",
        "copyFrom": "Synaptic Static",
        "sourceFrom": "XGE",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Wither and Bloom",
        "copyFrom": "Wither and Bloom",
        "sourceFrom": "SCC",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "blood"
        ]
    },
    {
        "name": "Turn Weather",
        "copyFrom": "Control Weather",
        "sourceFrom": "PHB",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "witch",
            "wizard"
        ]
    },
    {
        "name": "Black Breath",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "cultist"
        ]
    },
    {
        "name": "Black Bolt",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "staff",
            "symbolist",
            "wizard",
            "cultist"
        ]
    },
    {
        "name": "Commune with Spirits",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "self",
            "sorc",
            "cultist"
        ]
    },
    {
        "name": "Patron Saint",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Blood Bond",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "self",
            "witch"
        ]
    },
    {
        "name": "Atonement",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Larvae Boil",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "witch",
            "cultist"
        ]
    },
    {
        "name": "Illusory Correction",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Anathema",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Judging Bonds",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Purgatory",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Holy Smoke",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Exchange Shadow",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "cultist"
        ]
    },
    {
        "name": "Flaming Servant",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Fire Soul",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Exorcism",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Spirit Walk",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "sorc",
            "witch",
            "cultist"
        ]
    },
    {
        "name": "Lifegiver",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Inherit Wound",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "theurg",
            "witch"
        ]
    },
    {
        "name": "Faraway Writing",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Tale of Ashes",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Soul Stone",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Living Fortress",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "self",
            "witch"
        ]
    },
    {
        "name": "Purging Fire",
        "isFavourable": false,
        "isRitual": false,
        "classes": [
            "theurg"
        ]
    },
    {
        "name": "Blood Storm",
        "isFavourable": true,
        "isRitual": false,
        "classes": [
            "self",
            "staff",
            "symbolist",
            "wizard"
        ]
    },
    {
        "name": "Summon Daemon",
        "isFavourable": false,
        "isRitual": true,
        "classes": [
            "sorc"
        ]
    }
]

const spellDetails = [
    {
        "name": "Black Bolt",
        "level": 1,
        "school": "V",
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 120 } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }],
        "entries": [
            "You summon some measure of the darkness that plagues your soul and send it outwards as a bolt of blackness at a creature within range. The creature must make a Dexterity saving throw or be restrained by the magic as it envelops them like shadowy tentacles. At the end of its turn, the creature can attempt a Strength saving throw to break free. If the creature's size is larger than the caster's it has advantage on the saving throw.",
            "At Higher Levels. When you cast this spell at 2nd level or higher, you can target one additional creature for each level above 1st."
        ]
    },
    {
        "name": "Holy Smoke",
        "level": 1,
        "school": "D",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 10 } },
        "components": { "v": true, "m": "incense" },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }],
        "entries": [
            "You light incense and choose a 10-foot cube within range. The smoke spreads among those present and gathers around objects and creatures in relation to how corrupted they are: the closer the smoke gathers, the more tainted the creature in question is. The Gamemaster clearly states if objects or creatures are blight-stricken, blightmarked or thoroughly corrupt. (See Corruption, page 38).",
            "Holy smoke can be countered by the exchange shadow spell."
        ]
    },
    {
        "name": "Spirit Walk",
        "level": 1,
        "school": "T",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true },
        "duration": [{ "type": "timed", "duration": { "type": "minute", "amount": 10 } }],
        "entries": [
            "You become part of the spirit world for up to 10 minutes. You are invisible to creatures in the material world but can see (and be seen by) any local spirits. Unfriendly spirits might attack you and you can use your reaction to end this spell early."
        ]
    },
    {
        "name": "Black Breath",
        "level": 2,
        "school": "V",
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 10 } },
        "components": { "s": true },
        "duration": [{ "type": "instant" }],
        "entries": [
            "With this spell the caster can heal those already tainted by darkness, though at a danger of gaining more Corruption. For each willing creature within range (including the caster), roll 1d4 plus your spellcasting modifier. If the result is equal to or lower than their permanent Corruption then they recover hit points equal to the result. If it is higher than their permanent Corruption then they gain the difference in temporary Corruption.",
            "At Higher Levels. If you cast this spell at 3rd level or higher, you add 1 to your result for each level above 2nd."
        ]
    },
    {
        "name": "Blood Bond",
        "level": 2,
        "school": "T",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "touch" } },
        "components": { "v": true, "s": true, "m": "two fine silver chains, one for the caster and one for the familiar, 50 thaler total" },
        "duration": [{ "type": "permanent", "ends": ["dispel"] }],
        "entries": [
            "You magically link yourself to your familiar to an even greater degree, allowing you to share the burden of Corruption between the two of you. The familiar's Corruption Threshold becomes equal to 2, plus any positive Charisma modifier. When you receive temporary or permanent Corruption you may direct all or part of it to your familiar.",
            "If the familiar's permanent Corruption becomes equal to or higher than its Threshold, it becomes a blight-born spirit creature and abandons the caster, possibly attacking them as it escapes."
        ]
    },
    {
        "name": "Exchange Shadow",
        "level": 2,
        "school": "T",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 60 } },
        "components": { "v": true, "s": true, "m": "a link to the target such as a lock of hair, a splash of blood, or an object that once belonged to them" },
        "duration": [{ "type": "timed", "duration": { "type": "hour", "amount": 24 } }],
        "entries": [
            "You can exchange your Shadow with another creature. If the creature is unwilling, it is able to make a Wisdom saving throw to resist the effect. A successful save prevents the process and alerts the target. A failed saving throw indicates that the swap was successful and the target is unaware of the exchange. Your Shadow appears as the target's Shadow and their Shadow appears as yours."
        ]
    },
    {
        "name": "Faraway Writing",
        "level": 2,
        "school": "V",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "special" },
        "components": { "v": true, "s": true, "m": "a pair of high quality journals, each worth 25 thaler or more" },
        "duration": [{ "type": "instant" }],
        "entries": [
            "When you cast this spell you inscribe a message of 25 words or less, which automatically appears in the other journal as well, as long as it is on the same plane of existence. You can make simple sketches or draw symbols or letters that you do not know the meaning of as part of your message, a simple diagram is equivalent to five to ten words in most cases. The keeper of the other journal must cast this spell themselves in order to respond."
        ]
    },
    {
        "name": "Inherit Wound",
        "level": 2,
        "school": "N",
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 60 } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "timed", "duration": { "type": "minute", "amount": 1 } }],
        "entries": [
            "Choose a creature within range. If it is unwilling, it can make a Constitution saving throw to avoid the effect. When you take damage from a weapon attack or a spell effect you divide the damage done between you and the creature (in the case of an odd damage total, you take the extra point of damage). An unwilling creature can make another Constitution saving throw at the end of its turn to end the effect."
        ]
    },
    {
        "name": "Tale of Ashes",
        "level": 2,
        "school": "D",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "touch" } },
        "components": { "v": true, "s": true, "m": "the ashes of the object" },
        "duration": [{ "type": "instant" }],
        "entries": [
            "This spell allows a mystic to read the ashes of a burnt object and thereby discern what the object once was and what happened when it burned - the mystic experiences all impressions from the fire, sees who was there and hears what was being said. A campfire can have much to tell about what happened around it."
        ]
    },
    {
        "name": "Anathema",
        "level": 3,
        "school": "A",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "hour", "amount": 1, "upTo": true } }],
        "entries": [
            "This spell blocks harmful magics. While in effect you have advantage on saving throws against magical effects and resistance to damage from spells."
        ]
    },
    {
        "name": "Flaming Servant",
        "level": 3,
        "school": "C",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 10 } },
        "components": { "v": true, "s": true, "m": "a suit of heavy armor" },
        "duration": [{ "type": "timed", "duration": { "type": "hour", "amount": 8 } }],
        "entries": [
            "You summon a creature of living fire to occupy a suit of armor that you provide. The summoned creature remains within 30 feet of you at all times and follows your commands. It shares your initiative count and you can use your bonus action to command it to take an action, such as attack a target. It can suppress its fiery nature to interact with objects normally or you can command it to use its action to set unattended flammable objects alight. If it is destroyed then you cannot summon the creature again until the next day."
        ]
    },
    {
        "name": "Judging Bonds",
        "level": 3,
        "school": "E",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "touch" } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "timed", "duration": { "type": "month", "amount": 1 } }],
        "entries": [
            "You allow pacifying light to flow through the chains or shackles holding a person. This prevents that person from using mystical powers and provides disadvantage on Strength and Dexterity checks and saving throws while bound."
        ]
    },
    {
        "name": "Larvae Boil",
        "level": 3,
        "school": "C",
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "touch" } },
        "components": { "v": true, "s": true, "m": "a live wasp" },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }],
        "entries": [
            "Drawing from the force of wrath you can infuse an enemy's body with larvae that then start to eat their way out. Although it is loudly refuted by members of the court, persistent rumors say that this is how the hero king Ynedar met his demise.",
            "On a successful melee spell attack, the victim is infected with larvae. At the end of its turn, it suffers 1d4 piercing damage. On the next round the damage increases to 1d6 piercing damage, on the third round the damage is 1d8, and on the fourth round it is 1d10 damage, and on the fifth and all following rounds it increases to 1d12 piercing damage.",
            "At Higher Levels. If cast at 4th level, the victim takes 1d6 piercing damage on the first round, which increases each subsequent round, to a total of 1d12 piercing damage per round. At 5th level, the damage starts off at 1d8 on the first round, then at 6th level it starts at 1d10 piercing damage, and at 7th level it starts at 1d12 piercing damage."
        ]
    },
    {
        "name": "Purging Fire",
        "level": 3,
        "school": "V",
        "meta": { "ritual": true },
        "time": [{ "number": 8, "unit": "hour" }],
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true, "s": true, "m": "holy incense, 50 thaler worth" },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }],
        "entries": [
            "You prepare yourself with songs and prayers before climbing onto a burning pyre to cleanse your body of Corruption. Each round you remain in the fire you take 1d12 fire damage. If you do not lose concentration on the spell, you reduce your permanent Corruption by 1 point. You must take damage in order to reduce your Corruption. Thus you can remove up to 10 points of permanent Corruption if you remain in the pyre for the duration.",
            "You cannot cast this spell for anyone else, only you may benefit from it."
        ]
    },
    {
        "name": "Summon Daemon",
        "level": 3,
        "school": "C",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true, "s": true, "m": "candles, dagger and golden bowl" },
        "duration": [{ "type": "special" }],
        "entries": [
            "You summon an abomination from the Yonderworld, a daemon. The creature resists your control and you must make a contested Charisma check to keep it under your control. If you fail and the daemon was not summoned into an inverted magic circle, the daemon is free to do as it likes (including attacking you or your allies) and is free to roam until it chooses to return to the Yonderworld (which it can do as an action) or it is destroyed. If it is trapped in an inverted magic circle it instead cannot move and returns to the Yonderworld at the end of the magic circle's duration. You can talk to the daemon during this time, but it is under no compulsion to speak or to give you truthful answers.",
            "If you succeed at the Charisma check then the daemon is under your control for 24 hours. If requested, it will return to the Yonderworld, which ends your control of it. It will also carry out your orders, unless they involve a clear danger to the daemon from the servants of Prios or another god. It takes its own turn and follows your commands.",
            "When you cast this spell, you summon a Servant Daemon. If you choose to gain a point of permanent Corruption you can instead summon a Vindictive Daemon, for two points of permanent Corruption you can summon a Knowledge Daemon or for three points of permanent Corruption you can summon a Guardian Daemon. The stats for the daemons are included below.",
            "Servant Daemon. Small fiend. Armor Class 15. Hit Points 18 (4d6 + 4). Speed 30 ft, fly 30 ft. STR 8 (-1), DEX 20 (+5), CON 12 (+1), INT 10 (+0), WIS 10 (+0), CHA 13 (+1). Condition Immunities exhaustion, paralyzed, petrified, poisoned, unconscious. Damage Immunities fire, poison, psychic. Senses passive Perception 10. Languages understands and speaks the caster's language. Challenge 1 (200 XP, proficiency bonus +2). Manner reluctant and cynical. Shadow same as the caster's. Equipment none. Actions. Sharp Fangs. Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d4 + 5) piercing damage.",
            "Vindictive Daemon. Medium fiend. Armor Class 13. Hit Points 82 (11d8 + 33). Speed 30 ft, fly 60 ft. STR 11 (+0), DEX 16 (+3), CON 17 (+3), INT 10 (+0), WIS 10 (+0), CHA 17 (+3). Skills Perception +2, Stealth +7. Condition Immunities exhaustion, paralyzed, petrified, poisoned, unconscious. Damage Immunities fire, poison, psychic. Senses passive Perception 12. Languages understands and speaks the caster's language. Challenge 4 (1,100 XP, proficiency bonus +2). Manner sniffing and prying. Shadow a black, oily cloud dancing in hard winds (thoroughly corrupt). Equipment none. Ambusher. In the first round of a combat, the daemon has advantage on attack rolls against any creature it has surprised. Actions. Multiattack. The vindictive daemon makes two attacks with its long claws. Long Claws. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage.",
            "Knowledge Daemon. Medium fiend. Armor Class 10. Hit Points 71 (13d8 + 13). Speed 30 ft, fly 60 ft. STR 11 (+0), DEX 11 (+0), CON 12 (+1), INT 18 (+4), WIS 19 (+4), CHA 20 (+5). Skills Arcana +10, Deception +11, History +10, Perception +10. Saving Throws Dex +3, Cha +8. Condition Immunities exhaustion, paralyzed, petrified, poisoned, unconscious. Damage Immunities fire, poison, psychic. Senses passive Perception 20. Languages understands and speaks the caster's language. Challenge 6 (2,300 XP, proficiency bonus +3). Manner fawning and wheezing. Shadow calm blackness, like a pool of liquid bitumen (thoroughly corrupt). Equipment none. Expertise. The daemon has expertise in all its skills. Wrest Knowledge. The summoner can use its action to make a contested Charisma check with the daemon to receive information. On a success the daemon provides a useful answer to an open-ended question or a definitive answer to a yes-or-no question. On a failure, the daemon refuses to answer any more questions. If the summoner offers a blood sacrifice they have advantage on their Charisma check. Actions. Claws. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2 (1d4) slashing damage. Dominate. The daemon selects a creature within 30 feet. That creature must make a Charisma saving throw (DC 15) or become charmed by the daemon, following its instructions (the creature will not harm itself, however). At the end of its turn the creature can repeat the saving throw, ending the effect on itself. A daemon inside a magic circle cannot use this feature. Life Consuming Kiss. Melee Weapon Attack: +3 to hit, reach 0 ft., one target. Hit: The creature must make a DC 10 Constitution saving throw or gain a level of exhaustion.",
            "Guardian Daemon. Large fiend. Armor Class 16 (natural armor). Hit Points 84 (8d10 + 40). Speed 30 ft, fly 60 ft. STR 26 (+8), DEX 11 (+0), CON 20 (+5), INT 11 (+0), WIS 15 (+2), CHA 20 (+5). Saving Throws Dex +3, Con +8, Wis +5. Condition Immunities exhaustion, paralyzed, petrified, poisoned, unconscious. Damage Immunities fire, poison, psychic. Senses passive Perception 12. Languages understands and speaks the caster's language. Challenge 8 (3,900 XP, proficiency bonus +3). Manner snorting and clawing the ground. Shadow night-black as bubbling and boiling tar (thoroughly corrupt). Equipment daemon-glaive. Alertness. The daemon has advantage on initiative rolls as long as it is not surprised. Actions. Multiattack. The daemon makes an attack with its Claws and a Daemon-glaive attack. Claws. Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 14 (1d12 + 8) slashing damage. Daemon-glaive. Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 21 (2d10 + 10) magical slashing damage. Reactions. Preemptive Attack. When a creature comes within reach, the daemon can make a Claws or Daemon-glaive attack."
        ]
    },
    {
        "name": "Illusory Correction",
        "level": 4,
        "school": "I",
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 60 } },
        "components": { "v": true },
        "duration": [{ "type": "special" }],
        "entries": [
            "There are gaps between reality and our perception of it. By casting this spell, the mystic takes advantage of these discrepancies. While this spell is active, when you or another creature within range makes an ability check, attack roll, or saving throw you can use your reaction to make a correction of reality, either forcing another creature to reroll the d20 or allowing yourself to do so.",
            "At the end of your turn if you have used your reaction since your previous turn, you must make a spellcasting ability check to keep track of the differences between your personal reality and that which others perceive. The DC starts at 5 and increases each time by 5. If you fail the check the spell immediately ends (you cannot use your reaction to reroll)."
        ]
    },
    {
        "name": "Lifegiver",
        "level": 4,
        "school": "V",
        "time": [{ "number": 1, "unit": "hour" }],
        "range": { "type": "point", "distance": { "type": "touch" } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "instant" }],
        "entries": [
            "As you cast this spell, you touch a number of creatures equal to your proficiency bonus. You can be one of those creatures. Each creature's temporary Corruption is reduced by 1d4. Any excess points restore the creature's hit points.",
            "At Higher Levels. If you cast this spell at 5th level or higher, you can heal one additional creature per spell level."
        ]
    },
    {
        "name": "Commune with Spirits",
        "level": 5,
        "school": "D",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "special" }],
        "entries": [
            "The world is old and many spirits linger from days past; nature spirits in dirt and water, or dead heroes who have not yet passed over to the other side. You contact these spirits and ask for their help. This help takes one of the following three forms:",
            "You can ask the spirits what important thing occurred here in the past. Note that spirits have a very limited understanding of time, so a battle that occurred 500 years ago might be more interesting to them than the murder that happened yesterday.",
            "You can ask them three yes or no questions that they will try to answer as accurately as possible. However, they are limited by their knowledge and won't do well with questions outside their own experiences.",
            "You can name or describe an enemy. For the next 24 hours if that enemy approaches within 30 feet of your current location the spirits will attack them. At the start of its turn each specified creature must make a Wisdom saving throw against your spell save DC. On a failure they become frightened of the area and take 1d6 psychic damage. On a success they are not frightened but still take 1d6 psychic damage."
        ]
    },
    {
        "name": "Exorcism",
        "level": 5,
        "school": "T",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "hour" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 30 } },
        "components": { "v": true, "s": true, "m": "sprinkler of holy water" },
        "duration": [{ "type": "instant" }],
        "entries": [
            "You call out to Prios to purge the immediate area of any creature that is not native to the material world and anoint everything else with his holy water. At the end of the casting time, each extraplanar creature must make a Wisdom saving throw. If you can see the creature as you cast the spell (for example it is trapped within a magic circle or otherwise confined) then it has disadvantage on its saving throw. An exorcised creature cannot return to the material world until at least 24 hours have passed."
        ]
    },
    {
        "name": "Fire Soul",
        "level": 5,
        "school": "T",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true, "s": true, "m": "pinch of ash" },
        "duration": [{ "type": "timed", "duration": { "type": "hour", "amount": 1 } }],
        "entries": [
            "Your eyes glow with a red light and you become extraordinarily hot to the touch. Creatures that touch you or attack you from within five feet take 6 (1d12) fire damage. You are immune to fire damage and the first time you take fire damage you instead regain hit points equal to half the damage you would have taken, rounded down."
        ]
    },
    {
        "name": "Purgatory",
        "level": 5,
        "school": "V",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 30 } },
        "components": { "v": true, "s": true, "m": "short piece of rusty chain" },
        "duration": [{ "type": "instant" }],
        "entries": [
            "You choose a creature within range, it must make a Wisdom saving throw with its current total Corruption as the DC. For thoroughly corrupt creatures the DC is 30. On a failure, the target takes 8d6 radiant damage or half that amount on a success.",
            "At Higher Levels. If you cast this spell at 6th level or higher, you can target an additional creature for each level above 5th."
        ]
    },
    {
        "name": "Atonement",
        "level": 6,
        "school": "T",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "touch" } },
        "components": { "v": true },
        "duration": [{ "type": "special" }],
        "entries": [
            "You are able to lighten the spiritual burdens of a non-possessed, willing person; this is done by the sinner accepting to perform a task for the theurg on behalf of the Church. The task must be time-consuming, expensive, or dangerous (or perhaps a combination of these factors). Upon completion of the task, the target's permanent Corruption is reduced by 1d3 + 1.",
            "If the target goes a month or more without making effort towards the task, the spell ends and the target gains one point of permanent Corruption for failing Prios."
        ]
    },
    {
        "name": "Living Fortress",
        "level": 6,
        "school": "T",
        "meta": { "ritual": true },
        "time": [{ "number": 1, "unit": "hour" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 10 } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "special" }],
        "entries": [
            "You create a fortress of living trees and thorny bushes that erupt from the local growth. The fortress is approximately 20 feet on a side and no higher than 20 feet. Its exact layout is determined by the caster. Each wall and the canopy roof have 50 hit points, AC 15, resistance to non-magical piercing damage and immunity to poison and psychic damage. At the start of a round, a damaged section regenerates 5 hit points of damage.",
            "You can allow creatures of your choice to enter or exit the fortress and teach them special words to allow them passage even if you're not there. Inside the fortress it is always dry and a comfortable temperature. Other creatures who attempt to enter (or leave) the fortress must make a Dexterity saving throw, taking 4d12 piercing damage on a failure or half that on a success.",
            "The fortress lives a season (three months) and then the spell must be cast again or the magic will fade and it will start to wither away."
        ]
    },
    {
        "name": "Patron Saint",
        "level": 6,
        "school": "C",
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "feet", "amount": 120 } },
        "components": { "v": true, "s": true, "m": "a bit of fleece and jade dust worth at least 25 thaler" },
        "duration": [{ "type": "special" }],
        "entries": [
            "You summon a guardian spirit to aid you, the soul of a fallen Templar that has been given the honorable mission to once again serve one of the Sun God's chosen. The martyr manifests as a being of light. It is normally invisible, but begins to shine when danger is close.",
            "In non-combat situations, the spirit serves as your assistant. Once on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command. The spirit will never venture more than 120 feet away from you. If it is somehow prevented from remaining within that distance of you, it is dispelled when the distance between the two of you exceeds the range of the spell.",
            "In combat, the spirit becomes a glowing figure with a flail made out of light and a halo above its head. Use the following statblock for the spirit, it acts independently. If slain, the spirit is dispelled. The spirit counts as a member of your group, receiving a full share of experience points awarded.",
            "Patron Saint. Medium celestial. Armor Class 17 (magical halo, shield). Hit Points 136 (16d8 + 64). Speed 30 ft., fly 90 ft. STR 18 (+4), DEX 18 (+4), CON 18 (+4), INT 17 (+3), WIS 20 (+5), CHA 20 (+5). Saving Throws Wis +9, Cha +9. Skills Insight +9, Perception +9. Condition Immunities charmed, exhaustion, frightened. Damage Resistances radiant; bludgeoning, piercing, and slashing from nonmagical attacks. Senses darkvision 120 ft., passive Perception 19. Languages telepathy with its summoner. Challenge 9 (5,000 XP, proficiency bonus +4). Manner proud and helpful. Shadow gleaming gold (Corruption: 0/13). Equipment none.",
            "Divine Weapons. The patron saint's weapon attacks are magical. When it hits with any weapon, the weapon does an extra 3d8 radiant damage (included below).",
            "Innate Spellcasting. The patron saint's spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no components: At will: detect evil and good. 3/day each: cure wounds (at 3rd level).",
            "Magic Resistance. The patron saint has advantage on saving throws against spells and other magical effects.",
            "Actions. Multiattack. The patron saint makes two melee attacks. Flail. Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) bludgeoning damage plus 13 (3d8) radiant damage. On a critical hit, the target is knocked prone as well."
        ]
    },
    {
        "name": "Soul Stone",
        "level": 7,
        "school": "N",
        "meta": { "ritual": true },
        "time": [{ "number": 10, "unit": "minute" }],
        "range": { "type": "point", "distance": { "type": "touch" } },
        "components": { "s": true, "m": "special" },
        "duration": [{ "type": "special" }],
        "entries": [
            "During desperate moments of the war, the battle mages of Ordo Magica took increasingly greater risks in the name of necessity and thereby brought Corruption upon themselves. To counteract this evil they dusted off an ancient and shunned ritual, by which one can capture the soul of a dying creature in a crystal prepared for the purpose. That same ritual proved to work well in order to drain Corruption from a wizard and transfer it to the soul in the stone.",
            "With the first casting, the mystic uses a soul stone (see page 185) worth at least 100 thaler and a creature that dies as a result of the spell. The creature must have less than 10 hit points at the time you begin to cast the spell. At the end of the spell, the creature dies, and the spell collects the soul of the dying creature, turning the gem into a soul stone. Roll 2d4 and add your spellcasting modifier; this is the amount of permanent Corruption that the soul stone can hold.",
            "Subsequent castings allow the mystic to move 1d4 points of permanent Corruption to the soul stone. The soul stone darkens as it fills up and detonates if its limit is surpassed. The collected Corruption then rushes back to the mystic, often with a rather nasty result.",
            "You can only use a single soul stone at a time and cannot create a new one while an old one exists."
        ]
    },
    {
        "name": "Blood Storm",
        "level": 8,
        "school": "C",
        "time": [{ "number": 1, "unit": "action" }],
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true, "s": true, "m": "a few drops of your own blood" },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }],
        "entries": [
            "You create a raging storm of blood 150 feet in diameter, with yourself and any nearby allies and enemies within the eye of the storm, a 15-foot radius, remaining unharmed.",
            "The storm heavily obscures the area and those caught in the storm are blinded. In order to take an action, they must first succeed at a Wisdom saving throw. On a success they are able to act this turn.",
            "The blood storm also has a drowning effect; it actively aims for the mouth and nose. If a creature starts its turn in the storm, the creature must make a Constitution saving throw, taking 8d6 necrotic damage on a failed save or half that on a successful one. The only way to avoid the effect is to leave the storm's area of effect, move into the eye area, or find a structure that can be completely closed off from the storm's effects.",
            "On your turn, you can use a bonus action to move the cloud up to 10 feet in a direction that you choose."
        ]
    }
];

const spellDetailsByName = Object.fromEntries(spellDetails.map(spell => [spell.name, spell]));

const spellCopyMods = {
    "Accurate Strike": {
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }],
        "_mod": {
            "*": [
                {
                    "mode": "replaceTxt",
                    "replace": "On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended.",
                    "with": "As long as the spell remains active, you have advantage on your first attack roll against the target on your turn."
                },
                {
                    "mode": "replaceTxt",
                    "replace": "grants you a brief insight into the target's defenses",
                    "with": "gives insights into the target's defenses"
                }
            ]
        }
    },
    "Cure Wounds": {
        "_mod": { "*": { "mode": "replaceTxt", "replace": "undead or constructs", "with": "constructs", "flags": "i" } }
    },
    "Healing Word": {
        "_mod": { "*": { "mode": "replaceTxt", "replace": "undead or constructs", "with": "constructs", "flags": "i" } }
    },
    "Prayer of Healing": {
        "_mod": { "*": { "mode": "replaceTxt", "replace": "undead or constructs", "with": "constructs", "flags": "i" } }
    },
    "Mass Healing Word": {
        "_mod": { "*": { "mode": "replaceTxt", "replace": "undead or constructs", "with": "constructs", "flags": "i" } }
    },
    "Mass Cure Wounds": {
        "_mod": { "*": { "mode": "replaceTxt", "replace": "undead or constructs", "with": "constructs", "flags": "i" } }
    },
    "Heal": {
        "_mod": { "*": { "mode": "replaceTxt", "replace": "constructs or undead", "with": "constructs", "flags": "i" } }
    },
    "Mass Heal": {
        "_mod": { "*": { "mode": "replaceTxt", "replace": "undead or constructs", "with": "constructs", "flags": "i" } }
    },
    "Detect Evil and Good": {
        "_mod": {
            "*": [
                { "mode": "replaceTxt", "replace": "aberration, celestial", "with": "aberration, blight-born, celestial" }
            ]
        }
    },
    "Protection from Evil and Good": {
        "_mod": {
            "*": [
                { "mode": "replaceTxt", "replace": "aberrations, celestials, elementals, fey, fiends, and undead", "with": "aberrations, blight-born, celestials, elementals, fey, and fiends" }
            ]
        }
    },
    "Hellish Rebuke": {
        "time": [{ "number": 1, "unit": "reaction", "condition": "when a creature damages you" }]
    },
    "Animate Dead": {
        "time": [{ "number": 1, "unit": "hour" }]
    },
    "Blink": {
        "_mod": {
            "*": [
                { "mode": "replaceTxt", "replace": "Ethereal Plane", "with": "Yonderworld", "flags": "g" },
                { "mode": "replaceTxt", "replace": "plane you originated from", "with": "place you originated from", "flags": "g" }
            ]
        }
    },
    "Counterspell": {
        "time": [{ "number": 1, "unit": "reaction", "condition": "when a creature within range casts a spell" }]
    },
    "Glyph of Warding": {
        "components": { "v": true, "s": true, "m": "incense and powdered diamond worth at least 100 thaler, which the spell consumes" },
        "_mod": {
            "*": [
                { "mode": "replaceTxt", "replace": "200 gp", "with": "100 thaler" },
                { "mode": "replaceTxt", "replace": "creature kind \\(for example, the ward could be set to affect aberrations or drow\\)", "with": "creature kind (for example, the ward could be set to affect only abominations)", "flags": "g" }
            ]
        }
    },
    "Magic Circle": {
        "time": [{ "number": 1, "unit": "action" }],
        "components": { "v": true, "s": true, "m": "holy water or powdered silver and iron worth at least 50 thaler, which the spell consumes" },
        "entries": [
            "You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or another surface. Choose one option:",
            "A mystic that knows the pattern to a permanent teleportation circle may communicate telepathically with the attendant of that circle.",
            "Choose one or more of the following types of creatures: celestials, elementals, fey, fiends, or phenomenons. The circle affects a creature of the chosen type in the following ways:",
            "The creature can't willingly enter the cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw.",
            "The creature has disadvantage on attack rolls against targets within the cylinder.",
            "Targets within the cylinder can't be charmed, frightened, or possessed by the creature.",
            "When you choose this option, you can elect to cause its magic to operate in the reverse direction, preventing a creature of the specified type from leaving the cylinder and protecting targets outside it."
        ],
        "entriesHigherLevel": [
            {
                "type": "entries",
                "name": "At Higher Levels",
                "entries": [
                    "When you cast this spell at 4th level or higher, the duration increases by 1 hour for each level above 3rd."
                ]
            }
        ]
    },
    "Spirit Guardians": {
        "_mod": {
            "*": [
                { "mode": "replaceTxt", "replace": "If you are good or neutral, their spectral form appears angelic or fey \\(your choice\\). If you are evil, they appear fiendish.", "with": "If you are blight-stricken or uncorrupted, their spectral form appears angelic or fey (your choice). If you are blight-marked, they appear fiendish.", "flags": "g" },
                { "mode": "replaceTxt", "replace": "\\{@damage 3d8\\} radiant damage \\(if you are good or neutral\\) or \\{@damage 3d8\\} necrotic damage \\(if you are evil\\)", "with": "{@damage 3d8} radiant damage or {@damage 3d8} necrotic damage (if you are blight-marked)", "flags": "g" }
            ]
        }
    },
    "Dispel Evil and Good": {
        "entries": [
            "Shimmering energy surrounds and protects you from abominations, celestials, elementals, fey, fiends, or phenomenons, providing disadvantage on their attack rolls against you.",
            "You can end the spell early by using the following special function:",
            "Break Enchantment. As your action, you touch a creature you can reach that is charmed, frightened, or possessed by an abomination, a celestial, an elemental, a fey, or a fiend. The creature you touch is no longer charmed, frightened, or possessed by such creatures."
        ]
    },
    "Insect Plague": {
        "components": { "v": true, "s": true, "m": true }
    },
    "Teleportation Circle": {
        "components": { "v": true, "m": "rare chalks and inks infused with precious gems worth 50 thaler, which the spell consumes" },
        "_mod": {
            "*": [
                { "mode": "replaceTxt", "replace": "50 gp", "with": "50 thaler" },
                { "mode": "replaceTxt", "replace": "Many major temples, guilds, and other important places have permanent teleportation circles inscribed somewhere within their confines.", "with": "Many Ordo Magica facilities have permanent teleportation circles inscribed somewhere within their confines." }
            ]
        }
    },
    "Turn Weather": {
        "range": { "type": "point", "distance": { "type": "self" } },
        "components": { "v": true, "s": true }
    },
    "Circle of Death": {
        "components": { "v": true, "s": true, "m": "the powder of a crushed black pearl worth at least 250 thaler" },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }],
        "_mod": { "*": { "mode": "replaceTxt", "replace": "500 gp", "with": "250 thaler" } }
    },
    "Create Undead": {
        "components": { "v": true, "s": true, "m": "one clay pot filled with grave dirt, one clay pot filled with brackish water, and one 75 thaler black onyx stone for each corpse" },
        "entries": [
            "You can cast this spell only at night. Choose up to three corpses of Medium or Small humanoids within range. Each corpse becomes a dragoul under your control. (The GM has game statistics for these creatures.)",
            "As a bonus action on each of your turns, you can mentally command any creature you animated with this spell if the creature is within 120 feet of you (if you control multiple creatures, you can command any or all of them at the same time, issuing the same command to each one). You decide what action the creature will take and where it will move during its next turn, or you can issue a general command, such as to guard a particular chamber or corridor. If you issue no commands, the creature only defends itself against hostile creatures. Once given an order, the creature continues to follow it until its task is complete.",
            "The creature is under your control for 24 hours, after which it stops obeying any command you have given it. To maintain control of the creature for another 24 hours, you must cast this spell on the creature before the current 24-hour period ends. This use of the spell reasserts your control over up to three creatures you have animated with this spell, rather than animating new ones."
        ],
        "entriesHigherLevel": [
            {
                "type": "entries",
                "name": "At Higher Levels",
                "entries": [
                    "When you cast this spell at 7th level, you can animate or reassert control over four dragouls. When you cast this spell at 8th level, you can animate or reassert control over five dragouls or two crypt walkers. If you cast this spell at 9th level, you can animate or reassert control over six dragouls, three crypt walkers, or one crypt lord."
                ]
            }
        ]
    },
    "Freezing Sphere": {
        "range": { "type": "point", "distance": { "type": "feet", "amount": 120 } },
        "components": { "v": true, "s": true },
        "duration": [{ "type": "timed", "concentration": true, "duration": { "type": "minute", "amount": 1, "upTo": true } }]
    },
    "Etherealness": {
        "_mod": {
            "*": [
                { "mode": "replaceTxt", "replace": "Ethereal Plane", "with": "ethereal realm between the real world and the Yonderworld", "flags": "g" },
                { "mode": "replaceTxt", "replace": "Border Ethereal", "with": "border realm", "flags": "g" },
                { "mode": "replaceTxt", "replace": "plane you originated from", "with": "real world", "flags": "g" }
            ]
        }
    },
    "Plane Shift": {
        "components": { "v": true, "s": true, "m": "a forked, metal rod worth at least 100 thaler, attuned to the Yonderworld" },
        "entries": [
            "You and up to eight willing creatures who link hands in a circle are transported into the Yonderworld, or if you are in the Yonderworld when this spell is cast, you are returned to the real world.",
            "You can use this spell to banish an unwilling creature to the Yonderworld. Choose a creature within your reach and make a melee spell attack against it. On a hit, the creature must make a Charisma saving throw. If the creature fails this save, it is transported to a random location in the Yonderworld. A creature so transported must find its own way back to the real world."
        ]
    }
};

const getClasses = (inputClasses) => {
    return inputClasses.map(cls => {
        var classRef = classes[cls];
        if (!classRef) throw Error(`${cls} does not exist`);
        return {
            "class": {
                "name": classRef.class,
                "source": classSource
            },
            "subclass": {
                "name": classRef.subclass,
                "source": subclassSource,
                "shortName": classRef.subclass
            }
        }
    })

}
var output = spells.map(spell => {
    const outputClasses =  getClasses(spell.classes);
    const outputSpell = {
        "name": spell.name,
        "source": spellSource,
        "foundryFlags": {
            "ros5e": {
                "isRoSSpell": true,
                "notFavorable": !spell.isFavourable,
            }
        },
        "classes": {
            "fromSubclass": outputClasses
        }
    };
    if (spell.isRitual) outputSpell.meta = { "ritual": true };
    if (spell.copyFrom) {
        const copyMods = spellCopyMods[spell.name] || {};
        const { _mod, ...copyOverrides } = copyMods;
        outputSpell._copy = {
            "name": spell.copyFrom,
            "source": spell.sourceFrom
        };
        if (_mod) outputSpell._copy._mod = _mod;
        Object.assign(outputSpell, copyOverrides);
    } else {
        const details = spellDetailsByName[spell.name];
        if (!details) throw Error(`${spell.name} has no spell details`);
        const { name, ...detailOutput } = details;
        Object.assign(outputSpell, detailOutput);
        if (!detailOutput.meta) delete outputSpell.meta;
    }
    return outputSpell;
});

fs.writeFileSync(new URL("spell.json", import.meta.url), JSON.stringify(output, null, 4));
