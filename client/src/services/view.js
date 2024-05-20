import axios from "axios";

export const increaseVews = async (id) =>{
    try{
      const videoID = parseInt(id)
      const views = await axios.put(`http://localhost:3200/api/views/video/${videoID}`)
      console.log("views");
      console.log(views.data);
    }catch(err){
      console.log(err.message);
    }
  }