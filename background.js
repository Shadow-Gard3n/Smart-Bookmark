chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveBookmark") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const bookmark = {
                url: activeTab.url,
                title: activeTab.title,
                time: new Date().toISOString(),
                usageCount: 0,
                note: ""
            };

            chrome.storage.local.get({ bookmarks: [] }, (data) => {
                let bookmarks = data.bookmarks;

                const index = bookmarks.findIndex(b => (b.url) === (bookmark.url));

                if (index !== -1) {
                    bookmarks[index].time = bookmark.time;
                    bookmarks[index].title = bookmark.title;
                } else {
                    bookmarks.push(bookmark);
                }

                
                chrome.storage.local.set({ bookmarks }, () => {
                    sendResponse({ success: true });
                });
            });
        });

        return true; 
    }
});
