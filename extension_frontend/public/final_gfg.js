(() => {
  const extractContent = () => {
    const contentMap = {};
    let currentHeading = "Introduction";
    contentMap[currentHeading] = [];

    const addContent = (text) => {
      if (text.trim()) {
        contentMap[currentHeading].push(text.trim());
      }
    };

    const titleElement = document.querySelector("h1");
    if (titleElement) {
      contentMap["Title"] = [titleElement.innerText.trim()];
    }

    const articleElement = document.querySelector("article");
    if (!articleElement){
      console.log("Article content not found.")
      return { error: "Article content not found." };
    }

    const processElement = (element) => {
      if (/^H[2-6]$/.test(element.tagName)) {
        currentHeading = element.innerText.trim();
        if (!contentMap[currentHeading]) {
          contentMap[currentHeading] = [];
        }
      } else if (element.tagName === "P") {
        addContent(element.innerText);
      } else if (element.tagName === "UL" || element.tagName === "OL") {
        const items = [];
        element.querySelectorAll("li").forEach((li, index) => {
          const itemText = li.innerText.trim();
          if (itemText) items.push(`${index + 1}. ${itemText}`);
        });
        if (items.length) addContent(items.join("\n"));
      } else if (element.tagName === "TABLE") {
        const tableRows = Array.from(element.querySelectorAll("tr"));
        const tableContent = tableRows
          .map((row) =>
            Array.from(row.querySelectorAll("th, td"))
              .map((cell) => cell.innerText.trim())
              .join(" | ")
          )
          .join("\n");
        if (tableContent) addContent(`Table Data:\n${tableContent}`);
      }
    };

    articleElement.querySelectorAll("h2, h3, h4, p, ul, ol, table").forEach(processElement);
    console.log("This is the contentMap",contentMap)
    Object.keys(contentMap).forEach((key) => {
      contentMap[key] = contentMap[key].join("\n\n").trim();
    });
    console.log("This is the joined contentMap: ",contentMap)
    return contentMap;
  };

 function runExtraction() {
        try {
            const content = extractContent();
            console.log("Content extraction completed:", content);
            chrome.runtime.sendMessage({ type: "CONTENT_EXTRACTED", data: content });
        } catch (error) {
            console.error("Error extracting content:", error);
            chrome.runtime.sendMessage({ type: "ERROR", error: error.message });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runExtraction);
    } else {
        runExtraction();
    }
})();
