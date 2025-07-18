chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveSnippet",
    title: "Save Snippet",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveSnippet") {
    const selectedText = info.selectionText;
    chrome.storage.local.get({ snippets: [] }, (result) => {
      const updatedSnippets = result.snippets;
      updatedSnippets.push(selectedText);
      chrome.storage.local.set({ snippets: updatedSnippets }, () => {
        console.log("Snippet saved!");
      });
    });
  }
});
