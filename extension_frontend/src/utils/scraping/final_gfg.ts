export const gfgExtractor=():Record<string,string[]|string|{error:string}>=> {
  const extractContent = ():Record<string,string[]|string|{error:string}>=> {
    const contentMap:Record<string,string[]> = {};
    let currentHeading = "Introduction";
    contentMap[currentHeading] = [];

    const addContent = (text:string) => {
      if (text.trim()) {
        contentMap[currentHeading].push(text.trim());
      }
    };

    const titleElement = document.querySelector("h1");
    if (titleElement) {
      contentMap["Title"] = [titleElement.innerText.trim()];
    }
    console.log("Trying to find article content")
    const articleElement = document.querySelector("article");
    if (!articleElement) return { error: "Article content not found." };

    const processElement = (element:Element) => {
      const htmlElement=element as HTMLElement
      if (/^H[2-6]$/.test(htmlElement.tagName)) {
        currentHeading = htmlElement.innerText.trim();
        if (!contentMap[currentHeading]) {
          contentMap[currentHeading] = [];
        }
      } else if (element.tagName === "P") {
        addContent(htmlElement.innerText);
      } else if (element.tagName === "UL" || element.tagName === "OL") {
        const items:string[] = [];
        element.querySelectorAll("li").forEach((li, index) => {
          const itemText = li.innerText.trim();
          if (itemText) items.push(`${index + 1}. ${itemText}`);
        });
        if (items.length) addContent(items.join("\n"));
      } else if (element.tagName === "TABLE") {
        const tableRows = Array.from(htmlElement.querySelectorAll("tr"));
        const tableContent = tableRows
          .map((row) =>{
            if(row instanceof HTMLElement){
              return Array.from(row.querySelectorAll("th, td"))
              .map((cell) => cell instanceof HTMLElement?cell.innerText.trim():"")
              .join(" | ")
            }
          }
          )
          .join("\n");
        if (tableContent) addContent(`Table Data:\n${tableContent}`);
      }
    };

    articleElement.querySelectorAll("h2, h3, h4, p, ul, ol, table").forEach(processElement);
    console.log("This is the contentMap",contentMap)
    // Object.keys(contentMap).forEach((key) => {
    //   contentMap[key] = contentMap[key].join("\n\n").trim();
    // });
    // console.log("This is the joined contentMap: ",contentMap)
    return contentMap;
  };

  try {
    return extractContent();
  } catch (error) {
    console.error("Error extracting content:", error);
    return { error: "An error occurred while extracting content." };
  }
};
