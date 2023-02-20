const EventEmitter=require('events')

class MyEventEmitter extends EventEmitter{}

const event=new MyEventEmitter()

event.on('play',(value)=>{
  console.log(value)
})
event.on('play',(value)=>{
  console.log(value)
})

event.emit('play','ok')
event.emit('play','movie')