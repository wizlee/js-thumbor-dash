import fetch from 'node-fetch';
import Dash from 'dash';
import bs58 from 'bs58';
import { generateUploadURL } from "../url/url.js";
import { createDocProperties } from './upload.js';


/**
 * Updates an image to the thumbor_dash server
 * @param {*} image - image binary data
 * @param {*} server - server address [ip:port]
 * @param {*} params - document data 
 */

export async function updateImage(image, masternode, params) {

    const uploadUrl = generateUploadURL(masternode);

    fetch(
        uploadUrl, {
        method: 'POST',
        body: image,
    })
        .then(async (response) => {
            const avatarUrl = uploadUrl.split("/image")[0] + response.headers.get("location");

            try {
                return await updateDocument(avatarUrl, params);
            } catch (err) {
                return console.error(err);
            }
        }
        )
        .catch((err) => console.error(err));
}

async function updateDocument(avatarUrl, params) {
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

    const updateThumbnailDocument = async function () {

        const [document] = await client.platform.documents.get(
            'thumbnailContract.thumbnailField',
            {
                limit: 1,
                where: [
                    ['ownerId', '==', params.ownerId],
                    ['$updatedAt', '>=', params.updatedAt],
                ],
                orderBy: [
                    ['$updatedAt', 'desc'],
                ],
            },
        );

        const { platform } = client;
        const identity = await platform.identities.get(params.ownerId);

        // Update document
        document.set('field', avatarUrl);

        // Sign and submit the document replace transition
        return platform.documents.broadcast({ replace: [document] }, identity);
    };

    return updateThumbnailDocument()
        .then((d) => console.log(d))
        .catch((e) => console.error('Something went wrong:\n', e))
        .finally(() => client.disconnect());
}
