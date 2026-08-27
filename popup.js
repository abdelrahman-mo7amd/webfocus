console.log("WebFocus popup is running!");

const categoryToggle = document.getElementById('categoryToggle');
const categoriesContainer = document.getElementById("categories");
const categoryArrow = document.getElementById("categoryArrow");

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
    const categoryTimes = calculateCategoryTimes(sites);
    console.log("Category times:", categoryTimes);
    htmlCategories(categoryTimes);
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
                <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" alt="${domain}">
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


function calculateCategoryTimes(sites) {
    const categories = {};

    for (const [domain, time] of sites) {
        const category = getCategory(domain);

        if (!categories[category]) {
            categories[category] = 0;
        }

        categories[category] += time;
    }

    return categories;
}

function htmlCategories(categoryTimes) {
    const container = document.getElementById("categories");

    container.innerHTML = "";

    const entries = Object.entries(categoryTimes)
        .filter(([_, time]) => time > 0)
        .sort((a,b) => b[1] - a[1]);

    if (entries.length === 0){
        return;
    }

    const maxTime = entries[0][1];

    entries.forEach(([category, time]) => {
        const percentage = (time / maxTime) * 100;

        const item = document.createElement("div");

        item.className='category';
        item.innerHTML = `
            <div class="category-icon">
                ${getCategoryIcon(category)}
            </div>


            <div class="category-info">
                <div class="category-name">
                    ${getCategoryName(category)}
                </div>

                <div class="bar-container">
                    <div class="bar" style="width: ${percentage}%">
                    </div>
                </div>
            </div>

            <div class="category-time">
                ${formatTime(time)}
            </div>
        `;

        container.appendChild(item);
    });
}

categoryToggle.addEventListener("click", ()=> {
    const isOpen = categoriesContainer.style.display === "flex";

    if (isOpen) {
        categoriesContainer.style.display = "none";

        categoryArrow.style.transform = "rotate(0deg)";
    } else {
        categoriesContainer.style.display = "flex";
        categoryArrow.style.transform = "rotate(180deg)";
    }
});