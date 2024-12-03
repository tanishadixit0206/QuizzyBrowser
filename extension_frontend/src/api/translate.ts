import { SelfWithTranslation } from "../type";

export default async function translate(text:string,code:string){
    const selfTranslation=self as SelfWithTranslation;
    if('translation' in selfTranslation){
        const CanTranslate=await selfTranslation.translation?.canTranslate({
            sourceLanguage:'en',
            targetLanguage: code,
        });
        if(CanTranslate==='readily'){
            const translator =await selfTranslation.translation?.createTranslator({
                sourceLanguage:'en',
                targetLanguage:code,
            })
            return await translator?.translate(text);
        }{
            console.log("Cannot translate")
        }
    }else{
        console.log('translation not in SelfTranslation')
    }
}