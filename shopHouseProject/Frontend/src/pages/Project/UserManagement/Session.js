//save login response > (user's name and token) to session storage
export const authenticate = (response) => {
    if (window !== 'undefined') {
        console.log('authenticate', response) 
        sessionStorage.setItem('token', JSON.stringify(response));
        sessionStorage.setItem('userId', JSON.stringify(response.result._id));
    }
};

//access access name from session storage
export const getToken = () => {
    if (window !== 'undefined') {
        if (sessionStorage.getItem('token')) {
            return JSON.parse(sessionStorage.getItem('token'));
        }
        else {
            return false;
        }
    }
};



//access user's name from session storage
export const getUser = () => {
    console.log("first")
    if (window !== 'undefined') {
        if (sessionStorage.getItem('userId')) {
            return JSON.parse(sessionStorage.getItem('userId'));
        }
        else {
            return false;
        }
    }
};

//access user's type from session storage
export const getType = () => {
    console.log("type")
    if (window !== 'undefined') {
        if (sessionStorage.getItem('type')) {
            return JSON.parse(sessionStorage.getItem('type'));
        }
        else {
            return false;
        }
    }
};



//remove token from session storage
export const logout = next => {
    if (window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('cartData');

    }
    // next();
};