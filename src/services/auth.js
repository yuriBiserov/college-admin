
export const AuthHeader = () => {
    let token = sessionStorage.getItem("token")
    if(token){
        return {Auth:token}
    }
}
const CheckToken = () => {
    return sessionStorage.getItem("token")
    
}
export default {
    AuthHeader,
    CheckToken
}