const users = [];
const newUsers =[];


const addUser = ({ id, user, room}) => {

    const user = { id, user, room }

    if (!username || !room){
        return {
         error: console.log('username and room are required')
        }
    }

    const userExists = user.room === room && users.includes(user)

    if (userExists) return console.log('user already added');

    users.push(user)

    return { user }
}

const removeUser = (id) => {
    const userIdx = users.indexOf(user);

    if (userIdx !== -1) return users.splice(userIdx, 1)[0]
}

// Make sure this isn't already taken care of outside of socket.io
//  might not be needed as socket function
const getUser = (id) => {
  const searchUser =  users.find(user => user.id === id)
  if (searchUser === undefined) return console.log(`user with id: ${id} not connected`);
  return searchUser
}


module.exports = {
    addUser, removeUser, getUser, userInRoom
}