const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');

require('dotenv').config()
const User= require('./user')
const Log = require('./log')
const Exercise = require('./exercise')
const PORT = process.env.PORT || 3000
const dbconn = require('./dbconn')
dbconn()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const arr = []
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post('/api/users',async (req, res)=>{
  const { username } = req.body
   const user = await User.create({ username: username, count: 0 });
  res.json({'username': username, '_id': user._id})
})
app.get('/api/users',async (req, res)=>{
  const result = await User.find({},{ logs: 0 });
  res.send(result)
})

app.post('/api/users/:_id/exercises', async (req, res)=>{
  let { description, duration , date } = req.body
  const { _id } = req.params
  const user = await User.findOne({_id: _id})

  if(!user){
    res.send('user not found')
    return
  }
  if(!description){
    res.send('description required')
    return
  }
  if(!duration || isNaN(duration)){
    res.send('duration required')
    return
  }
  if(date.trim()===''|| !date){
    date=new Date()
    console.log(date)
  }
  const username = user.username

  const exer = new Exercise();
  exer.date=new Date(date).toDateString();
  exer.duration=duration;
  exer.description=description;
  exer.username=username;
  await exer.save()
  const log = new Log()
  log.description=description
  log.duration=duration
  log.date=new Date(date).toDateString()
  await log.save()
  user.logs.push(log)
  user.count+=1
  await user.save()


  res.json({
    '_id': exer._id,
    'username': username,
    'date': exer.date,
    'duration': exer.duration,
    'description': exer.description
  })

})
/* app.get('/api/users/:_id/logs', async (req, res)=>{
  
  const { _id } = req.params
  const user = await User.findOne({_id: _id})  
  if(!user){
    res.send('user not found')
    return
  }
  const lo = user.logs
   lo.forEach((e=>delete e.__v && delete e._id))
  res.json({
    '_id': _id,
    'username': user.username,
    'count': user.count,
    'logs':lo
  })
}) */
app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params
  const user = await User.findOne({_id: _id})  
  if(!user){
    res.send('user not found')
    return
  }
  // Use the username variable to access log data in the 'username' field
  const logs = user.logs.filter(e => e.username === req.query.username)
  // If the query parameter is a limit, you can set it to -1 for all logs, or a positive integer for the requested logs
  if(req.query.limit !== undefined && parseInt(req.query.limit) !== 0){
    logs = logs.slice(0,parseInt(req.query.limit)) 
  }
  logs.forEach((e=>delete e.__v && delete e._id))

  res.json({
    '_id': _id,
    'username': user.username,
    'count': user.count,
    'log': logs
  })
})


mongoose.connection.once('open', () => {
  console.log('MongoDB connection established successfully');
  app.listen(PORT,()=> console.log(`server running on port ${PORT}`))
});


/* const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
}) */

