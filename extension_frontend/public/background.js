let data=null;
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if(message.type==="GFG_CONTENT_EXTRACTED"||message.type==="MDN_CONTENT_EXTRACTED"){
        data=message.data
        console.log("Message received in background script: ",message);

    }else if(message.type==='GET_DATA'){
        sendResponse({data:data});
    }
    return true;
})

chrome.runtime.onConnect.addListener((port)=>{
    if(port.name==="popup"){
        console.log("Popup opened");
        port.onDisconnect.addListener(()=>{
            chrome.tabs.query({
                active:true,currentWindow:true
            },(tabs)=>{
                if(tabs[0].id){
                    chrome.scripting.executeScript({
                        target:{tabId:tabs[0].id},
                        function:()=>{
                            document.body.style.opacity="1";
                        }
                    })
                }
            })
        })
    }
})