import { AnyCnameRecord, AnyMxRecord } from "dns"

class ApiService {
    public static readonly REQUEST_GET = 'GET'
    public static readonly REQUEST_POST = 'POST'
    public static readonly REQUEST_PUT = 'PUT'
    public static readonly REQUEST_DELETE = 'DELETE'
    public static async basicHttpRequest(relativPath: string, metod: string, token: string, payload: {}={}){
        let baseUrl = 'http://localhost:3000'
        let url = baseUrl + relativPath

        let request:any = {
            method: metod, // *GET, POST, PUT, DELETE, etc.
            credentials: "include", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body: JSON.stringify(data), // body data type must match "Content-Type" header
        }

        if (metod == ApiService.REQUEST_POST) {
            request.headers['Content-Type'] = "application/json"
            request.body = JSON.stringify(payload);
        }

        let response = await fetch(url, request)
        return response
    }
}

export { ApiService }