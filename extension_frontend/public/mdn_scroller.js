(() => {
    const scrollToHeading = (heading) => {
      const articleElement = document.querySelector("article");
  
      if (!articleElement) {
        console.error("Article content not found.");
        return;
      }
  
      const headingElement = Array.from(
        articleElement.querySelectorAll("h2, h3, h4")
      ).find((el) => el.innerText.trim() === heading);
  
      if (headingElement) {
        headingElement.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log(`Scrolled to heading: "${heading}"`);
      } else {
        console.error(`Heading "${heading}" not found.`);
      }
    };
    scrollToHeading("Cookbook"); // yaha rakho heading ko.....
  })();