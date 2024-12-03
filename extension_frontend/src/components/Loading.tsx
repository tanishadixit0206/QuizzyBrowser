import React from "react"
import "../styles/Loading.css"
interface LoadingProps{
    loadingText:string
}

const Loading: React.FC<LoadingProps>= ({loadingText}) => {
  return (
    <div className="MainLandingDiv">
  <h1 className="landingPageHeading">
      Loading : {loadingText}
    </h1>
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
    
  </div>
  )
}

export default Loading