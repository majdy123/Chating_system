const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userlist = document.getElementById('users')
//geting user name and room from url 
const{username,room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true
});
console.log(username,room);


const socket = io();
//join chat
socket.emit('joinRoom',{username, room})

socket.on('roomUsers',({room, users})=>{
  outputRoomName(room);
  outputUsers(users);
})
// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
  //scroll 
  chatMessages.scrollTop=chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();//prevent def pehavior
  // Get message text
  let msg = e.target.elements.msg.value;//msg is id of the input message 




  //emit message to srever
  socket.emit('chatMessage',msg);
  //clear in
  e.target.elements.msg.value="";
  e.target.elements.msg.foucs;
});

//Output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML=`
  <p class="meta">${message.username}<span class = ${message.time}>: 9:12 pm </span></p>
  <p class="text">${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
  roomName.innerText = room;

}
function outputUsers(users){
  userlist.innerHTML=`
  ${users.map(user => `<li>${user.username}</li>`).join()}`
}