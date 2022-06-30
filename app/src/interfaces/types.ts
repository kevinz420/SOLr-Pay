// for redux usage
export interface UserType {
    username : string,
    pfpURL : string
    friends : Array<String>
}

// for react component usage
export interface ProfileType {
    username : string,
    pfpURL : string
}