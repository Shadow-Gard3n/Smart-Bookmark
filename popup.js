// save bookmarks
document.getElementById("saveButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "saveBookmark" }, (response) => {
    if (response && response.success) {
        const notification = document.getElementById("notification");
        notification.style.display = "block";
        notification.style.opacity = "1";

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.style.display = "none";
                location.reload();
            }, 500);
        }, 2000);
    }
  });
});

// view bookmarks 
document.getElementById("viewButton").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("bookmark.html") });
});

// top bookmarks
document.addEventListener("DOMContentLoaded", () => {
  const latestList = document.getElementById("latestBookmarks");
  const mostUsedList = document.getElementById("mostUsedBookmarks");

  chrome.storage.local.get({ bookmarks: [] }, (data) => {
    const bookmarks = data.bookmarks;

    if (bookmarks.length === 0) {
      latestList.innerHTML = "<li>No bookmarks yet.</li>";
      mostUsedList.innerHTML = "<li>No bookmarks yet.</li>";
      return;
    }

    // sort for latest
    const seenUrls = new Set();
    const latestBookmarks = [];

    [...bookmarks]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .forEach((bookmark) => {
        if (!seenUrls.has(bookmark.url) && latestBookmarks.length < 3) {
          seenUrls.add(bookmark.url);
          latestBookmarks.push(bookmark);
        }
      });

    latestBookmarks.forEach((bookmark, index) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = bookmark.url;
      link.textContent = bookmark.title || bookmark.url;
      link.target = "_blank";
      link.addEventListener("click", () => incrementUsage(index));
      li.appendChild(link);
      latestList.appendChild(li);
    });

    // sort for most used
    const mostUsedBookmarks = [...bookmarks]
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 3);

    mostUsedBookmarks.forEach((bookmark, index) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = bookmark.url;
      link.textContent = `${bookmark.title || bookmark.url} (${bookmark.usageCount || 0})`;
      link.target = "_blank";
      link.addEventListener("click", () => incrementUsage(index, true));
      li.appendChild(link);
      mostUsedList.appendChild(li);
    });

    function incrementUsage(index, isMostUsed = false) {
      chrome.storage.local.get({ bookmarks: [] }, (data) => {
        const bookmarks = data.bookmarks;
        const targetList = isMostUsed
          ? [...bookmarks].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
          : [...bookmarks].sort((a, b) => new Date(b.time) - new Date(a.time));
        const targetBookmark = targetList[index];
        const originalIndex = bookmarks.findIndex(
          (b) => b.url === targetBookmark.url && b.time === targetBookmark.time
        );
        bookmarks[originalIndex].usageCount = (bookmarks[originalIndex].usageCount || 0) + 1;
        chrome.storage.local.set({ bookmarks });
      });
    }
  });
});

