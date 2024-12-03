(()=>{
    const body = document.querySelector('body');
    if (body) {
        chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
            if(message.type==="BLUR"){
                if(message.data){
                    body.style.opacity = '0.05';
                }else{
                    body.style.opacity='1';
                }
            }
        })
    }else{
        console.log("Body not found")
    }
})()