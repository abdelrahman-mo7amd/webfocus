console.log("WebFocus popup is running!");

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
}

function getInitial(domain) {
    return domain.charAt(0).toUpperCase();
}

chrome.storage.local.get(null).then((data)=> {
    const key = todayKey();
    const today = data[key] || {};

    const sites = Object.entries(today).sort((a,b)=> b[1] - a[1]);

    const total = sites.reduce((sum, [, time])=> sum + time, 0);

    document.getElementById("totalTime").textContent = formatTime(total);

    document.getElementById("siteCount").textContent = `${sites.length} ${sites.length === 1 ? "site" : "sites"}`;

    const container = document.getElementById("sites");

    container.innerHTML = "";

    if (sites.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <div class="empty-icon">-</div>
                <h3>No activity yet</h3>
                <p>Start browsing and i am here to track your browsing time brooo!</p>
            </div>
        `;

        return;
    }

    const maxTime = sites[0][1];

    sites.forEach(([domain, time]) => {
        const percentage = (time / maxTime) * 100;
        const site = document.createElement('div');

        site.className = 'site';
        site.innerHTML = `
            <div class="site-icon">
                ${getInitial(domain)}
            </div>

            <div class="site-info">
                <div class="site-name">
                    ${domain}
                </div>

                <div class="bar-container">
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
            </div>

            <div class="site-time">
                ${formatTime(time)}
            </div>
        `;

        container.appendChild(site);
    });
});

function todayKey() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `data:${year}-${month}-${day}`;
}

// async function loadData() {
//     const key = todayKey();
//     const data = await chrome.storage.local.get(key);
//     const today = data[key] || {};
//     console.log("Today's data:", today);

//     let totalTime = 0;
//     for (const domain in today) {
//         totalTime+=today[domain];
//     }

//     document.getElementById("time").textContent = formatTime(totalTime);

//     const sites = document.getElementById("sites");

//     const domains = Object.entries(today);

//     domains.sort((a,b) => b[1] - a[1]);

//     for (const [domain, time] of domains) {
//         const row = document.createElement("div");
//         row.className = "site";

//         const top = document.createElement('div');
//         top.className = 'site-top';

//         const name = document.createElement("span");
//         name.textContent = domain;

//         const duration = document.createElement("span");
//         duration.textContent = formatTime(time);

//         top.appendChild(name);
//         top.appendChild(duration);

//         const bar = document.createElement("div");
//         bar.className = "bar";

//         const fill = document.createElement("div");
//         fill.className = 'bar-fill';

//         const percentage = totalTime > 0
//             ? (time / totalTime) * 100
//             : 0;

//         fill.style.width = `${percentage}%`;

//         bar.appendChild(fill);
//         row.appendChild(top);
//         row.appendChild(bar);

//         sites.appendChild(row);
//     }
// }

// loadData();