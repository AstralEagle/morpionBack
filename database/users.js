let users = [];

exports.addUser = ({id,name,room}) => {
    if (!name || !room) 
        return { error : "User and room required." };
    const user = {id : id, name : name, room: room};

    users.push(user);
    return user;
    }
    