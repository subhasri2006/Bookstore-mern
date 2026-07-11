const User = require("../models/User");
const Order = require("../models/Order");
const Book = require("../models/Book");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const chatWithAI = async (req, res) => {
  try {
    const Chat = require("../models/Chat");
    const { message, email } = req.body;
    // 🔥 LOAD OLD CHAT
      let chatHistory = [];

      const previousChat = await Chat.findOne({ email });

      if (previousChat) {
        chatHistory = previousChat.messages
          .slice(-6) // last 6 messages
          .map(msg => `${msg.sender}: ${msg.text}`)
          .join("\n");
      }
    // 🔥 GET USER DATA
    const user = await User.findOne({ email }).populate("wishlist");

    const orders = await Order.find({ email });
    // 🔥 USER PREFERENCES
    let userInterests = [];

    // ✅ FROM WISHLIST
    if (user?.wishlist?.length > 0) {
      user.wishlist.forEach((book) => {
        if (book.category) {
          userInterests.push(book.category.toLowerCase());
        }
      });
    }

    // ✅ FROM ORDERS
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.title) {
          userInterests.push(item.title.toLowerCase());
        }
      });
    });

    // ✅ REMOVE DUPLICATES
    userInterests = [...new Set(userInterests)];

    console.log("USER INTERESTS:", userInterests);

    // 🔥 REMOVE COMMON WORDS
    const stopWords = [
      "suggest",
      "recommend",
      "show",
      "give",
      "find",
      "me",
      "some",
      "please",
      "i",
      "want",
      "need",
      "good",
      "best",
      "for",
      "to",
      "read",
      "can",
      "you"
    ];

    // 🔥 CLEAN USER MESSAGE
    // 🔥 COMBINE CHAT HISTORY + CURRENT MESSAGE
const combinedMessage = `
${chatHistory}
${message}
`.toLowerCase();

const searchMessage = message.toLowerCase();
console.log("COMBINED MESSAGE:", combinedMessage);

// 🔥 PRICE DETECTION
const priceMatch = searchMessage.match(/\d+/);

let targetPrice = null;

if (priceMatch) {
  targetPrice = parseInt(priceMatch[0]);
}

console.log("TARGET PRICE:", targetPrice);
// 🔥 REMOVE COMMON WORDS


    // 🔥 CLEAN MESSAGE
    let keyword = searchMessage
      .split(" ")
      .filter((word) => !stopWords.includes(word))
      .join(" ")
      .trim();

    // 🔥 REMOVE EXTRA WORDS
    keyword = keyword
      .replace(/under\s+\d+/g, "")
      .replace(/below\s+\d+/g, "")
      .replace(/within\s+\d+/g, "")
      .replace(/around\s+\d+/g, "")
      .replace(/above\s+\d+/g, "")
      .replace(/more than\s+\d+/g, "")
      .trim();

    // 🔥 SPELL FIXES
    const corrections = {
      programmin: "programming",
      progrmming: "programming",

      religour: "religion",
      relilgion: "religion",
      religiion: "religion",

      fictin: "fiction",
      romnce: "romance",
      motivatonal: "motivational",
      horrer: "horror"
    };

    Object.keys(corrections).forEach((wrong) => {
      keyword = keyword.replace(
        new RegExp(wrong, "g"),
        corrections[wrong]
      );
    });

    // 🔥 SEMANTIC CATEGORY MAP
    const categoryMap = {
      programming: [
        "programming",
        "coding",
        "computer science",
        "development",
        "software"
      ],

      fiction: [
        "fiction",
        "novel",
        "story"
      ],

      romance: [
        "romance",
        "love"
      ],

      motivational: [
        "motivational",
        "self help",
        "inspiration"
      ],

      journal: [
        "journal",
        "diary",
        "self reflection"
      ],
      religion: [
        "religion",
        "religious",
        "spiritual",
        "spirituality",
        "buddhism"
      ]
    };

    // 🔥 DETECT CATEGORY
    let searchTerms = [keyword];
          // 🔥 DETECT LAST CATEGORY
      let detectedCategory = "";

      Object.keys(categoryMap).forEach((cat) => {
        if (keyword.includes(cat)) {
          detectedCategory = cat;
        }
      });

      console.log("DETECTED CATEGORY:", detectedCategory);
    for (const key in categoryMap) {
      if (keyword.includes(key)) {
        searchTerms = categoryMap[key];
        break;
      }
    }

    console.log("KEYWORD:", keyword);
    console.log("SEARCH TERMS:", searchTerms);
    
    // 🔍 SEARCH DATABASE
    console.log("FINAL SEARCH TERMS:", searchTerms);
    let books = [];

    // 🔥 CATEGORY SEARCH
    if (detectedCategory) {

      books = await Book.find({
        $or: categoryMap[detectedCategory].map(term => ({
        category: {
        $regex: term,
        $options: "i"
      }
      }))
      }).limit(5);

    }

    // 🔥 FALLBACK SEARCH
    else {

      books = await Book.find({
        $or: searchTerms.flatMap(term => ([
          { title: { $regex: term, $options: "i" } },
          { author: { $regex: term, $options: "i" } },
          { category: { $regex: term, $options: "i" } },
          { description: { $regex: term, $options: "i" } }
        ]))
      }).limit(5);

    }
    console.log("BOOKS FOUND:", books);
    // 🔥 PRICE RANGE FILTERS

