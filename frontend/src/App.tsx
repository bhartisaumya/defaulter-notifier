import {createBrowserRouter, Router, RouterProvider} from "react-router-dom"



const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/chat/:roomCode",
    element: <ChatScreen />
  },
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
