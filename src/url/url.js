import crypto from 'crypto';


/**
 * Returns a valid thumbor_dash upload URL
 * 
 * @param {*} masternode - the address of a masternode (ip:port)
 * @returns string
 */
export function generateUploadURL(masternode) {
    const uploadURL = `http://${masternode}/image`;
    return uploadURL;
}


/**
 * Returns a valid thumbor_dash request URL
 * 
 * @param {*} masternode - the address of a masternode (ip:port)
 * @param {*} params - map of request data
 * @returns string
 */
export function generateRequestUrl(masternode, params) {
    const width = params.width;
    const height = params.height;
    const requesterId = params.requesterId;
    const contractId = params.contractId;
    const documentType = params.documentType;
    const field = params.field;
    const ownerId = params.ownerId;
    const updatedAt = params.updatedAt;

    const signature = signUrl(params);
    const encodedUrl = encodeUrl(field);

    const requestURL = `http://${masternode}/${signature}/`
        + `${width}x${height}/`
        + `dashauth:requester(${requesterId}):`
        + `contract(${contractId}):`
        + `document(${documentType}):`
        + `field(${field}):`
        + `owner(${ownerId}):`
        + `updatedAt(${updatedAt})/`
        + `filters:format(jpeg)/`
        + `${encodedUrl}`;
    return requestURL;
}

function signUrl(params) {
    const width = params.width;
    const height = params.height;
    const requesterId = params.requesterId;
    const contractId = params.contractId;
    const documentType = params.documentType;
    const field = params.field;
    const ownerId = params.ownerId;
    const updatedAt = params.updatedAt;
    const requesterPubKey = params.requesterPubKey;

    const operation = `${width}x${height}/`
        + `dashauth:requester(${requesterId}):`
        + `contract(${contractId}):`
        + `document(${documentType}):`
        + `field(${field}):`
        + `owner(${ownerId}):`
        + `updatedAt(${updatedAt})/`
        + `filters:format(jpeg)/`;

    const encodedUrl = encodeUrl(field);
    const imagePath = operation + encodedUrl;

    const signature = crypto
        .createHmac('sha256', requesterPubKey)
        .update(imagePath)
        .digest('base64').replace(/\+/g, '-').replace(/\//g, '_');

    return signature;
}


function encodeUrl(url) {
    return url.toString().replace(/:/g, '%3A');
}