if (
  searchMessage.includes("under") ||
  searchMessage.includes("below") ||
  searchMessage.includes("less than") ||
  searchMessage.includes("within")
) {

  if (targetPrice) {
  books = await Book.find({
    price: { $lte: targetPrice }
  })
  .sort({ price: 1 })
  .limit(5);
}

}

if (
  searchMessage.includes("above") ||
  searchMessage.includes("more than")
) {

  if (targetPrice) {
    books = books.filter(
      book => book.price >= targetPrice
    );
  }

}

if (
  searchMessage.includes("around")
) {

  if (targetPrice) {

    books = books.filter(
      book =>
        book.price >= targetPrice - 100 &&
        book.price <= targetPrice + 100
    );

  }

}
    // 🔥 CHEAPER / EXPENSIVE FILTER
    if (
      searchMessage.includes("cheap") ||
      searchMessage.includes("cheaper") ||
      searchMessage.includes("low price")
    ) {

      books.sort((a, b) => a.price - b.price);

    }

    if (
      searchMessage.includes("expensive") ||
      searchMessage.includes("premium")
    ) {

      books.sort((a, b) => b.price - a.price);

    }
    // 📚 CREATE BOOK CONTEXT
    let context = "";

    if (books.length > 0) {
      context = books.map((b) => `
      Title: ${b.title}
      Author: ${b.author}
      Category: ${b.category}
      Price: ₹${b.price}
      Description: ${b.description}
            `).join("\n");
    } else {
      context = "No matching books found.";
    }

    // 🤖 AI RESPONSE
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content: `
      You are Bookish AI Assistant.

      Previous conversation:
      ${chatHistory}

      User interests:
      ${userInterests.join(", ")}

      RULES:
      - Remember previous conversation
      - Recommend books naturally
      - Prioritize user's interests
      - Be conversational
      - Keep response short and attractive
      - If books exist, recommend them properly
      - Never say database is empty if books are provided
      `
          },

          {
            role: "user",
            content: `
      User message:
      ${message}

      Books found:
      ${JSON.stringify(books)}
      `
          }
        ]
      });

      const reply = completion.choices[0].message.content;


      // 🔥 SAVE CHAT
      if (previousChat) {

        previousChat.messages.push(
          {
            sender: "user",
            text: message
          },
          {
            sender: "ai",
            text: reply
          }
        );

        await previousChat.save();

      } else {

        await Chat.create({
          email,
          messages: [
            {
              sender: "user",
              text: message
            },
            {
              sender: "ai",
              text: reply
            }
          ]
        });

      }

     

    

    res.json({
      reply,
      books
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "AI error"
    });
  }
};

module.exports = {
  chatWithAI
};