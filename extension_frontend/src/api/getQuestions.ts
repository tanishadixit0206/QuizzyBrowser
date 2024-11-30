import { chrome } from "../type";

export default async function getQuestions(){
    const {available} =await chrome.aiOriginTrial.languageModel.capabilities();

    if(available!=='no'){
        const session=await chrome.aiOriginTrial.languageModel.create()
        const result=await session.prompt("")
        return result;
    }
}

