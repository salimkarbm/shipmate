/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 * @param {boolean} success Status of the request
 */
interface ClientResponse {
    message: string;
    error?: string;
    data?: any;
    success?: boolean;
}

export const response = ({ success, message, error, data }: ClientResponse) => {
    return {
        success: success == null ? true : success,
        message: formatMessage(message),
        error: formatMessage(error),
        count: typeof data === 'object' ? data.length : undefined,
        data: data || undefined,
    };
};

export const formatMessage = (str: string | undefined): string => {
    if (!str) return '';
    // Make first letter capitial
    return str.charAt(0).toUpperCase() + str.slice(1);
};
