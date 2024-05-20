import db from "../Database/dataworld.js"

export const suggestMovie = async(req,res) =>{
    try{
        console.log('suggest movie');
        const movie = req.body;
        console.log(req.body)
        console.log(req.params.userid)
        const result = await db.query('INSERT INTO movies (userid,title,descriptions,movie_trailer,genre,director,actors,country,post_updated,duration,quality,release_at,thumbnail,language,download_link,full_movie) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',[
            req.params.userid,
            movie.title,
            movie.description,
            movie.movie_trailer,
            movie.genre,
            movie.director,
            movie.actors,
            movie.country,
            Date.now(),
            movie.duration || 'No movie description available',
            movie.quality,
            movie.release_at,
            movie.thumbnail,
            movie.language,
            movie.download_link,
            movie.youtube_link || null
        ])
        console.log(result.rows);
        res.status(200).json({message:'ok'});
    }catch(err){
        console.log(err.message);
    }
}
export const getMovies = async(req,res)=>{
    try{
        const result = await db.query('SELECT * FROM movies')
        console.log(result.rows)
        res.status(200).json(result.rows)
    } catch(err){
        console.log(err.message)
    }
}
export const getMovieById = async(req,res)=>{
    try{
        const result = await db.query('SELECT * FROM movies WHERE id =($1)',[req.params.id])
        console.log(result.rows[0])
        res.status(200).json(result.rows[0])
    } catch(err){
        console.log(err.message)
    }
}