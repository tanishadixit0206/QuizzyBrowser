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