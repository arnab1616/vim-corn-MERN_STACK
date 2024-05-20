import db from "../Database/dataworld.js"

export const postComments = async (req, res) =>{
    try{
        console.log(req.body)
        const find = await db.query('SELECT * FROM videos WHERE id =($1)', [req.params.videoid]);
        console.log(find.rows[0]);
        const response = await db.query('INSERT INTO video_comments (videoid,video_userid,userid,comment,timestamps) VALUES($1,$2,$3,$4,$5) RETURNING *',[
            req.params.videoid, find.rows[0].userid, req.body.currUserId, req.body.comment, Date.now() 
        ])
        console.log(response.rows);
        res.status(200).json(response.rows)
    } catch(err){
        console.log(err.message)
    }
}
export const getComments = async (req, res) =>{
    try{
        console.log("All comments of " +req.params.videoid)
        const find = await db.query('SELECT vim_users.username, vim_users.img, video_comments.userid, video_comments.comment,video_comments.timestamps FROM video_comments JOIN vim_users ON vim_users.email=video_comments.userid WHERE video_comments.videoid =($1)', [req.params.videoid]);
        console.log(find.rows);
        res.status(200).json(find.rows)
    } catch(err){
        console.log(err.message)
    }
}

export const postMovieComments = async (req, res) =>{
    try{
        console.log(req.body)
        const response = await db.query('INSERT INTO movie_comments (movieid,userid,username,comment,timestamps) VALUES($1,$2,$3,$4,$5) RETURNING *',[
            req.params.movieid, req.body.email,req.body.name, req.body.comment, Date.now() 
        ])
        console.log(response.rows);
        res.status(200).json(response.rows)
    } catch(err){
        console.log(err.message)
    }
}
export const getMovieComments = async (req, res) =>{
    try{
        console.log("All comments of " +req.params.movieid)
        const find = await db.query('SELECT vim_users.img, movie_comments.userid,movie_comments.username, movie_comments.comment,movie_comments.timestamps FROM movie_comments JOIN vim_users ON vim_users.email=movie_comments.userid WHERE movie_comments.movieid =($1)', [req.params.movieid]);
        console.log(find.rows);
        res.status(200).json(find.rows)
    } catch(err){
        console.log(err.message)
    }
}