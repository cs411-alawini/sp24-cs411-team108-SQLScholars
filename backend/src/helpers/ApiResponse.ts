
export function apiResponse(message: string, statusCode: number, data, res){  

    const response = {
        status: statusCode,
        message: message,
        data: data
    };

    console.log(response);

    if (res.isInternalCall)
        return response;
    else
        return res.status(statusCode).json(response);
}
