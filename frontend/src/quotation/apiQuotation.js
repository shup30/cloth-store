export const create = (userId, token, quotation) => {
    return fetch(`${process.env.REACT_APP_API_URL}/quotation/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: quotation
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// export const list = () => {
//     return fetch(`${process.env.REACT_APP_API_URL}/posts`, {
//         method: "GET"
//     })
//         .then(response => {
//             return response.json();
//         })
//         .catch(err => console.log(err));
// };

// with pagination
export const list = page => {
    return fetch(`${process.env.REACT_APP_API_URL}/quotation/?page=${page}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const singleQuotation = quotationId => {
    return fetch(`${process.env.REACT_APP_API_URL}/quotation/${quotationId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listQuotationByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/quotation/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const remove = (quotationId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/quotation/${quotationId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const update = (quotationId, token, quotation) => {
    console.log(quotationId, token, quotation);
    return fetch(`${process.env.REACT_APP_API_URL}/quotation/${quotationId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: quotation
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};



