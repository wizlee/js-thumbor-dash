
/**
 * Returns a valid thumbor_dash request URL
 * 
 * @param {*} masternode - the address of a masternode (ip:port)
 * @returns 
 */
export function generateUploadURL(masternode) {
    const uploadURL = `http://${masternode}/image`;
    return uploadURL;
}

