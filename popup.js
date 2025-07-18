document.addEventListener("DOMContentLoaded", () => {
  const snippetList = document.getElementById("snippetList");
  chrome.storage.local.get({ snippets: [] }, (result) => {
    result.snippets.forEach(snippet => {
      const li = document.createElement("li");
      li.textContent = snippet.substring(0, 50) + "...";
      snippetList.appendChild(li);
    });
  });
});
