import db from "../Database/dataworld.js";

export const searchVideos = async (req,res)=>{
    try{
        const query = req.query.serach_query;
        console.log("Search query is :~ "+query);
        const result = await db.query(`SELECT vim_users.name, vim_users.img, videos.id, videos.title,videos.views,videos.timestamps,videos.thumbnail  FROM videos JOIN vim_users ON vim_users.email = videos.userid WHERE title ILIKE '%${query}%'`);
        console.log(result.rows);
        res.status(200).json(result.rows)
    }catch(err){
        console.log(err.message);
    }
}
export const searchMovies = async (req,res)=>{
    try{
        const query = req.query.serach_query;
        console.log("Search query is :~ "+query);
        const result = await db.query(`SELECT * FROM movies WHERE title ILIKE '%${query}%'`);
        console.log(result.rows);
        res.status(200).json(result.rows)
    }catch(err){
        console.log(err.message);
    }
}