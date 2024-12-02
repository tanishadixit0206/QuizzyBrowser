
export type AccordionItem ={
  x:number|null;
  id:number;
  question:string;
  answer:string;
  openAccordianFunction:(x:number|null)=>void
  updateAccordianData:(updatedQuestions:AccordianDataType[])=>void
  
}

export type AccordianDataType = {
  id:number;
  question:string;
  answer:string;
}

