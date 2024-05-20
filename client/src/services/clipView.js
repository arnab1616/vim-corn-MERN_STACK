import axios from "axios";

export const increaseClipVews = async (id) =>{
    try{
      const clipID = parseInt(id)
      const views = await axios.put(`http://localhost:3200/api/views/clips/${clipID}`)
      console.log("views");
      console.log(views.data);
    }catch(err){
      console.log(err.message);
      alert(err.message)
    }
  }