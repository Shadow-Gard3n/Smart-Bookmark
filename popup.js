// Save bookmarks
document.getElementById("saveButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "saveBookmark" }, (response) => {
    if (response && response.success) {
      alert("Bookmark saved successfully!");
    }
  });
});

// view bookmarks 
document.getElementById("viewButton").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("bookmark.html") });
});
