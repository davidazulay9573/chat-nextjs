export interface User {
    name : string,
    email : string,
    image : string,
}

export interface Message {
    content: string,
    sentTime: Date,
    sender : User,
    receiving : User,
}