// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';


// export default function ChatroomPage() {
//   const [newRoomCode, setNewRoomCode] = useState('');
//   const [joinRoomCode, setJoinRoomCode] = useState('');
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('create');
//   const navigate = useNavigate();

//   const {logout} = useAuth0()

//   const generateRandomCode = () => {
//     const code = Math.random().toString(36).substring(2, 8).toUpperCase();
//     setNewRoomCode(code);
//   };

//   const createRoom = () => {
//     if (newRoomCode.trim() === '') {
//       setError('Please enter a room code or generate one.');
//       return;
//     }
//     navigate(`/chat/${newRoomCode}`);
//   };

//   const joinRoom = () => {
//     if (joinRoomCode.trim() === '') {
//       setError('Please enter a room code to join.');
//       return;
//     }
//     navigate(`/chat/${joinRoomCode}`);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold mb-4 text-center">Chatroom</h1>
//         <p className="text-gray-600 mb-6 text-center">Create a new chatroom or join an existing one.</p>

//         <div className="flex mb-4">
//           <button
//             className={`flex-1 py-2 ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//             onClick={() => setActiveTab('create')}
//           >
//             Create Room
//           </button>
//           <button
//             className={`flex-1 py-2 ${activeTab === 'join' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//             onClick={() => setActiveTab('join')}
//           >
//             Join Room
//           </button>
//         </div>

//         {activeTab === 'create' ? (
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="new-room-code" className="block text-sm font-medium text-gray-700 mb-1">
//                 Room Code
//               </label>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   id="new-room-code"
//                   className="flex-1 p-2 border rounded-md"
//                   placeholder="Enter room code"
//                   value={newRoomCode}
//                   onChange={(e) => setNewRoomCode(e.target.value)}
//                 />
//                 <button
//                   onClick={generateRandomCode}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//                 >
//                   Generate
//                 </button>
//               </div>
//             </div>
//             <button
//               onClick={createRoom}
//               className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//             >
//               Create Room
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="join-room-code" className="block text-sm font-medium text-gray-700 mb-1">
//                 Room Code
//               </label>
//               <input
//                 type="text"
//                 id="join-room-code"
//                 className="w-full p-2 border rounded-md"
//                 placeholder="Enter room code to join"
//                 value={joinRoomCode}
//                 onChange={(e) => setJoinRoomCode(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={joinRoom}
//               className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//             >
//               Join Room
//             </button>
//           </div>
//         )}

//         {error && (
//           <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
//             <p>{error}</p>
//           </div>
//         )}
//       </div>
//       <button onClick={() => logout()}>Logout</button>
//     </div>
//   );
// }




import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Login
              </button>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;