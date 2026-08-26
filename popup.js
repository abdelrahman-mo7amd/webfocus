console.log("WebFocus popup is running!");

function todayKey() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `data:${year}-${month}-${day}`;
}

function formatTime(ms) {
    const totalMinutes = Math.floor(ms / 60000);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}

async function loadData() {
    const key = todayKey();

    const data = await chrome.storage.local.get(key);
    const today = data[key] || {};

    console.log("Today's data:", today);

    let totalTime = 0;

    for (const domain in today) {
        totalTime += today[domain];
    }

    console.log("Total time:", totalTime, "ms");

    document.getElementById("time").textContent =
        formatTime(totalTime);
}

loadData();