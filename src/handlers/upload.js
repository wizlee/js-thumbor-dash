import fetch from 'node-fetch';
import Dash from 'dash';
import bs58 from 'bs58';
import { generateUploadURL } from "../url/url.js";


/**
 * Uploads an image to the thumbor_dash server
 * @param {*} image - image binary data
 * @param {*} server - server address [ip:port]
 * @param {*} params - document data [contractId, ownerId]
 */

export async function uploadImage(image, masternode, params) {

    const uploadUrl = generateUploadURL(masternode);

    fetch(
        uploadUrl, {
        method: 'POST',
        body: image,
    })
        .then(async (response) => {
            const avatarUrl = uploadUrl.split("/image")[0] + response.headers.get("location");

            try {
                const docProperties = await createDocProperties(avatarUrl, params);
                return await submitDocument(docProperties, params);
            } catch (err) {
                return console.error(err);
            }
        }
        )
        .catch((err) => console.error(err));
}



/**
 * Creates thumbnail document properties
 * @param {*} avatarUrl - thumbnail image url
 * @param {*} params - document data [contractId, ownerId]
 */
async function createDocProperties(avatarUrl, params) {

    if (typeof params.ownerId === 'undefined') {
        console.error("missing required data for ownerId");
        return;
    }

    const docProperties = {
        ownerId: Buffer.from(bs58.decode(params.ownerId)),
        contractId: params.contractId ? params.contractId : "Bw7U7xUiwoE5wkkrJxbBLdf442TiY63SDvCDZLNrzTHr",
        documentType: params.documentType ? params.documentType : "thumbnailField",
        field: avatarUrl,
        resizeValues: Array.from(params.resizeValues ? params.resizeValues : [1, 1, 1200, 800]),
    };
    return docProperties;
}



/**
 * Submits thumbnail document to Platform
 * @param {*} avatarUrl - thumbnail image url
 * @param {*} params - document data [contractId, ownerId]
 */
async function submitDocument(docProperties, params) {

    const clientOpts = {
        network: params.network ? params.network : 'testnet',
        wallet: {
            mnemonic: params.mnemonic,
            unsafeOptions: {
                skipSynchronizationBeforeHeight: 650000, // only sync from early-2022
            },
        },
        apps: {
            thumbnailContract: {
                contractId: params.contractId ? params.contractId : "Bw7U7xUiwoE5wkkrJxbBLdf442TiY63SDvCDZLNrzTHr",
            },
        },
    };

    const client = new Dash.Client(clientOpts);

    const submitThumbnailDocument = async () => {
        const { platform } = client;
        const identity = await platform.identities.get(params.ownerId);

        // Create the thumbnail document
        const thumbnailDocument = await platform.documents.create(
            'thumbnailContract.thumbnailField',
            identity,
            docProperties,
        );

        const documentBatch = {
            create: [thumbnailDocument], // Document(s) to create
            replace: [],            // Document(s) to update
            delete: [],             // Document(s) to delete
        };
        // Sign and submit the document(s)
        return platform.documents.broadcast(documentBatch, identity);
    };

    return submitThumbnailDocument()
        .then((d) => console.log(d))
        .catch((e) => console.error('Something went wrong:\n', e))
        .finally(() => client.disconnect());
}