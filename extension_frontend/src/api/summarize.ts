export default async function summarize(text:string){
    const options={
        sharedContext:'',
        type:'key-points',
        format:'markdown',
        length:'medium',
    };
    
    const available=(await self.ai.summarizer.capabilities()).available;
    let summarizer;
    
    if(available==='no'){
        return
    }
    else if(available==='readily'){
        summarizer=await self.ai.summarizer.create(options);
    }else{
        summarizer=await self.ai.summarizer.create(options);
    }
    await summarizer.ready;

    const summary=await summarizer.summarize(text)
    return summary;
}

