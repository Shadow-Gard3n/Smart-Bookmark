document.addEventListener("DOMContentLoaded", () => {
  const bookmarkList = document.getElementById("bookmarkList");

  chrome.storage.local.get({ bookmarks: [] }, (data) => {
    const bookmarks = data.bookmarks;

    if (bookmarks.length === 0) {
      bookmarkList.innerHTML = "<p>No bookmarks saved yet.</p>";
      return;
    }

    bookmarks.forEach((bookmark) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = bookmark.url;
      link.textContent = bookmark.title || bookmark.url;
      link.target = "_blank";

      const date = document.createElement("span");
      date.textContent = ` (${new Date(bookmark.time).toLocaleString()})`;
      date.style.fontSize = "0.9em";
      date.style.color = "#555";

      li.appendChild(link);
      li.appendChild(date);
      bookmarkList.appendChild(li);
    });
  });
});
