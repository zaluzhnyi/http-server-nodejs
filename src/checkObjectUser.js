export const checkUser = (user)=>{
  if (user.hasOwnProperty('username') && user.hasOwnProperty('age') && user.hasOwnProperty('hobbies')) {
    if (typeof user['age']==='number' && Array.isArray(user['hobbies']) && (user['hobbies'].every((el)=>typeof el === 'string')||user['hobbies'].length ===0) && typeof user['username']==='string') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
