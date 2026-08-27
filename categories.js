const default_categories = {
    productivity: [
        "github.com",
        "gitlab.com",
        "bitbucket.org",
        "stackoverflow.com",
        "stackexchange.com",
        "notion.so",
        "docs.google.com",
        "drive.google.com",
        "sheets.google.com",
        "slides.google.com",
        "calendar.google.com",
        "forms.google.com",
        "keep.google.com",
        "trello.com",
        "asana.com",
        "linear.app",
        "monday.com",
        "clickup.com",
        "jira.atlassian.com",
        "confluence.atlassian.com",
        "figma.com",
        "canva.com",
        "miro.com",
        "airtable.com",
        "dropbox.com",
        "box.com",
        "onedrive.live.com",
        "office.com",
        "outlook.com",
        "mail.google.com",
        "gmail.com",
        "zoom.us",
        "meet.google.com",
        "teams.microsoft.com",
        "slack.com",
        "evernote.com",
        "todoist.com",
        "basecamp.com",
        "salesforce.com",
        "hubspot.com",
        "zendesk.com",
        "loom.com",
        "calendly.com",
        "1password.com",
        "lastpass.com"
    ],
    development: [
        "npmjs.com",
        "pypi.org",
        "developer.mozilla.org",
        "w3schools.com",
        "codepen.io",
        "codesandbox.io",
        "replit.com",
        "vercel.com",
        "netlify.com",
        "heroku.com",
        "aws.amazon.com",
        "console.cloud.google.com",
        "azure.microsoft.com",
        "docker.com",
        "kubernetes.io",
        "postman.com",
        "leetcode.com",
        "hackerrank.com",
        "devpost.com",
        "readthedocs.io",
        "sourceforge.net"
    ],
    social: [
        "instagram.com",
        "facebook.com",
        "reddit.com",
        "x.com",
        "twitter.com",
        "discord.com",
        "web.whatsapp.com",
        "whatsapp.com",
        "tiktok.com",
        "snapchat.com",
        "pinterest.com",
        "tumblr.com",
        "telegram.org",
        "web.telegram.org",
        "messenger.com",
        "threads.net",
        "quora.com",
        "mastodon.social",
        "vk.com"
    ],
    education: [
        "coursera.org",
        "edx.org",
        "khanacademy.org",
        "udemy.com",
        "udacity.com",
        "wikipedia.org",
        "wikihow.com",
        "brilliant.org",
        "quizlet.com",
        "duolingo.com",
        "chegg.com",
        "codecademy.com",
        "skillshare.com",
        "aucegypt.edu",
        "scholar.google.com",
        "researchgate.net",
        "jstor.org",
        "academia.edu",
        "ted.com", 
        "britannica.com"
    ],
    entertainment: [
        "youtube.com",
        "netflix.com",
        "youtu.be",
        "twitch.tv",
        "spotify.com",
        "soundcloud.com",
        "shahid.mbc.net",
        "play.yango.com",
        "hulu.com",
        "disneyplus.com",
        "primevideo.com",
        "hbomax.com",
        "max.com",
        "vimeo.com",
        "dailymotion.com",
        "pandora.com",
        "deezer.com",
        "anghami.com",
        "crunchyroll.com",
        "steamcommunity.com",
        "store.steampowered.com",
        "epicgames.com",
        "roblox.com",
        "ign.com",
        "imdb.com",
        "letterboxd.com"
    ],
    shopping: [
        "amazon.com",
        "ebay.com",
        "etsy.com",
        "aliexpress.com",
        "noon.com",
        "jumia.com.eg",
        "walmart.com",
        "target.com",
        "bestbuy.com",
        "shein.com",
        "wayfair.com",
        "ikea.com",
        "shopify.com",
        "olx.com.eg",
        "souq.com",
        "townteam.com"
    ],
    news: [
        "cnn.com",
        "bbc.com",
        "nytimes.com",
        "theguardian.com",
        "reuters.com",
        "aljazeera.com",
        "ahram.org.eg",
        "youm7.com",
        "bloomberg.com",
        "washingtonpost.com",
        "apnews.com",
        "npr.org",
        "wsj.com",
        "foxnews.com",
        "forbes.com",
        "techcrunch.com",
        "theverge.com",
        "arstechnica.com",
        "wired.com"
    ],
    finance: [
        "paypal.com",
        "stripe.com",
        "wise.com",
        "revolut.com",
        "chase.com",
        "bankofamerica.com",
        "coinbase.com",
        "binance.com",
        "robinhood.com",
        "mint.com",
        "tradingview.com",
        "thndr.app",
        "cibeg.com",
        "investing.com",
        "nbe.com.eg"
    ],
    travel: [
        "booking.com",
        "airbnb.com",
        "expedia.com",
        "tripadvisor.com",
        "skyscanner.com",
        "kayak.com",
        "uber.com",
        "careem.com",
        "swvl.com",
        "trivago.com"
    ],
    health : [
        "webmd.com",
        "mayoclinic.org",
        "nih.gov",
        "who.int",
        "healthline.com",
        "myfitnesspal.com"
    ],
    ai_tools: [
        "chatgpt.com",
        "openai.com",
        "claude.ai",
        "anthropic.com",
        "gemini.google.com",
        "perplexity.ai",
        "midjourney.com",
        "huggingface.co",
    ]
};


const category_names = {
    productivity: "Productivity & Working",
    development: "Development & Coding",
    education: "Education",
    entertainment: "Entertainment",
    social: "Social Media",
    shopping: "Shopping",
    news: "News",
    finance: "Finance",
    ai_tools: "AI Tools",
    health: "Medical",
    travel: "Travel",
    other: "Other",
    government: "Government",
    nonprofit_org: "Non-profit / Organization"
};


const category_icons = {
    productivity: "💻",
    development: "⚙️",
    education: "🎓",
    entertainment: "🎮",
    social: "💬",
    shopping: "🛍️",
    news: "📰",
    finance: "💵",
    ai_tools: "👩‍💻",
    health: "❤️‍🩹",
    travel: "✈️",
    other: "🌐",
    government: "🏛️",
    nonprofit_org: "🌍"
};

function getCategory(urlOrHost){
    let host;
    try {
        host = new URL (urlOrHost.includes("://") ? urlOrHost : `https://${urlOrHost}`).hostname.toLowerCase();
    } catch {
        host = String(urlOrHost).toLowerCase();
    }

    host = host.replace(/^www\./, "");

    for (const [category, domains] of Object.entries(default_categories)) {
        for (const domain of domains) {
            if (host === domain || host.endsWith(`.${domain}`)) {
                return category;
            }
        }
    }

    if (/\.edu(\.[a-z]{2,3})?$/.test(host)) {
        return "education";
    }

    if (/\.gov(\.[a-z]{2,3})?$/.test(host)) {
        return "government";
    }

    if (/\.org$/.test(host)) {
        return "nonprofit_org";
    }

    return"other";
}

function getCategoryName(category) {
    return category_names[category] || category_names.other;
}

function getCategoryIcon(category) {
    return category_icons[category] || category_icons.other;
}


