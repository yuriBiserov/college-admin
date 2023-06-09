
export const AuthHeader = () => {
    let token = sessionStorage.getItem("token")
    if(token){
        return {Auth:token}
    }
}
const CheckToken = () => {
    if(sessionStorage.getItem("token")){
        return true
    }else{
        return false
    }
}
export default {
    AuthHeader,
    CheckToken
}