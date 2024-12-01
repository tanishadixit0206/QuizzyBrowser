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
      if (!articleElement) return { error: "Article content not found." };
  
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
  
      Object.keys(contentMap).forEach((key) => {
        contentMap[key] = contentMap[key].join("\n\n").trim();
      });
  
      return contentMap;
    };
  
    try {
      return extractContent();
    } catch (error) {
      console.error("Error extracting content:", error);
      return { error: "An error occurred while extracting content." };
    }
  })();
  