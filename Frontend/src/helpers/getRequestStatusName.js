import requestStatus from "../data/requestStatus"

const getRequestStatusName = (id) => {
    const request = requestStatus?.filter(status => status.Id == id)[0];
    return request?.Name
}

export default getRequestStatusName