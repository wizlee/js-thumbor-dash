
/**
 * Returns a valid thumbor_dash request URL
 * 
 * @param {*} server - the server address (ip:port)
 * @returns 
 */
export function generateUploadURL(server) {
    const _uploadURL = `http://${server}/image`;
    return _uploadURL;
}

