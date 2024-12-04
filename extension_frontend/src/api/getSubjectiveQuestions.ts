// import { chrome } from "../type.ts";
interface LanguageModelSession{
    prompt(input:string):Promise<string>;
}

// interface LanguageModelCapabilities{
//     supportsStreaming:boolean;
//     supportsBatchProcessing:boolean;
// }

interface Capabilities{
    available: string;
    defaultTemperature:number;
    defaultTopK:number;
    maxTopK:number;
}

interface LanguageModel{
    create(config?:{systemPrompt:string}):Promise<LanguageModelSession>;
    capabilities():Promise<Capabilities>;
}

interface AIOriginTrial{
    languageModel:LanguageModel;
}

interface Chrome{
    aiOriginTrial:AIOriginTrial;
}

declare const chrome:Chrome;

export default async function getSubjectiveQuestions(text:string){
    if(chrome){
        console.log(chrome);
        if(chrome.aiOriginTrial){
            console.log(chrome.aiOriginTrial);
            const {available}=await chrome.aiOriginTrial.languageModel.capabilities();

    if(available!=='no'){
        console.log("Available:",available);
        const session=await chrome.aiOriginTrial.languageModel.create();
        console.log("session",session);
        const result=await session.prompt(`Read the following text - ${text}


Now generate 2 subjective questions from the above outputting per question only the question. Don't make anything bold. Don't use new line characters.Start questions with 1. and 2. .`)
// console.log("Result:",result);
        return result;
    }else{
        console.log("Not available")
    }
        }else{
            console.log("chrome.aiOriginTrial is undefined")
        }
        
    }else{
        console.log("chrome is undefined")
    }
    
}

