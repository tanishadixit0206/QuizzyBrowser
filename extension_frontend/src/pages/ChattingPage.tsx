import { useNavigate } from "react-router-dom";
import {  useState } from 'react';
// let text="";
// async function fetchData(){    
//     await chrome.storage.local.get("scraped").then((result)=>{
//     text=result.scraped;
// })}
// useEffect(()=>{
//     fetchData();
//     console.log(`useEffect is ${text}`)

// },[]);
const ChattingPage:React.FC=()=>{
    const navigate = useNavigate();
    const [message,setMessage]=useState("");
    const submitFunc=(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        setMessage("");
    }
return(
    <>
    <div className="chatHeadingDiv">
        <h1 className="previousQuestionsHeading">Chat with the Page</h1>
        <svg onClick={()=>{
          navigate('/');
        }} className="home_pic" xmlns="http://www.w3.org/2000/svg"  viewBox="0,0,256,256" width="48px" height="48px" fill-rule="nonzero"><g fill="#8a2be2" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><g transform="scale(5.33333,5.33333)"><path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z"></path></g></g></svg>
        </div>
        <div className="scrollWindow">  
        {

        }
        </div>
        <div className="msg-footer">
            <form 
            className="chatForm"
            onSubmit={submitFunc}>
                <input
                type='text'
                className="chat"
                placeholder='Chat with the Page'
                value={message}
                onChange={(event)=>{setMessage(event.target.value)}}
                />

            </form>
        </div>

    </>
)
}
export default ChattingPage;