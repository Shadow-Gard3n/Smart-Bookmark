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

      // link
      const link = document.createElement("a");
      link.href = bookmark.url;
      link.textContent = bookmark.title || bookmark.url;
      link.target = "_blank";

      // date
      const date = document.createElement("span");
      date.textContent = ` (${new Date(bookmark.time).toLocaleString()})`;
      date.style.fontSize = "0.9em";
      date.style.color = "#555";

      // note 
      const noteInput = document.createElement("input");
      noteInput.type = "text";
      noteInput.placeholder = "Add a note...";
      noteInput.value = bookmark.note || "";
      noteInput.style.marginLeft = "10px";
      noteInput.style.width = "200px";

      // save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.title = "Save note";
      saveButton.style.marginLeft = "5px";
      saveButton.addEventListener("click", () => {
          chrome.storage.local.get({ bookmarks: [] }, (data) => {
              const bookmarks = data.bookmarks;
              const targetIndex = bookmarks.findIndex(b => b.url === bookmark.url);
              if (targetIndex !== -1) {
                  bookmarks[targetIndex].note = noteInput.value;
                  chrome.storage.local.set({ bookmarks }, () => {
                      console.log("Note saved!");
                  });
              }
          });
      });



      // remove button
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.title = "Remove bookmark";
      removeButton.style.marginLeft = "5px";
      removeButton.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this bookmark?")) {
            chrome.storage.local.get({ bookmarks: [] }, (data) => {
              let bookmarks = data.bookmarks;
              bookmarks = bookmarks.filter(b => b.url !== bookmark.url);
              chrome.storage.local.set({ bookmarks }, () => {
                location.reload();
              });
            });
          }
      });


      li.appendChild(link);
      li.appendChild(date);
      li.appendChild(noteInput);
      li.appendChild(saveButton);
      li.appendChild(removeButton);

      bookmarkList.appendChild(li);
    });
  });
});
