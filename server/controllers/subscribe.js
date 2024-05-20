import db from "../Database/dataworld.js";

export const subscribeChannel = async(req,res) =>{
    try{
        const currUserid = req.params.userid
        const videoUser = req.body;
        console.log("--------------------------------------------")

        //find video user to subscribe
        const reqVideo = await db.query('SELECT subscriber FROM vim_users WHERE email=($1)',[videoUser.userid]);
        let countSubscriber = parseInt(reqVideo.rows[0].subscriber);
        console.log("Previous subscriber " + countSubscriber);
        console.log("--------------------------------------------")

        //find from subscribe_handle wether the user listed previously by video userid and current userid
        const subscribe_handle = await db.query('SELECT * FROM subscribe_handle WHERE video_userid=($1) AND subscribed_user_id=($2) ',[videoUser.userid, currUserid]);
        console.log('Current user of current video userid ' + videoUser.userid)
        console.log(subscribe_handle.rows)
        console.log("--------------------------------------------")
        
        if(!subscribe_handle.rows.length){
            console.log("New  user ?");
            const store = await db.query('INSERT INTO subscribe_handle (videoid, video_userid , subscribed_user_id , issubscribed) VALUES($1,$2,$3,$4)  RETURNING * ',
            [videoUser.id, videoUser.userid, currUserid, true]);
            console.log(store.rows);

            countSubscriber += 1;
            console.log("Now subscriber of " +videoUser.userid+ " is ~ " + countSubscriber);
            const updateSubscriber = await db.query('UPDATE vim_users SET subscriber=($1) WHERE email=($2)',[countSubscriber,videoUser.userid]);
            console.log(updateSubscriber.rows);
        } else{
            console.log('Old user')
            if(subscribe_handle.rows[0].issubscribed){
                console.log("Unsubscribed");
                const update = await db.query('UPDATE subscribe_handle SET issubscribed=($1) WHERE video_userid=($2) AND subscribed_user_id=($3) RETURNING * ',
                [false, videoUser.userid, currUserid]);
                console.log(update.rows);

                countSubscriber -= 1;
                console.log("Now subscriber of " +videoUser.userid+ " is ~ " + countSubscriber);

            } else if(!subscribe_handle.rows[0].issubscribed){
                console.log("Subscribed");
                const update = await db.query('UPDATE subscribe_handle SET issubscribed=($1) WHERE video_userid=($2) AND subscribed_user_id=($3) RETURNING * ',
                [true, videoUser.userid, currUserid]);
                console.log(update.rows);

                countSubscriber += 1;
                console.log("Now subscriber of " +videoUser.userid+ " is ~ " + countSubscriber);
            }
            const updateSubscriber = await db.query('UPDATE vim_users SET subscriber=($1) WHERE email=($2)',[countSubscriber,videoUser.userid]);
            console.log(updateSubscriber.rows);
        }
        
        
    } catch(err){
        console.log(err.message);
        res.json({error:"Somthing went wrong ! "});
    }
}

export const getIsSubscribed = async(req,res) =>{
    try{
        console.log("get subscribed")
        console.log("OtherUser "+req.query.other_user)
        let other_user = req.query.other_user;
        if(!other_user){
            const result = await db.query('SELECT userid FROM videos WHERE id = ($1)', [req.query.videoid])
            other_user = result.rows[0].userid;
        }
        console.log(other_user)
        const get = await db.query('SELECT * FROM subscribe_handle WHERE subscribed_user_id=($1) AND video_userid=($2) ',[req.query.userid, other_user]);
        console.log(get.rows[0])
        if(get.rows.length){
            res.json({issubscribed: get.rows[0].issubscribed})
        } else{
            res.json({issubscribed: false})
        }
    } catch(err){
        console.log(err.message);
    }
}
export const getSubscriptions = async(req,res, next) =>{
    const userid = req.params.userid
    let subscribed_users = [];
    try{
        
        const result = await db.query('SELECT * FROM subscribe_handle WHERE subscribed_user_id = ($1) AND issubscribed = ($2)',[userid, true]);
        // console.log(result.rows)
        result.rows.forEach(async(elm)=>{
            const res1 = await db.query('SELECT name,username,email, img, subscriber,timestamps  FROM vim_users WHERE email = ($1)', [elm.video_userid]);
            subscribed_users.push(res1.rows[0])
        })
        
        setTimeout(() => {
            console.log("Total subscription of : " + userid)
            console.log(subscribed_users); 
            if(result.rows.length){
                res.status(200).json(subscribed_users)
            } else{
                res.status(201).json({error:'No subscriptions !'})
            }
        }, 500);
        
    } catch(err){
        next(err);
    }
}
