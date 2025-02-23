import {createBrowserRouter, RouterProvider} from "react-router-dom"
import LoginPage from "./LoginPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  // {
  //   path: "/chat/:roomCode",
  //   element: <ChatScreen />
  // },
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
