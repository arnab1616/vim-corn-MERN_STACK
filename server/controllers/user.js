import db from "../Database/dataworld.js";

// function dateBuilder(d) {
//     let date = addZero(d.getDate());
//     let month = addZero(new Date().getMonth());
//     let year = addZero(d.getFullYear());
//     let hour = addZero(d.getHours());
//     let min = addZero(d.getMinutes());
//     return `${year}-${month}-${date} ${hour}:${min}`;
//   }
//   function addZero(i) {
//     if (i < 10) {i = "0" + i}
//     return i;
//   }

export const getUser = async(req,res) =>{
    try{
        const user = req.params.email;
        console.log(req.params.email)
        const result = await db.query('SELECT * FROM vim_users WHERE email = ($1)',[user]);
        if(result.rows.length !== 0){
            console.log(result.rows[0])
            res.status(200).json(result.rows[0]);
        } else{
            res.status(404).json({message:"User not found"});
        }
        // res.json({message:"ok"})
    } catch(err){
        console.log(err.message);
    }
}
export const updateUser = async(req,res)=>{
    try{
        const user = req.body;
        console.log(user);
        console.log(req.params.email)
        const now = new Date();
        const date = `${now.getFullYear()}${now.getMonth()}${now.getDate()}`
        const updateUser = await db.query("UPDATE vim_users SET name=($1), username=($2), about=($3), img=($4), timestamps=($5)  WHERE email = ($6) RETURNING * ",[
            user.name,
            user.username,
            user.about ||  'No about yet!',
            user.photoURL,
            Date.now(),
            req.params.email
        ])
        console.log(updateUser.rows[0])
        res.status(200).json(updateUser.rows[0]);

    }catch(err){
        console.log(err);
    }
}
export const updateCover = async(req,res)=>{
    try{
        const user = req.body;
        console.log(user)
        console.log(req.params.email)
        const updateUser = await db.query("UPDATE vim_users SET cover=($1) WHERE email = ($2) RETURNING * ",[
            user.cover,
            req.params.email,
        ])
        console.log(updateUser.rows[0])
        res.status(200).json(updateUser.rows[0]);
    }catch(err){
        console.log(err.message);
    }
}
export const movies = async(req,res)=>{
    try{

    }catch(err){
        console.log(err.message);
    }
}