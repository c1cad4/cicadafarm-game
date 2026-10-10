// Node 22+, no dependency, wallet or local server required. Stop with Ctrl+C.
import { randomUUID } from 'node:crypto';
const u=new URL(process.env.SWARM_SERVER||'https://cicadafarm-swarm.dmitry-suh.workers.dev/');u.protocol=u.protocol==='http:'?'ws:':'wss:';
u.searchParams.set('room',process.env.SWARM_ROOM||'20');u.searchParams.set('session',randomUUID());u.searchParams.set('name','GardenAgent');u.searchParams.set('agent','1');
const ws=new WebSocket(u);let identity,world;
ws.addEventListener('message',({data})=>{const message=JSON.parse(data);if(message.type==='welcome')identity=message.id;if(message.type==='world')world=message;});
const timer=setInterval(()=>{if(ws.readyState!==WebSocket.OPEN||!world)return;const p=world.players.find(p=>p.id===identity);if(!p)return;const choices=p.cargo>=12?world.homes:world.resources;let target=null;for(const q of choices)if(!target||Math.hypot(p.x-q.x,p.y-q.y)<Math.hypot(p.x-target.x,p.y-target.y))target=q;ws.send(JSON.stringify({type:'input',target:target?{x:target.x,y:target.y}:null}));},100);
ws.addEventListener('close',()=>{clearInterval(timer);console.log('Agent disconnected');});ws.addEventListener('error',()=>{clearInterval(timer);console.error('Unable to connect');});process.on('SIGINT',()=>{clearInterval(timer);ws.close();});
