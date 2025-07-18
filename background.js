chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveBookmark") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const bookmark = {
        url: tab.url,
        title: tab.title,
        time: new Date().toISOString(),
        note: "",
        usageCount: 0
      };

      chrome.storage.local.get({ bookmarks: [] }, (data) => {
        const bookmarks = data.bookmarks;
        bookmarks.push(bookmark);
        chrome.storage.local.set({ bookmarks }, () => {
          console.log("Bookmark saved:", bookmark);
          sendResponse({ success: true });
        });
      });
    });
    return true;
  }
});
