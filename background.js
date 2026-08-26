let saveQueue = Promise.resolve();

function getDomain(url) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            return null;
        }

        return parsedUrl.hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function todayKey() {
    return dateKey(new Date());
}

async function getTrackingState() {
    const data = await chrome.storage.session.get([
        'currentDomain',
        'startTime',
        'tabId'
    ]);

    return {
        currentDomain: data.currentDomain || null,
        startTime: data.startTime || null,
        tabId: data.tabId || null
    };
}

async function setTrackingState(domain, startTime, tabId) {
    await chrome.storage.session.set({
        currentDomain: domain, 
        startTime: startTime,
        tabId: tabId
    });
}

function save_time(domain, startTime, endTime) {
    saveQueue = saveQueue.then(async () => {
        let currentTime = startTime;
        while (currentTime < endTime){
            const startDate = new Date(currentTime);
            const nextDay = new Date(startDate);
            nextDay.setHours(24, 0, 0, 0);

            const segmentEnd = Math.min(
                endTime,
                nextDay.getTime()
            );

            const key = `data:${dateKey(startDate)}`;

            const data = await chrome.storage.local.get(key);
            const today = data[key] || {};

            const oldTime = today[domain] || 0;
            const elapsed = segmentEnd - currentTime;

            today[domain] = oldTime + elapsed;

            await chrome.storage.local.set({
                [key]: today
            });

            console.log(`Saved: ${domain} = ${elapsed} ms on ${dateKey(startDate)}`);

            currentTime = segmentEnd;
        }
    });

    return saveQueue;
}

async function startTracking(domain, tabId) {
    const state = await getTrackingState();

    if (
        state.currentDomain === domain &&
        state.tabId === tabId
    ) {
        return;
    }

    if (state.currentDomain) {
        await stopTracking();
    }

    await setTrackingState(
        domain, 
        Date.now(),
        tabId
    );

    console.log(`Started tracking: ${domain}`);
}


async function stopTracking() {
    const state = await getTrackingState();

    if (!state.currentDomain || !state.startTime) {
        return;
    }

    await save_time(
        state.currentDomain,
        state.startTime,
        Date.now()
    );

    console.log(`Stopped tracking: ${state.currentDomain}`);
    await chrome.storage.session.remove([
        "currentDomain",
        "startTime",
        "tabId"
    ]);
}

async function initializeTracking() {
    console.log("WebFocus is running!");

    const [tab] = await chrome.tabs.query({
        active:true,
        lastFocusedWindow: true
    });

    if (!tab || !tab.url || tab.id === undefined) {
        return;
    }

    const domain = getDomain(tab.url);

    if (!domain) {
        return;
    }

    await startTracking(domain, tab.id);
}


chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (!tab || !tab.url) {
        await stopTracking();
        return;
    }

    const domain = getDomain(tab.url);

    if (!domain) {
        await stopTracking();
        return;
    }

    await startTracking(domain, tab.id);
});


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!changeInfo.url || !tab.active) {
        return;
    }

    if (!tab.url) {
        await stopTracking();
        return;
    }

    const domain = getDomain(tab.url);

    if (!domain) {
        await stopTracking();
        return;
    }

    await startTracking(domain, tabId);
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
    const state = await getTrackingState();

    if (state.tabId !== tabId) {
        return;
    }

    await stopTracking();
});

chrome.alarms.create('save-time', {
    periodInMinutes: 0.5
});


chrome.alarms.onAlarm.addListener(async (alarm) => {
    const state = await getTrackingState();
 
    if (!state.currentDomain || !state.startTime) {
        return;
    }
 
    const now = Date.now();
 
    await save_time(
        state.currentDomain,
        state.startTime,
        now
    );
 
    await setTrackingState(
        state.currentDomain,
        now,
        state.tabId
    );
});


chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log("Chrome lost focus");

        await stopTracking();

        return;
    }

    console.log("Chrome get focus");

    const [tab] = await chrome.tabs.query({
        active:true,
        windowId:windowId
    });

    if (!tab || !tab.url) {
        return;
    }

    const domain = getDomain(tab.url);
    
    if (!domain) {
        await stopTracking();
        return;
    }

    await startTracking(domain, tab.id);
});

chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(async (state) => {
    console.log("USER STATE: ", state);
    if (state === 'active') {
        const [tab] = await chrome.tabs.query({
            active:true,
            lastFocusedWindow: true
        });

        if (!tab || !tab.url){
            return;
        }

        const domain = getDomain(tab.url);

        if (!domain) {
            await stopTracking();
            return;
        }

        console.log("Current domain: " , domain);
        await startTracking(domain, tab.id);
    }

    if (state === 'idle' || state === 'locked'){
        await stopTracking();
    }
});


initializeTracking();
