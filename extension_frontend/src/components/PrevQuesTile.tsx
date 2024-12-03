import { AccordionItem } from "../type.ts";
import { MdDelete } from "react-icons/md";

const PrevQuesTile:React.FC<AccordionItem> = (props)=>{
  const toggleAccordion = (id:number|null) =>{
    props.openAccordianFunction(id);
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
              <MdDelete />
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