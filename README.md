# js-thumbor-dash

Universal JavaScript library for integrating Dash's distributed image thumbnail service in client applications

## Installation

```
npm install git+https://github.com/mayoreee/js-thumbor-dash.git
```

## Usage

#### Upload Image

```js
import { ThumbnailClient } from 'js-thumbor-dash';

const options = {
  network: 'testnet',
  masternode: 'localhost:8888', // Server address [ip:port]
  contractId: 'DbBHu3Ct1zD1AYAiw58V7QXT22B3k7qRLDLfaXqiRQp5',
  documentType: 'thumbnailField',
  mnemonic: '< Insert mnemonic >', // Owner's wallet mnemonic
  ownerId: '< Insert owner identity >', // Owner's identity
  image: '< Insert image Buffer data >', // Image is a Buffer type
  resizeValues: [minWidth, minHeight, maxWidth, maxHeight], // Image resize constraints
};

const client = new ThumbnailClient(options);

try {
  const res = await client.upload();
  console.log(res.toJSON()));
} catch (err) {
  console.error(err);
}
```

#### Retrieve Image

```js
import { ThumbnailClient } from 'js-thumbor-dash';

const options = {
  network: 'testnet',
  masternode: 'localhost:8888', // Server address [ip:port]
  contractId: 'DbBHu3Ct1zD1AYAiw58V7QXT22B3k7qRLDLfaXqiRQp5',
  documentType: 'thumbnailField',
  ownerId: '< Insert owner identity >', // Owner's identity
  updatedAt: 10292902020, // Integer timestamp
  requesterId: '< Insert requester identity >', // Requester's identity
  requesterPubKey: '< Insert requester public key>' // Requester public key
  width: 1200 // Image resize width
  height: 800 // Image resize height
};

const client = new ThumbnailClient(options);

try {
  const res = await client.retrieve();
  console.log(res.toJSON());
} catch (err) {
  console.error(err);
}
```

#### Update Image

```js
import { ThumbnailClient } from 'js-thumbor-dash';

const options = {
  network: 'testnet',
  masternode: 'localhost:8888', // Server address [ip:port]
  contractId: 'DbBHu3Ct1zD1AYAiw58V7QXT22B3k7qRLDLfaXqiRQp5',
  mnemonic: '< Insert mnemonic >', // Owner's wallet mnemonic
  ownerId: '< Insert owner identity >', // Owner's identity
  updatedAt: 10292902020, // Integer timestamp
  image: '< Insert new image Buffer data >', // Image is a Buffer type
};

const client = new ThumbnailClient(options);

try {
  const res = await client.update();
  console.log(res.toJSON());
} catch (err) {
  console.error(err);
}
```
