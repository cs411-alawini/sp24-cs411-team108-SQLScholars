
export function apiResponse(message: string, statusCode: number, data, res){  

    console.log(message, data);
    const response = {
        status: statusCode,
        message: message,
        data: data
    };

    if (res.isInternalCall)
        return response;
    else
        return res.status(statusCode).json(response);
}
