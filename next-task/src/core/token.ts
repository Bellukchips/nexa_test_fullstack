export function isTokenAvailable(){
    const token = localStorage.getItem("token");
    return token !== null
}

export function getToken(){
    return localStorage.getItem("token")
}

export function removeToken(){
    localStorage.removeItem("token")
}