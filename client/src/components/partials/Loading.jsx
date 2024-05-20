import React from 'react'

export default function Loading() {
  return (
    <>
     <main className='bottom-part' style={{position:"absolute", left:"0", top:"0",background:"linear-gradient(300deg, #89d3ec, #e2dfe7)", height:"100%", width:"100%"}}>
        <div className='d-flex justify-content-center'>
            <div className='d-flex align-items-center'>
                <img src="/assets/VIM icon.png" width="60px" alt="icon" />
                <strong className='m-0 mx-1 p-0' style={{fontSize:"1.6rem"}}>CORN.</strong>
            </div>
        </div>
     </main> 
    </>
  )
}
