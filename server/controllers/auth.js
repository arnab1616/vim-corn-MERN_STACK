import db from "../Database/dataworld.js";

// function dateBuilder(d) {
//     let date = addZero(d.getDate());
//     let month = addZero(d.getMonth());
//     let year = addZero(d.getFullYear());
//     let hour = addZero(d.getHours());
//     let min = addZero(d.getMinutes());
//     return `${year}-${month}-${date} ${hour}:${min}`;
//   }
//   function addZero(i) {
//     if (i < 10) {i = "0" + i}
//     return i;
//   }

export const signupUser = async(req,res) =>{
    try{
        const user = req.body;
        console.log(user);
        const result = await db.query('SELECT * FROM vim_users WHERE email = ($1)',[user.email]);
        if(result.rows.length === 0){
            const newUser = await db.query("INSERT INTO vim_users (name, username, email, password, img, subscriber, subscribed_users, timestamps ) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING * ",[
                user.username,
                user.username,
                user.email,
                user.Password,
                user.photoURL || 'http://localhost:8800/public/assets/3135715.png',
                0,
                0,
                Date.now()
            ])
            console.log(newUser.rows[0]);
            res.status(200).json(newUser.rows[0]);
        } else{
            res.status(200).json(result.rows[0]);
        }
        // res.json({message:"Ok"})
    } catch(err){
        console.log(err.message);
    }
}

export const googleSignup = async (req, res) =>{
    try{
        const user = req.body;
        console.log(user);
        const result = await db.query('SELECT * FROM vim_users WHERE email = ($1)',[user.email]);
        if(result.rows.length === 0){
            const newUser = await db.query("INSERT INTO vim_users (name, username, email, password, img, subscriber, subscribed_users, timestamps ) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING * ",[
                user.displayName,
                user.displayName,
                user.email,
                user.uid,
                user.photoURL || 'http://localhost:8800/public/assets/3135715.png',
                0,
                0,
                new Date()
            ])
            console.log(newUser.rows[0]);
            res.status(200).json(newUser.rows[0]);
        } else{
            const updateUser = await db.query("UPDATE vim_users SET name=($1), username($2), email=($3), password=($4), img=($5), timestamps=($6)  WHERE email = ($7) ",[
                user.displayName,
                user.displayName,
                user.email,
                user.uid,
                user.photoURL || 'http://localhost:8800/public/assets/3135715.png',
                new Date(),
                user.email,
            ])
            console.log(updateUser.rows[0])
            res.status(200).json(updateUser.rows[0]);
        }
    } catch(err){
        console.log(err.message);
    }
}