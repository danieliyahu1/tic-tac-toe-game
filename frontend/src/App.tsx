import loadingGif from './loading.gif';
import './index.css'
import Board from './components/Board';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // You can adjust this as needed.
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [oppName, setOppName] = useState<string>('');
  //const [oppValue, setOppValue] = useState<string>('');
  const [error, setError] = useState<string>(''); // Add state for validation message
  const [turnText, setTurnText] = useState("X");
  const buttonValues: { [key: string]: string } = {
    "button-1": '1',
    "button-2": '2',
    "button-3": '3',
    "button-4": '4',
    "button-5": '5',
    "button-6": '6',
    "button-7": '7',
    "button-8": '8',
    "button-9": '9'
};

  const socket = useRef(io('http://localhost:7000')).current;
  const inputNameRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    const myName = inputNameRef.current?.value.trim();
    if(myName)
    {
      setName(myName);
      setError('');
      setLoading(true);
      socket.emit("find", {name:myName});
    }
    else{
      setError('Name is required.');
    }
  };

  useEffect(() => {
    // Event listener for when opponent data is received
    socket.on("find", (e) => {
      if(e.participants !== undefined)
        {
          e.participants.p1.name as string == name ? setOppName(e.participants.p2.name) : setOppName(e.participants.p1.name);
          //e.participants.p1.name as string == name ? setOppValue(e.participants.p2.value) : setOppValue(e.participants.p1.value);
          e.participants.p1.name as string == name ? setValue(e.participants.p1.value) : setValue(e.participants.p2.value);

          setLoading(false);
          setLoggedIn(true);
        } 
    });

    socket.on("playing", (e) => {
      if(e.participants !== undefined)
      {
        let p1id = e.participants.p1.move;
        let p2id = e.participants.p2.move;
  
        if((e.participants.sum % 2) == 0)
        {
          setTurnText("O");
        }
        else
        {
          setTurnText("X");
        }
  
      
        if (p1id !== '') {
            const p1Element = document.getElementById(p1id) as HTMLButtonElement;
            if (p1Element) {
                p1Element.innerText = "X";
                p1Element.disabled = true;
                p1Element.style.color = "black";
                buttonValues[p1id] = "X";                
            }
        }
        if (p2id !== '') {
            const p2Element = document.getElementById(p2id) as HTMLButtonElement;
            if (p2Element) {
                p2Element.innerText = "O";
                p2Element.disabled = true;
                p2Element.style.color = "black";
                buttonValues[p2id] = "O";
            }
        }
      }
      check(name, e.participants.sum);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("find");
      socket.off("playing");
    };
  }, [socket, name]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //if(turnText !== value) return;
    event.currentTarget.textContent = value; // Change the button's text directly
    buttonValues[event.currentTarget.id] = value;
    socket.emit("playing", {i_Name:name, value:value, buttonId:event.currentTarget.id})
  }; 

  function gameOver(name: string, message:string) {
    socket.emit("gameOver", { i_Name: name });
    console.log(`inside Game over function for - ${name}`);
    setTimeout(() => {
      alert(message);
  
      setTimeout(() => {
        location.reload();
      }, 2000);
    }, 100);
  }
  

  function check(name: string, sum: number)
  {
    if (
      (buttonValues["button-1"] === buttonValues["button-2"] && buttonValues["button-2"] === buttonValues["button-3"]) ||
      (buttonValues["button-4"] === buttonValues["button-5"] && buttonValues["button-5"] === buttonValues["button-6"]) ||
      (buttonValues["button-7"] === buttonValues["button-8"] && buttonValues["button-8"] === buttonValues["button-9"]) ||
      (buttonValues["button-1"] === buttonValues["button-4"] && buttonValues["button-4"] === buttonValues["button-7"]) ||
      (buttonValues["button-2"] === buttonValues["button-5"] && buttonValues["button-5"] === buttonValues["button-8"]) ||
      (buttonValues["button-3"] === buttonValues["button-6"] && buttonValues["button-6"] === buttonValues["button-9"]) ||
      (buttonValues["button-1"] === buttonValues["button-5"] && buttonValues["button-5"] === buttonValues["button-9"]) ||
      (buttonValues["button-3"] === buttonValues["button-5"] && buttonValues["button-5"] === buttonValues["button-7"])
    ) 
    {
      const message = (sum%2) == 0 ? "X Won !" : "O Won!";
      gameOver(name, message);
    }
    else if(sum==10)
    {
      const message = "It's a DRAW!";
      gameOver(name, message);
    }
  }

  return (
    <div className="bg-gray-100 grid place-items-center min-h-screen font-custom">
      <h1 className="my-[5px] text-[3rem] text-[#20b75d] text-stroke">Tic-Tac-Toe</h1>
      {loggedIn ? 
      <>
        <div className="flex w-[95vw] relative">
          <p id="userCont" className="text-2xl">You: {name}<span id="user"></span></p>
          <p id="oppNameCont" className="absolute right-0 text-2xl">Opponent: <span id="oppName">{oppName}</span></p>
        </div>

        <p id="valueCont" className="my-4 text-2xl">You are playing as <span id="value">{value}</span></p>
        <p id="whosTurn" className="my-4 text-2xl">{turnText}'s Turn</p>
      </>
      :
      <></>}
      

      {!loggedIn &&<> 
          <div>
            <p id="enterName" className="text-xl mb-4">Enter your name:</p>
            <input ref={inputNameRef} type="text" placeholder="Name" id="name" autoComplete="off" className={`border border-slate-300 mb-5 p-1 text-lg ${error ? 'border-red-500' : ''}`} />
            {error && <p className="text-red-500">{error}</p>} 
          </div>
          <button onClick={handleSearchClick} id="find" className="text-xl text-white bg-black px-3 py-1 rounded-md">Search for a player</button>
      </>}

      {loading && (
        <img id="loading" src={loadingGif} alt="Loading" className="w-[30px] mt-4" />
      )}
      {loggedIn && <Board handleClick={handleClick} disable={turnText !== value}/>}
    </div>
  )
}

export default App

