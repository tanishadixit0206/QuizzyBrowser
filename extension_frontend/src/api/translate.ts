import { SelfWithTranslation } from "../type";

export default async function translate(text:string){
    const selfTranslation=self as SelfWithTranslation;
    if('translation' in selfTranslation){
        const CanTranslate=await selfTranslation.translation?.canTranslate({
            sourceLanguage:'en',
            targetLanguage:'fr',
        });
        if(CanTranslate==='readily'){
            const translator =await selfTranslation.translation?.createTranslator({
                sourceLanguage:'en',
                targetLanguage:'fr',
            })
            await translator?.translate(text);
        }
    }
}