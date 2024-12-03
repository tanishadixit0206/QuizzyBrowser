// async function scrapStuff (){
//     console.log("func");
//     const elements=document.querySelectorAll('p,p, h1, h2, h3, h4, h5, h6, li');
//     const texts = Array.from(elements).map(element=>element.textContent);
//     const text:string=texts.join('\n');
//     console.log(text)

// }
//const [isBlurred,setIsBlurred] = useState<boolean>(false);
export default async function onClickScrap(){
   // setIsBlurred(!isBlurred)
   console.log("calleeeed")
    let [tab] = await chrome.tabs.query({active:true});
    chrome.scripting.executeScript({
      target:{tabId:tab.id!},
      func: ()=> {
        console.log("func");
    const elements=document.querySelectorAll('p,p, h1, h2, h3, h4, h5, h6, li');
    const texts = Array.from(elements).map(element=>element.textContent);
    const text:string=texts.join('\n');
    console.log(text)
        //scrapStuff();
        
      },
    })
    console.log("done")
  }