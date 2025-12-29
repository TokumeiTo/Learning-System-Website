import { type Kanji } from "../types/kanji";

export const kanjiMockData: Kanji[] = [
    {
        id: "1",
        kanji: "日",
        jlptLevel: "N5",
        onyomi: ["ニチ", "ジツ"],
        kunyomi: ["ひ", "か"],
        meaning: "day, sun, counter for days",
        strokes: 4,
        romaji: 'hi',
        examples: [
            {
                word: "日本",
                reading: "にほん",
                meaning: "Japan",
            },
            {
                word: "毎日",
                reading: "まいにち",
                meaning: "every day",
            },
            {
                word: "今日",
                reading: "きょう",
                meaning: "Today",
            },
        ],
    },
    {
        id: "2",
        kanji: "人",
        jlptLevel: "N5",
        onyomi: ["ジン", "ニン"],
        kunyomi: ["ひと", '-り', '-と'],
        meaning: "person",
        strokes: 2,
        romaji: 'hito',
        examples: [
            {
                word: "日本人",
                reading: "にほんじん",
                meaning: "Japanese person",
            },
            {
                word: "二人",
                reading: "ふたり",
                meaning: "two people",
            },
            {
                word: "人間",
                reading: "にんげん",
                meaning: "human being, mankind",
            },
        ],

    },
    {
        id: "3",
        kanji: "月",
        jlptLevel: "N5",
        onyomi: ["ゲツ", "ガツ"],
        kunyomi: ["つき"],
        meaning: "moon, month",
        romaji: 'getsu, tsuki',
        strokes: 4,
        examples: [
            {
                word: "月曜日",
                reading: "げつようび",
                meaning: "Monday",
            },
            {
                word: "今月",
                reading: "こんげつ",
                meaning: "this Month",
            },
        ],
    },
    {
        id: "4",
        kanji: "議",
        jlptLevel: "N3",
        onyomi: ["ギ"],
        meaning: "discussion; deliberation, thought; opinion",
        romaji: 'gi',
        strokes: 20,
        examples: [
            {
                word: "会議",
                reading: "かいぎ",
                meaning: "meeting, conference",
            },
        ],
    },
    {
        id: "5",
        kanji: "買",
        jlptLevel: "N5",
        onyomi: ["バイ"],
        kunyomi: ["か。う"],
        meaning: "buy",
        romaji: "bai",
        strokes: 12,
        radicals: ['貝','目','八'],
        examples: [
            {
                word: "買う",
                reading: "かう",
                meaning: "Buy",
            },
        ],
    },
    {
        id: "6",
        kanji: "酒",
        jlptLevel: "N5",
        onyomi: ["シュ"],
        kunyomi: ["さけ", "さか‐"],
        meaning: "sake, alcohol",
        romaji: 'sake',
        strokes: 4,
        examples: [
            {
                word: "酒場",
                reading: "さかば",
                meaning: "Bar",
            },
        ],
    },
    {
        id: "7",
        kanji: "海",
        jlptLevel: "N5",
        onyomi: ["カイ"],
        kunyomi: ["うみ"],
        meaning: "sea, ocean",
        strokes: 9,
        romaji: 'umi',
        examples: [
            {
                word: "海外",
                reading: "かいがい",
                meaning: "Oversea",
            },
        ],
    },
    {
        id: "8",
        kanji: "弓",
        jlptLevel: "N5",
        onyomi: ["ニチ", "ジツ"],
        kunyomi: ["ひ", "か"],
        meaning: "day, sun",
        strokes: 4,
        romaji: 'yumi',
        examples: [
            {
                word: "日本",
                reading: "にほん",
                meaning: "Japan",
            },
        ],
    },
];
