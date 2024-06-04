const Notification = ({ message, bad }) => {
    if (message === null) {
      return null
    }
  
    if(!bad){
        return (
            <div className="notification" id="good">
              {message}
            </div>
          ) 
    }else{
        return (
            <div className="notification">
              {message}
            </div>
          )
    }
    
  }
  
  export default Notification