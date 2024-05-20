import React, { useEffect, useState } from 'react'
import Footer from '../components/partials/Footer';
import { selectUsers } from '../redux/userSlice'
import { useSelector } from 'react-redux'
import Login from './authPages/Login';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Home() {
    document.title = "VIM Corn. - home | movies"
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const user = useSelector(selectUsers);
    useEffect(()=>{
      const fetchMovies = async()=>{
        try{
          const res = await axios.get('http://localhost:3200/api/fetch/movies/all')
          setMovies(res.data)
        }catch(err){
          console.log(err.message)
          setIsLoading(true);
        } finally{
          setTimeout(() => {
            setIsLoading(false)
          }, 1000);
        }
      }
      fetchMovies()
    },[])
    const [m1_r_c , setM1rc] = useState({
      m1_r:'',
      m1_c:'',
      m2_r:'',
      m2_c:''
    });
    const m12RC = (e) =>{
      const {name, value} = e.target;
      setM1rc((prev)=>({
        ...prev, [name]:value
      }))
    }
    const divReturn = () => {
      var abc = []
      for (let i = 0; i< m1_r_c.m1_c; i++){
        abc.push(<input type="number" className="p-1 m-2 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} id='ma'/>)
      }
      return abc
    }
    const divReturn2 = () => {
      var abc = []
      for (let i = 0; i< m1_r_c.m1_r; i++){
        abc.push(<div className="matrix_a"> {divReturn()} </div>)
      }
      return abc
    }
    const divReturn3 = () => {
      var abc = []
      for (let i = 0; i< m1_r_c.m2_c; i++){
        abc.push(<input type="number" className="p-1 m-2 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} id='mb'/>)
      }
      return abc
    }
    const divReturn4 = () => {
      var abc = []
      for (let i = 0; i< m1_r_c.m2_r; i++){
        abc.push(<div className="matrix_b"> {divReturn3()} </div>)
      }
      return abc
    }
    const checkResult = () =>{
      if(m1_r_c.m1_c !== m1_r_c.m2_r){
        alert("Please select matrix size ")
      } else{
        alert("Your result is loading")
        var ma = document.querySelectorAll(".matrix_a #ma");
        var mb = document.querySelectorAll(".matrix_b #mb");
        let res = [m1_r_c.m1_r][m1_r_c.m2_c];
        for(let i = 0; i< m1_r_c.m1_r; ++i){
          for(let j = 0; j< m1_r_c.m2_c; ++j){
            for(let k = 0; k< m1_r_c.m1_c; ++k){
              res[i][j] = ma[i][k].value * mb[k][j].value;
            }
          }
        }
        console.log(res)

      }
    }
    return (
      <>
          <main className="bottom-part">
          <h2 className="RecomendedText">Latest movies and web serises </h2>
          <section className='mt-3'>
            <Link><div className='container-xxl bg-primary p-2 text-center'> <i className='mx-2 bi bi-arrow-right-circle'></i>  Join Our Official Telegram Channel <i className='mx-2 bi bi-arrow-left-circle'></i> </div></Link>
            <div className='container-xxl  movieToggler p-0 py-1 mt-5'>
              <div className=' d-flex align-item-center '>
                <Link className='me-3' style={{background:'darkorange'}}>Recomended <i className='bi  bi-caret-right-fill'></i> </Link>
                <div className='d-flex align-item-center'>
                  <Link>Featured</Link>
                  <Link>Most Fevorite</Link>
                  <Link>Top imdb</Link>
                </div>
              </div>
              <div>
                <form className='movieSearch '>
                  <input type="search" placeholder='Search movies..' name='search' id='search' required/>
                  <label htmlFor='search'  className=" p-1 bi bi-search " type="submit" style={{color:"lightgrey"}}></label>
                </form>
              </div>
            </div>
            <div className="cntr container-xxl">
              {isLoading?
                movies.map((elm)=>{
                  return (<div className='grid-box placeholder-wave' style={{background:'grey',borderRadius:"15px"}}></div>)
                })
              :
              movies.map((elm)=>{
                return(
                  <>
                  <div className="grid-box" key={elm.id}>
                    <Link to={`/movies/explore/${elm.id}`} style={{textDecoration:'none'}}>
                      <div className="moviePic  d-flex flex-column justify-content-between" style={{backgroundImage:`url('${elm.thumbnail}')`, backgroundSize:'cover'}}>
                        <p className='type'  style={{color:'white' ,width:'fit-content'}}>{elm.language}</p>
                      <p className='text-center m-0' style={{color:'white'}}>{elm.title}</p>
                      </div>
                    </Link>
                  </div>
                  </>
                )
              })}
            </div>
            <div className='container-xxl movieToggler p-0 mt-5'>
              <Link className='' style={{background:'darkorange'}}>Latest web serises <i className="bi bi-caret-right-fill"></i> </Link>
            </div>
            <div className="cntr container-xxl">
              {isLoading?
                movies.map((elm)=>{
                  return (<div className='grid-box placeholder-wave' style={{background:'grey',borderRadius:"15px"}}></div>)
                })
              :
              movies.map((elm)=>{
                return(
                  <>
                  <div className="grid-box" key={elm.id}>
                    <Link to={`/movies/explore/${elm.id}`} style={{textDecoration:'none'}}>
                      <div className="moviePic  d-flex flex-column justify-content-between" style={{backgroundImage:`url('${elm.thumbnail}')`, backgroundSize:'cover'}}>
                        <p className='type'  style={{color:'white' ,width:'fit-content'}}>{elm.language}</p>
                      <p className='text-center m-0' style={{color:'white'}}>{elm.title}</p>
                      </div>
                    </Link>
                  </div>
                  </>
                )
              })}
            </div>
          </section>
          <div className="d-flex flex-column justify-centent-center align-items-center p-3 rounded-3 mt-5 bg-primary" >
            <p className="fs-6 mb-4">Select the matrix size (please select positive number)</p>
            <div className="d-flex align-items-center">
              <b className="me-3">A : </b>
              <div className="d-flex align-items-center">
                <input onChange={m12RC} className="p-1 me-3 rounded-3" style={{width: "100px", background: "#9fccff", color:'black'}} placeholder="Row" type="number" name="m1_r" id="m1_r" />
                <b>X</b>
                <input onChange={m12RC} className="p-1 mx-3 rounded-3" style={{width: "100px", background: "#9fccff" , color:'black'}} placeholder="Column" type="number" name="m1_c" id="m1_c" />
              </div>
            </div>
            <div className="d-flex align-items-center mt-3">
              <b className="me-3">B : </b>
              <div className="d-flex align-items-center">
                <input onChange={m12RC} className="p-1 me-3 rounded-3" style={{width: "100px", background: "#9fccff", color:'black'}} placeholder="Row" type="number" name="m2_r" id="m2_r" />
                <b>X</b>
                <input onChange={m12RC} className="p-1 mx-3 rounded-3" style={{width: "100px", background: "#9fccff", color:'black'}} placeholder="Column" type="number" name="m2_c" id="m2_c" />
              </div>
            </div>
            <div className="mt-5 text-start">
              <b>The first matrix : ({m1_r_c.m1_r + " X " + m1_r_c.m1_c})</b>
              <div className="d-flex align-items-center mb-2">
                <b className="me-3"> A = </b>
                <div className="p-2 rounded-3" style={{borderRight: "3px solid", borderLeft: "3px solid"}}>
                  {divReturn2()}
                  {/* <div className="mb-2">
                    {divReturn()}
                  </div>
                  <div>
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1  rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                  </div>
                  <div className="mt-2">
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1  rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                  </div> */}
                </div>
              </div>
            </div>
            <div className="mt-2 text-start">
              <b>The second matrix : ({m1_r_c.m2_r + " X " + m1_r_c.m2_c}) </b>
              <div className="d-flex align-items-center">
                <b className="me-3">B = </b>
                <div className="p-2 rounded-3" style={{borderRight: "3px solid", borderLeft: "3px solid"}}>
                  {divReturn4()}
                  {/* <div className="mb-2">
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                  </div>
                  <div>
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1  rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                  </div>
                  <div className="mt-2">
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff" , color:'black'}} />
                    <input type="number" className="p-1 me-3 rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                    <input type="number" className="p-1  rounded-3" style={{width: "100px", background: "#d8eaff", color:'black'}} />
                  </div> */}
                </div>
              </div>
              
            </div>
            <button onClick={checkResult} className='btn btn-secondary mt-3'>Result</button>
          </div>
              <Footer/>
          </main>
      </>
    )
}
