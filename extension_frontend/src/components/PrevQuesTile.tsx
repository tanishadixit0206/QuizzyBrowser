import { AccordionItem } from "../type.ts";
import { MdDelete } from "react-icons/md";

const PrevQuesTile:React.FC<AccordionItem> = (props)=>{
  const toggleAccordion = (id:number|null) =>{
    props.openAccordianFunction(id);
  }

  const deleteBookmarkById = (idToDelete: number) => {
    chrome.storage.local.get(["saved_questions"]).then((result) => {
      const current_saved: {[key:string]:string|number}[] = result["saved_questions"] || [];
      
      if (!Array.isArray(current_saved)) {
        console.error("Saved questions is not an array");
        return;
      }
      const updated_saved = current_saved.filter(item => item['id'] !== idToDelete);
      const reindexed_saved = updated_saved.map((item, index) => ({
        ...item,
        'id': index + 1
      }));
      chrome.storage.local.set({"saved_questions": reindexed_saved}).then(() => {
        console.log(`Bookmark with ID ${idToDelete} deleted successfully`);
      }).catch((error) => {
        console.error("Error saving updated bookmarks:", error);
      });
      chrome.storage.local.get(["saved_questions"]).then((result)=>{
        let current_saved=result.saved_questions as AccordianDataType[];
        console.log("called")
        console.log(`result hai ${result.saved_questions}`)
        props.updateAccordianData(current_saved)
     })
    }).catch((error) => {
      console.error("Error retrieving bookmarks:", error);
    });
  }
  return(<>
  <div className="accordion-container">
    
          <div 
            key={props.id} 
            className="accordion-item"
          >
            <button 
              onClick={() => toggleAccordion(props.id)}
              className={`accordion-header ${props.x === props.id ? 'active' : ''}`}
            >
              <span className="accordion-question">{props.question}</span>
              <MdDelete onClick={()=>{deleteBookmarkById(props.id)}} />
              <span className="accordion-icon">
                {props.x === props.id ? '▼' : '▶'}
              </span>
            </button>
            {props.x === props.id && (
              <div className="accordion-content">
                {props.answer}
              </div>
            )}  
          </div>
      </div>
  </>)
}
export default PrevQuesTile;