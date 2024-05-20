import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

function Placeholders() {
  return (
    <div className="card video-link p-2" aria-hidden="true" style={{background:'none', border:'none', borderRadius:"0"}}>
      <img  src="/assets/image.png" className="card-img-top thumbnail" height='60%'  alt="..." style={{borderRadius:"20px"}} />
      <div className="card-body d-flex align-items-center p-1 py-2" style={{background:'transparant'}}>
        <h5 className="card-title c">
          <span className="placeholder" style={{width:"40px", height:"40px", borderRadius:"50%",color:'darkgrey'}}></span>
        </h5>
        <p className="card-text placeholder-wave " >
          <span className="placeholder " style={{width:"250px", color:'darkgrey'}}></span>
          <span className="placeholder col-7" style={{color:'darkgrey'}}></span>
        </p>
      </div>
    </div>
  );
}

export default Placeholders;