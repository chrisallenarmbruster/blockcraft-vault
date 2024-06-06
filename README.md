# Blockcraft Vault 🛡️

Blockcraft Vault is my blockchain wallet app for managing [Blockcraft](https://github.com/chrisallenarmbruster/blockcraft) assets using a zero-knowledge encryption scheme 🔐. It is part of my Blockcraft ecosystem for composing blockchains. The server never sees or stores your unhashed user id, password, and data 🤫. It is implemented as a progressive web application (PWA), offering a native app-like experience on all devices 📱. It's ideal for use cases like blockchain wallets, blockchain voting ballots, and more 💼.

[![Blockcraft Vault Composite](/client/public/images/screenshots/composite.png)](https://vault.blockcraft.rev4labs.com)

## Features

- 💼 **Blockchain Asset Management**: Blockcraft Vault allows users to manage their Blockcraft assets directly within the application. This includes viewing, sending, and receiving assets on the blockchain.
- 🕵️‍♂️ **Zero-Knowledge Encryption**: Ensures complete privacy, anonymity, and security by keeping your data and identity inaccessible to the server.
- 🔒 **User Authentication**: Secure login and user management with encrypted credentials. The server never sees your unhashed email id and password.
- 🖥️ **Client-Side Encryption/Decryption**: Encrypts and decrypts data on the client side, keeping your data private and secure, even from the server.
- 📷 **QR Code Integration**: Incorporates QR code functionality for easy sharing and scanning of public encryption keys.
- 🛠️ **Built on PERN Stack**: Utilizes PostgreSQL, Express, React, and Node.js for robust performance.
- ⚙️ **Efficient State Management**: Employs Redux for managing application state.
- 🌐 **Modern Front-End**: Uses Vite for building and fast refresh with React.
- 📲 **Progressive Web App (PWA) Support**: Blockcraft Vault can be installed and used as a Progressive Web App, allowing users to enjoy a native app-like experience on their devices.

## Working Demo

Check out the [Blockcraft Vault Demo](https://vault.blockcraft.rev4labs.com)

## Screenshots

### Review Assets (Desktop View)

![Review Assets](/client/public/images/screenshots/assets-lg.png)

<br>

### Manage Keypairs (PWA View)

![Manage Keypairs](/client/public/images/screenshots/add-keypair-sm-pwa.png)

<br>

### Scan and View QR Codes (Mobile Browser View)

![Scan QR Codes](/client/public/images/screenshots/qr-code-sm-composite-frame.png)

<br>

### Send Assets

![Send Assets](/client/public/images/screenshots/send-modal.png)

<br>

## Installation 📦

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL
- Blockcraft Node: **Make sure you have at least one Blockcraft Node accessible.** The Blockcraft Vault interacts with the API provided by Blockcraft Nodes to access the node's blockchain. Check out [Blockcraft Coin Demo](https://github.com/chrisallenarmbruster/blockcraft-coin-demo) for an example project that spins up Blockcraft Nodes and provisions a cryptocurrency blockchain on them.

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/chrisallenarmbruster/blockcraft-vault.git
   ```

2. **Install dependencies:**

   ```sh
   #From the project root:
   npm install
   ```

3. **Set up the environment variables:**
   Create a `.env` file in the server directory and configure it with your database credentials and other necessary configurations. Alternatively, you can also set environment variables directly in your development or production environment.

   ```sh
   DATABASE_URL=postgres://localhost/blockcraft-vault
   PORT=8000 <!-- Or any other port you want to use -->
   SESSION_SECRET=awesome_secret
   VITE_BLOCKCRAFT_NODE_URL=https://node1.yourblockchain.com <!-- Replace with your Blockcraft Node URL -->
   ```

4. **Create the database:**

   ```sh
   psql -U postgres

   CREATE DATABASE "blockcraft-vault";

   \q
   ```

5. **Set up HTTPS:**
   <br>
   **In Development:**

   This project uses Vite's proxy to provide HTTPS in development. The encryption libraries, clipboard and camera functionality require it. To set this up, you can generate a key pair and place them in the `client` directory.

   You can generate a self-signed key pair using OpenSSL. Open a new terminal and run the following commands:

   ```sh
   openssl req -x509 -newkey rsa:4096 -keyout vault-key.pem -out vault-cert.pem -days 365 -nodes
   ```

   After generating the key pair, move them to the `client` directory:

   Vite is now configured to use these files for HTTPS in development.

   Note: You will need to do to configure Vite proxy and set up keys like this if the Blockcraft node hosting the blockchain you are interacting with is running in a development environment. Browsers do not like making requests to insecure servers from secure ones.
   <br>
   **In Production:**
   In production, you will need to set up a reverse proxy like Nginx to serve the client and server on the same port and secure it with HTTPS. You can use a service like Let's Encrypt to get a free SSL certificate.
   <br>

## Usage 🔧

### Running the Application

To run the application, follow these instructions:

**In Development:**

```sh
#From the project root:
npm run dev
```

Vite will serve the client on `https://localhost:8080` and will proxy api requests to the server on `http://localhost:8000`. You can also access as `https://<your-ip-address>:8080` if you want to access the application from another device.

**In Production:**

```sh
#From the project root:
npm run prod
```

This will build the client and start the server in production mode. Due to the HTTPS requirement, you will need to use a reverse proxy like Nginx to serve the client and server on the same port and secure it with HTTPS. Assuming you've set this up right you can access the application at `https://<your app domain or IP address>`.

### Interacting with the Application

1. **Register and Login**<br>
   **Navigate** to the application URL. In **Development Mode**, Vite will serve the client on `https://localhost:8080` and will proxy api requests to the server on `http://localhost:8000`. You can also access as `https://<your-ip-address>:8080` if you want to access the application from another device. In **Production Mode**, assuming you've set up a domain and reverse proxy with HTTPS, you can access the application at `https://<your app domain or IP address>`.
   **Register:** Fill in your email and password to create a new account. The server never sees your unhashed email ID and password.
   **Login:** Enter your credentials to log in securely.
   <br>

2. **Asset View**
   Dashboard: After logging in, you will be directed to the dashboard where you can view your assets.
   Asset Details: Click on an asset to view detailed information, including transaction history and current value.
   <br>

3. **Managing Keypairs**
   **Generate Keypairs:** Create new encryption keypairs for securing your assets and transactions.
   **Import Keypairs:** Import existing keypairs using QR codes or manual entry.
   **Export Keypairs:** Export your keypairs via the clipboard or QR codes.
   <br>

4. **Managing Your Contacts (or Address List)**
   **Add Contacts:** Add new contacts to your address list by entering or scanning their public keys.
   **Edit Contacts:** Update the details of existing contacts.
   **Delete Contacts:** Remove contacts that are no longer needed.
   <br>

5. **Sending Assets**
   **Initiate Transfer:** Select the keypair you wish to send from, select the contact to send to, and specify the amount. Click on the "Send" button to initiate the transfer. Your private key will be used to sign the transaction securely.
   **Review** the transaction details.
   <br>

6. **Receiving Assets**
   **Receive Address:** Share your public key address with the sender (viewable as a QR code or text with clipboard functionality).
   **Review** the transaction details in the Asset view.

## Engineers

### [🧑 Chris Armbruster](https://github.com/chrisallenarmbruster)

## License

Copyright (c) 2023 Rev4Labs

This project is MIT licensed.
