export interface LanguageModelSession{
    prompt(input:string):Promise<string>;
}

export interface LanguageModelCapabilities{
    supportsStreaming:boolean;
    supportsBatchProcessing:boolean;
}

export interface Capabilities{
    available: string;
    defaultTemperature:number;
    defaultTopK:number;
    maxTopK:number;
}

export interface LanguageModel{
    create(config?:{systemPrompt:string}):Promise<LanguageModelSession>;
    capabilities():Promise<Capabilities>;
}

export interface AIOriginTrial{
    languageModel:LanguageModel;
}

export interface Chrome{
    aiOriginTrial:AIOriginTrial;
}

export declare const chrome:Chrome;

export interface SummarizerCapabilities{
    available:'no'|'readily'|'download';
}

export interface Summarizer{
    ready:Promise<void>;
    summarize:(text:string)=>Promise<string>;
}

export interface SummarizerAPI{
    capabilities():Promise<SummarizerCapabilities>;
    create(options?:SummarizerOptions):Promise<Summarizer>;
}   

export interface SummarizerOptions{
    sharedContext:string;
    type:string;
    format:string;
    length:string;
}

export interface TranslationCapabilities{
    canTranslate(
        options:{
            sourceLanguage:string;
            targetLanguage:string;
        }
    ):Promise<'no'|'readily'|'after-download'>;
    createTranslator(
        options:{
        sourceLanguage:string;
        targetLanguage:string;
    }
):Promise<Translator>;
}

export interface Translator{
    translate(text:string):Promise<string>;
}

export interface SelfWithTranslation extends Window{
    translation?:TranslationCapabilities;
}

declare global {
    interface Window{
        ai:{
            summarizer:SummarizerAPI;
        }
    }
    // declare const self:Window&typeof globalThis;
}


export type AccordionItem ={
    x:number|null;
    id:number;
    question:string;
    answer:string;
    openAccordianFunction:(x:number|null)=>void
  }
  
export type AccordianDataType = {
    id:number;
    question:string;
    answer:string;
  }
  
export type ContentMap={
    [heading:string]:string[];
} 