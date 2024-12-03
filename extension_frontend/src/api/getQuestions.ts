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

export default async function getQuestions(text:string){
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


Now generate 2 objective questions from the above outputting per question, the question itself, the four options, the correct answer and the explanation. You must output these 7 elements per question. Don't make anything bold. Don't use new line characters.Start questions with 1. and 2. Start options with a) or b) or c) or d). Give correct answer as Correct Answer: a) Insert the correct answer to the question here or b) Insert the correct answer to the question here or c) Insert the correct answer to the question here or d) Insert the correct answer to the question here. Give the correct answer in the same format as the options given above. Start explanation with Explanation: .`)
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

// const result = getQuestions(`JavaScript Hoisting is the behavior where the interpreter moves function and variable declarations to the top of their respective scope before executing the code. This allows variables to be accessed before declaration, aiding in more flexible coding practices and avoiding “undefined” errors during execution.

// What is Hoisting in JavaScript?
// Hoisting is the default behavior in JavaScript where variable and function declarations are moved to the top of their respective scopes during the compilation phase. This guarantees that regardless of where these declarations appear within a scope, they can be accessed throughout that scope.

// Features of Hoisting
// Declarations are hoisted, not initializations.
// Allows calling functions before their declarations.
// All variable and function declarations are processed before any code execution.
// Undeclared variables are implicitly created as global variables when assigned a value.
// `)
// console.log(result)
