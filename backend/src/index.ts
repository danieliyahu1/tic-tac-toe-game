import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import path from 'path';
import http, { Server } from 'http';
import { Socket, Server as socketServer } from 'socket.io';
import { Player, Players } from './types';


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({ origin: "http://localhost:3000" }));

const server = http.createServer(app);
const io = new socketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,  // Frontend URL
      methods: ["GET", "POST"]
    }
  });
app.use(express.static(path.resolve("")));

let arr: Player[] = [];
let playingArray: Players[] = [];
const roomsIds = new Set<string>([
    "button-1",
    "button-2",
    "button-3",
    "button-4",
    "button-5",
    "button-6",
    "button-7",
    "button-8",
    "button-9"
]);

io.on("connection", (socket)=>{
    socket.on("find", (e)=>{
        if(e.name != null)
        {
            let player: Player = {
                name: e.name,
                value: '',
                move: "",
                id: socket.id
            }
            arr.push(player);

            if(arr.length >= 2){
                arr[0].value = "X";
                arr[1].value = "O";
                let obj: Players={
                    p1: arr[0],
                    p2: arr[1],
                    sum: 1,
                    room: arr[0].id + "-" + arr[1].id
                }

                io.sockets.sockets.get(arr[0].id)?.join(obj.room);
                socket.join(obj.room);

                playingArray.push(obj);
                arr.splice(0,2);

                io.in(obj.room).emit("find", {participants: foundObject(e.name)})
            }
        }
    });

    socket.on("playing", ({i_Name, value, buttonId})=>{
        let objToChange = foundObject(i_Name);
        if(value =="X")
        {
            if(!objToChange) return;
            objToChange.p1.move = buttonId;
            objToChange.sum++; 
        }
        else if(value =="O")
        {
            if(!objToChange) return;
            objToChange.p2.move = buttonId;
            objToChange.sum++; 
        }
        else{
            throw new Error(`Invalid value: ${value}. Expected "X" or "O".`);
        }

        io.in(objToChange.room).emit("playing", {participants: objToChange});
    });

    socket.on("gameOver", (e) => {
        playingArray = playingArray.filter(participants => participants.p1.name !== e.name || participants.p2.name !== e.name)
    })
})

const foundObject = (name:string): Players | undefined => {
     return playingArray.find(obj => obj.p1.name == name || obj.p2.name == name);
}

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/", (req:Request, res:Response) => {
    return res.sendFile("../../frontend/index.html")
})

app.get("/api/test", async (req: Request, res: Response) => {
    res.json({message: "hello from express endpoint tic tac tope app!"});
});

server.listen(7000, ()=> {
    console.log("server running on localhost:7000");
});