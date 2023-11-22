export interface User {
    name : string,
    email : string,
    image : string,
    _id : string
}

export interface Message {
    content: string,
    createdAt : Date,
    sender : string,
    receiving : string,
    _id : string
}