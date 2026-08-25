console.log("WebFocus is running!");

async function getTrackingState() {
    const data = await chrome.storage.session.get([
        'currentDomain',
        'startTime'
    ]);

    return {
        currentDomain: data.currentDomain || null,
        startTime: data.startTime || null
    };
}


async function setTrackingState(domain, startTime) {
    await chrome.storage.session.set({
        currentDomain: domain, 
        startTime: startTime
    });
}



async function stopTracking() {
    const state = await getTrackingState();

    if (!state.currentDomain || !state.startTime) {
        return;
    }

    const elapsed = Date.now() - state.startTime;
    await save_time(state.currentDomain, elapsed);
    console.log(`Stopped tracking: ${state.currentDomain}`);
    await chrome.storage.session.clear();
}


chrome.tabs.onActivated.addListener(async (activeInfo)=> {
    const [tab] = await chrome.tabs.query({
        active:true,
        lastFocusedWindow: true
    });

    if (!tab || !tab.url){
        return;
    }

    const url = new URL(tab.url);
    const domain = url.hostname.replace("www.", "");
    await startTracking(domain);
});



async function save_time (domain, time) {
    const key = `data:${todayKey()}`;
    const data = await chrome.storage.local.get(key);
    const today = data[key] || {};
    const old_time = today[domain] || 0;
    const new_time = old_time + time;
    
    today[domain] = new_time;

    await chrome.storage.local.set({
        [key]: today
    });

    console.log(`Saved: ${domain} today = ${new_time} ms`);
}

function todayKey() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

console.log(todayKey());

chrome.alarms.create('save-time', {
    periodInMinutes: 0.5
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    const state = await getTrackingState()

    if (!state.currentDomain || !state.startTime){
        return;
    }

    const now = Date.now();
    const elapsed = now - state.startTime;
    await save_time(state.currentDomain, elapsed);
    await setTrackingState(state.currentDomain, now);
});


chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log("Chrome lost focus");

        await stopTracking();

        return;
    }

    console.log("Chrome got focus");

    const [tab] = await chrome.tabs.query({
        active:true, 
        windowId: windowId
    });

    if (!tab || !tab.url) {
        return;
    }

    const url = new URL(tab.url);
    const domain = url.hostname.replace("www." , "");

    await startTracking(domain);
})

chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(async (state) => {
    console.log("USER STATE: ", state);
    if (state === 'active') {
        const [tab] = await chrome.tabs.query({
            active:true,
            lastFocusedWindow: true,
        });

        if (!tab || !tab.url) {
            return;
        }

        const url = new URL(tab.url);
        const domain = url.hostname.replace("www.", "");

        console.log("Current domain: ", domain);
        await startTracking(domain);
    } 

    if (state === 'idle' || state === 'locked'){
        await stopTracking();
    }
});


async function startTracking(domain) {
    const state = await getTrackingState();
    if (state.currentDomain === domain) {
        return;
    }

    if (state.currentDomain){
        await stopTracking();
    }

    const startTime = Date.now();
    await setTrackingState(domain, startTime);
    console.log(`Started tracking: ${domain}`);
}


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab)=> {
    if(!changeInfo.url || !tab.active){
        return;
    }

    const url = new URL(changeInfo.url);
    const domain = url.hostname.replace("www.", "");
    await startTracking(domain);
});

