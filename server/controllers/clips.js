import db from "../Database/dataworld.js";

export const newClip = async(req,res) =>{
    try{
        const user = req.params.email;
        const vidSrc = req.body;
        console.log(vidSrc);
        const newVideo = await db.query('INSERT INTO clips (userid, caption, clip_url, views, likes, dislikes, timestamps) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [user, vidSrc.title, vidSrc.clips_url, 0, 0, 0, Date.now()]
        );
        res.status(200).json(newVideo.rows[0]);
        // res.status(200).json({message:'ok'});
        console.log(newVideo.rows)
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}
export const getClips = async(req,res) =>{
    try{
        const allVideo = await db.query('SELECT vim_users.name, vim_users.img, clips.id, clips.caption,clips.clip_url,clips.views,clips.timestamps  FROM clips JOIN vim_users ON vim_users.email = clips.userid');
        res.status(200).json(allVideo.rows);
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

export const views = async(req,res) =>{
    try{
        const id = parseInt(req.params.id)
        const reqVideo = await db.query('SELECT views FROM clips WHERE id=($1)',[id]);
        const views = reqVideo.rows[0].views;
        const countViews = await db.query('UPDATE clips SET views = ($1) WHERE id = ($2) RETURNING *',[views+1, id])
        res.status(200).json(countViews.command[0]);
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}
export const playClips = async(req,res) =>{
    try{
        const id = parseInt(req.params.id)
        const reqVideo = await db.query('SELECT vim_users.name,vim_users.subscriber, vim_users.img, clips.id,clips.userid, clips.caption, clips.views,clips.timestamps,clips.clip_url,clips.likes,clips.dislikes FROM clips JOIN vim_users ON vim_users.email = clips.userid WHERE clips.id=($1)',[id]);
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
export const playClipsNext = async(req,res) =>{
    try{
        const id = parseInt(req.params.id)
        const reqVideo = await db.query('SELECT vim_users.name,vim_users.subscriber, vim_users.img, clips.id,clips.userid, clips.caption, clips.views,clips.timestamps,clips.clip_url,clips.likes,clips.dislikes FROM clips JOIN vim_users ON vim_users.email = clips.userid WHERE clips.id != ($1)',[id]);
        console.log("next clip of "+id);
        // const reqVideo = await db.query('SELECT * FROM videos WHERE id = $1',[id])
        res.status(200).json(reqVideo.rows[0]);
        console.log(reqVideo.rows[0])
        // res.status(200).json({message:'ok'});
        // SELECT column FROM table  
        // ORDER BY RAND ( )  
        // LIMIT 1  
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}
// Work complete
export const likeClips = async(req,res) =>{
    try{
        console.log(req.query)
        const id = parseInt(req.params.id)
        const reqVideo = await db.query('SELECT likes,dislikes FROM clips WHERE id=($1)',[id]);
        let countLike = parseInt(reqVideo.rows[0].likes)
        let countDidLike = parseInt(reqVideo.rows[0].dislikes)
        console.log(countLike, countDidLike);
        const findUser = await db.query('SELECT * FROM clips_handle WHERE clipid=($1) AND userid = ($2)',[id,req.body.email]);
        console.log(findUser.rows)
        if(!findUser.rows.length){
            console.log("New user likes")
            if(req.query.toggle === 'like'){
                await db.query('INSERT INTO clips_handle (clipid, userid, isliked ) VALUES($1,$2,$3) RETURNING * ',
                [id, req.body.email,true,])
                countLike +=1
                console.log("Total like of videoID " + id + " is " + countLike)
                // await db.query('UPDATE videos SET likes = ($1) WHERE id = ($2)',[countLike ,id])
            }
            else if(req.query.toggle === 'disLike'){
                await db.query('INSERT INTO clips_handle (clipid, userid, isdisliked) VALUES($1,$2,$3) RETURNING * ',
                [id, req.body.email,true,])
                countDidLike +=1
                console.log("Total dislike of videoID " + id + " is " + countDidLike)
                // await db.query('UPDATE videos SET dislikes = ($1) WHERE id = ($2)',[countDidLike ,id])
            }
        } 
        else{
            console.log("Old user toggle like or dislike button");
            if(req.query.toggle === 'like'){
                if(!findUser.rows[0].isliked && findUser.rows[0].isdisliked){
                    const a = await db.query('UPDATE clips_handle SET isliked = ($1), isdisliked = ($2) WHERE id = ($3) RETURNING *',[true,false,findUser.rows[0].id]);
                    console.log(a.rows);
                    countDidLike -= 1
                    countLike += 1
                    console.log("Total like and dislike of videoID " + id + " is " + countLike + " , " + countDidLike)
                }
                else if(!findUser.rows[0].isliked && !findUser.rows[0].isdisliked){
                    const a = await db.query('UPDATE clips_handle SET isliked = ($1) WHERE id = ($2) RETURNING *',[true,findUser.rows[0].id]);
                    console.log(a.rows);

                    countLike += 1
                    console.log("Total like of videoID " + id + " is " + countLike)
                }
                else{
                    const a = await db.query('UPDATE clips_handle SET isliked = ($1) WHERE id = ($2) RETURNING *',[false,findUser.rows[0].id]);
                    console.log(a.rows);

                    countLike -= 1
                    console.log("Total like of videoID " + id + " is " + countLike)
                    
                }
            }
            else if(req.query.toggle === 'dislike'){
                if(!findUser.rows[0].isdisliked && findUser.rows[0].isliked){
                    const a = await db.query('UPDATE clips_handle SET isdisliked = ($1), isliked = ($2) WHERE id = ($3) RETURNING *',[true, false,findUser.rows[0].id]);
                    console.log(a.rows);
                    countLike -=1
                    countDidLike += 1
                    console.log("Total dislike and like of videoID " + id + " is " + countDidLike + ' , ' + countLike)
                } 
                else if(!findUser.rows[0].isdisliked && !findUser.rows[0].isliked){
                    const a = await db.query('UPDATE clips_handle SET isdisliked = ($1) WHERE id = ($2) RETURNING *',[true,findUser.rows[0].id]);
                    console.log(a.rows);
    
                    countDidLike += 1
                    console.log("Total dislike of videoID " + id + " is " + countDidLike)
                }
                else{
                    const a = await db.query('UPDATE clips_handle SET isdisliked = ($1) WHERE id = ($2) RETURNING *',[false,findUser.rows[0].id]);
                    console.log(a.rows);
    
                    countDidLike -= 1
                    console.log("Total dislike of videoID " + id + " is " + countDidLike)
                    
                }
            }
            await db.query('UPDATE clips SET likes = ($1),dislikes = ($2) WHERE id = ($3)',[countLike, countDidLike ,id]);
        }
        res.status(200).json({message:'You liked/dislik the video'});
        
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}
export const getlikeSubscribe = async (req, res) =>{
    try{
        console.log(req.query)
        console.log(req.params)
    }catch(err){
        console.log(err.message);
    }
}