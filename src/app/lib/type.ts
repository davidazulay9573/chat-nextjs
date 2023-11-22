export interface User {
    name : string,
    email : string,
    image : string,
}

export interface Message {
    content: string,
    createdAt : Date,
    sender : string,
    receiving : string,
}