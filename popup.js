document.addEventListener("DOMContentLoaded", () => {
    const snippetList = document.getElementById("snippetList");
    chrome.storage.local.get({ snippets: [] }, (result) => {
        result.snippets.forEach((snippet, index) => { 
            const li = document.createElement("li");
            li.textContent = snippet.substring(0, 50) + "...";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.addEventListener("click", () => {
                chrome.storage.local.get({ snippets: [] }, (res) => {
                    const updatedSnippets = res.snippets;
                    updatedSnippets.splice(index, 1); 
                    chrome.storage.local.set({ snippets: updatedSnippets }, () => {
                        location.reload();
                    });
                });
            });

            li.appendChild(deleteBtn);
            snippetList.appendChild(li);
        });
    });
});
