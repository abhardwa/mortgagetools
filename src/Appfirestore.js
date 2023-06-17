import './App.scss';
import handleSubmit from './handles/handleSubmit';
import { useRef } from 'react';
 
function App() {
  const dataRef = useRef()
 
  const submithandler = (e) => {
    e.preventDefault()
    handleSubmit(dataRef.current.value)
    dataRef.current.value = "Alok's Test"
  }
 
  return (
    <div className="App">
      <form onSubmit={submithandler}>
        <input type= "text" ref={dataRef} />
        <button type = "submit" className="amort-btn form-btn">Save</button>
      </form>
    </div>
  );
}
 
export default App;