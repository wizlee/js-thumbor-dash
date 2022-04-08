import { throws } from "assert";
import { expect } from "chai";
import fs from 'fs';
import path from 'path';
import { uploadImage } from "../../src/handlers/upload.js";

const __dirname = path.resolve();

describe('end-to-end integration tests', async () => {
    const documentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../js-thumbor-dash/tests/data/documentData.json")));
    const image = fs.readFileSync(path.resolve(__dirname, "../js-thumbor-dash/tests/data/images/example.jpg"));

    it('should upload image successfully', async () => {

        // TODO: fix test
    });
});