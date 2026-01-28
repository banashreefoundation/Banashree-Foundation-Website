export const LoginService = (baseUrl:string) => {
    const get = (url:string) => {
        return new Promise((resolve, reject) => {
            fetch(`${baseUrl}${url}`).then(response => response.json()).then(data => {
                if (!data) {
                    return reject(data);
                }
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        })
    };
    const post = (url:string, body:object) => {
        return new Promise((resolve, reject) => {
            fetch(`${baseUrl}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(response => response.json()).then(data => {
                if (!data) {
                    return reject(data);
                }
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        })
    }
    return {
        get, post
    }
}