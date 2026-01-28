export const ContactService = (baseUrl: string) => {
    const get = (url: string, token?: string) => {
        return new Promise((resolve, reject) => {
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`${baseUrl}${url}`, {
                method: 'GET',
                headers
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        return reject(data);
                    }
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    const post = (url: string, body: object, token?: string) => {
        return new Promise((resolve, reject) => {
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`${baseUrl}${url}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        return reject(data);
                    }
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    const put = (url: string, body: object, token?: string) => {
        return new Promise((resolve, reject) => {
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`${baseUrl}${url}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        return reject(data);
                    }
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    const del = (url: string, token?: string) => {
        return new Promise((resolve, reject) => {
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`${baseUrl}${url}`, {
                method: 'DELETE',
                headers
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        return reject(data);
                    }
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    const createContact = (contactData: {
        name: string;
        email: string;
        phone?: string;
        inquiryType: string;
        subject: string;
        message: string;
    }) => {
        return post('/createContact', contactData);
    };

    return {
        get, post, put, del,createContact
    }
}