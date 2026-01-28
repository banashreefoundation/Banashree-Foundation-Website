import './App.css'
import { Button } from './components/ui/button'

function App() {
  const submitHandler = () => {
    console.log('click me')
  }
  return (
    <h1 className="text-3xl font-bold underline">
      <Button onClick={submitHandler}>Click Me</Button>
    </h1>
  )
}

export default App
