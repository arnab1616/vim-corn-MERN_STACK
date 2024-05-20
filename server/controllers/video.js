
import db from "../Database/dataworld.js";

//Upload new video
export const newVideo = async(req,res) =>{
    try{
        const user = req.params.email;
        const vidSrc = req.body;
        const newVideo = await db.query('INSERT INTO videos (userid, title, description, thumbnail, video_url, views, likes, dislikes, timestamps) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [user, vidSrc.title, vidSrc.description, vidSrc.thumbnail, vidSrc.video, 0, 0, 0, Date.now()]
        );
        console.log(req.body);
        res.status(200).json(newVideo.rows[0]);
        // res.status(200).json({message:'ok'});
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

// get current user saved videos
export const getUserSavedVideos = async(req,res) =>{
    try{
        const result = await db.query(
            'SELECT videos.id, videos.title,videos.views,videos.timestamps,videos.thumbnail FROM videos JOIN saved_videos ON saved_videos.videoid = videos.id WHERE saved_videos.userid = ($1) AND saved_videos.issaved =($2)'
            ,[req.params.userid,true])
        console.log(result.rows)
        res.status(200).json(result.rows)
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

// get current user liked videos
export const getUserLikedVideos = async(req,res) =>{
    console.log("Liked videos")
    try{
        const result = await db.query(
            'SELECT videos.id, videos.title,videos.views,videos.timestamps,videos.thumbnail FROM videos JOIN video_handle ON video_handle.videoid = videos.id WHERE video_handle.userid = ($1) AND video_handle.isliked =($2)'
            ,[req.params.userid,true])
        console.log(result.rows)
        res.status(200).json(result.rows)
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//get all videos
export const getVideos = async(req,res) =>{
    try{
        const allVideo = await db.query('SELECT vim_users.name, vim_users.img, videos.id, videos.title,videos.views,videos.timestamps,videos.thumbnail  FROM videos JOIN vim_users ON vim_users.email = videos.userid ');
        res.status(200).json(allVideo.rows);
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//get all trending videos
export const getTrendingVideos = async(req,res) =>{
    try{
        console.log("Trending")
        const allVideo = await db.query('SELECT vim_users.name, vim_users.img, videos.id, videos.title,videos.views,videos.timestamps,videos.thumbnail  FROM videos JOIN vim_users ON vim_users.email = videos.userid WHERE videos.views >= ($1)',[60]);
        console.log(allVideo.rows)
        res.status(200).json(allVideo.rows);
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//saved the perticular video by videoId
export const saveVideo = async(req,res) =>{
    try{
        console.log("req video id "+ req.params.videoid)
        const config = req.body;
        console.log(config)
        const allVideo = await db.query('SELECT * FROM saved_videos WHERE videoid = ($1) AND userid =($2)',[req.params.videoid, config.userid]);
        if(allVideo.rows.length){
            if(allVideo.rows[0].issaved){
                console.log("unsave")
                const a = await db.query('UPDATE saved_videos SET issaved=($1) WHERE videoid=($2) AND userid =($3) RETURNING *',[false,req.params.videoid, config.userid]);
                console.log(a.rows)
                res.status(201).json(a.rows[0])
            }else{
                console.log("Save")
                const a = await db.query('UPDATE saved_videos SET issaved=($1) WHERE videoid = ($2) AND userid =($3) RETURNING *',[true,req.params.videoid, config.userid]);
                console.log(a.rows)
                res.status(201).json(a.rows[0])
            }
        } else{
            const a = await db.query('INSERT INTO saved_videos (videoid,video_userid,userid,issaved) VALUES($1,$2,$3,$4) RETURNING *',
            [req.params.videoid, config.video_userid, config.userid, true]);
            console.log(a.rows);
            res.status(200).json(a.rows[0]);
        }
        
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

// get is the video is saved or not
export const getSaveVideos = async(req,res)=>{
    try{
        console.log("req video id "+ req.query.videoid)
        const config = req.query;
        console.log(config)
        const issaved = await db.query('SELECT issaved FROM saved_videos WHERE videoid = ($1) AND userid =($2)',[config.videoid, config.userid])
        if(issaved.rowCount){
            res.json(issaved.rows[0])
        }else{
            res.json({issaved: false});
        }
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//get current rrequest user uploaded videos
export const getUserVideos = async(req,res) =>{
    try{
        const userid = req.params.userid
        const allVideo = await db.query('SELECT * FROM videos WHERE userid = ($1)',[userid]);
        res.status(200).json(allVideo.rows);

    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//get all recomended videos
export const getRecomendedVideos = async(req,res) =>{
    try{
        console.log("recomended videos "+ req.params.videoid)
        const allVideo = await db.query('SELECT vim_users.name, vim_users.img, videos.id, videos.title,videos.views,videos.timestamps,videos.thumbnail  FROM videos JOIN vim_users ON vim_users.email = videos.userid WHERE videos.id != ($1)',[req.params.videoid]);
        console.log(allVideo.rows);
        res.status(200).json(allVideo.rows);
    }catch(err){
        console.log(err.message);
    }
}

//play the video
export const playVideo = async(req,res) =>{
    try{
        const id = parseInt(req.params.id)
        const reqVideo = await db.query('SELECT vim_users.name,vim_users.subscriber, vim_users.img, videos.id,videos.userid, videos.title,videos.description,videos.views,videos.timestamps,videos.video_url,videos.likes,videos.dislikes FROM videos JOIN vim_users ON vim_users.email = videos.userid WHERE videos.id=($1)',[id]);
        // console.log(allVideo.rows)
        // const reqVideo = await db.query('SELECT * FROM videos WHERE id = $1',[id]);
        res.status(200).json(reqVideo.rows[0]);
        console.log(reqVideo.rows[0])
        // res.status(200).json({message:'ok'});
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//increase the views
export const views = async(req,res) =>{
    try{
        const id = parseInt(req.params.id)
        const reqVideo = await db.query('SELECT views FROM videos WHERE id=($1)',[id]);
        const views = reqVideo.rows[0].views;
        const countViews = await db.query('UPDATE videos SET views = ($1) WHERE id = ($2) RETURNING *',[views+1, id])
        res.status(200).json(countViews.command[0]);
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//like the video
export const likeVideo = async(req,res) =>{
    try{
        const id = parseInt(req.params.id)
        const reqVideo = await db.query('SELECT likes FROM videos WHERE id=($1)',[id]);
        let countLike = parseInt(reqVideo.rows[0].likes)
        console.log(reqVideo.rows[0].likes);
        const video_handle = await db.query('SELECT * FROM video_handle WHERE videoid=($1)',[id]);
        const findUser = video_handle.rows.find((elm)=> elm.userid === req.body.email);
        console.log(findUser)
        // console.log(video_handle.rows)
        if(video_handle.rows.length >= 0 && !findUser){
            console.log("New user likes")
            await db.query('INSERT INTO video_handle (videoid, userid, isliked) VALUES($1,$2,$3) RETURNING * ',
            [id, req.body.email,true,])
            countLike +=1
            console.log("Total like of videoID " + id + " is " + countLike)
            await db.query('UPDATE videos SET likes = ($1) WHERE id = ($2)',[countLike ,id])
        } 
        else{
            console.log("Old user toggle like button");
            if(!findUser.isliked){
                const a = await db.query('UPDATE video_handle SET isliked = ($1) WHERE id = ($2) RETURNING *',[true,findUser.id]);
                console.log(a.rows);

                countLike += 1
                console.log("Total like of videoID " + id + " is " + countLike)
            } else{
                const a = await db.query('UPDATE video_handle SET isliked = ($1) WHERE id = ($2) RETURNING *',[false,findUser.id]);
                console.log(a.rows);

                countLike -= 1
                console.log("Total like of videoID " + id + " is " + countLike)
                
            }
            await db.query('UPDATE videos SET likes = ($1) WHERE id = ($2)',[countLike ,id])
        }
        res.status(200).json({message:'You liked/dislik the video'});
        
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

//get is the is the video liked by user or not
export const getLikeSubscribe = async(req,res) =>{
    try{
        console.log("Video handle")
        console.log(req.query.userid)
        
        const id = parseInt(req.query.videoid)
        const video_handle = await db.query('SELECT * FROM video_handle WHERE videoid = ($1)',[id]);
        // const subscribe_handle = await db.query('SELECT * FROM subscribe_handle WHERE video_userid = ($1) AND subscribed_user_id',[id]);
        const findUser = video_handle.rows.find((elm)=> elm.userid === req.query.userid);
        // console.log(video_handle.rows)
        // console.log(findUser)
        if(findUser){
            // const video_handle = await db.query('SELECT * FROM video_handle WHERE userid = ($1)',[id]);
            // console.log(video_handle.rows[0]);
            res.status(200).json(findUser);
        } else{
            res.status(201).json({isliked: false, issubscribed: false})
        }
        
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}