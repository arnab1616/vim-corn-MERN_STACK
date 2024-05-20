import React from 'react'

export default function RecomendedPlaceholder() {
  return (
    <div className=" d-flex  my-3 mx-2" aria-hidden="true" style={{background:'none', border:'none', borderRadius:"0"}}>
        <img  src="/assets/image.png" className="card-img-top"  height='120px' alt="..." style={{width:"45%",borderRadius:"10px"}} />
        <div className=" p-1 py-2" style={{width:'55%',background:'transparant'}}>                
            <p className=" placeholder-wave " >
                <span className="placeholder col-11" style={{ color:'darkgrey'}}></span>
                <span className="placeholder col-6" style={{color:'darkgrey'}}></span>
                <span className="placeholder col-10" style={{color:'darkgrey'}}></span>
                <p className='p-0 m-0 d-flex mt-1'>
                    <span className="placeholder me-1 col-3" style={{color:'darkgrey'}}></span>
                    <span className="placeholder col-4" style={{color:'darkgrey'}}></span>
                </p>
            </p>                     
        </div>
    </div>
  )
}
