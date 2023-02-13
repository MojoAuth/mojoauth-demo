// ./index.ts

/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * An example Express server showing off a simple integration of @simplewebauthn/server.
 *
 * The webpages served from ./public use @simplewebauthn/browser.
 */

// import https from 'https';
// import http from 'http';
// import fs from 'fs';

import express from 'express';
import dotenv from 'dotenv';
import base64url from 'base64url';
import cors from "cors";
import {v4 as uuidv4} from "uuid"

dotenv.config();

import {
  // Registration
  generateRegistrationOptions,
  verifyRegistrationResponse,
  // Authentication
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifyAuthenticationResponseOpts,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';

import type {
  RegistrationCredentialJSON,
  AuthenticationCredentialJSON,
  AuthenticatorDevice,
} from '@simplewebauthn/typescript-types';

import { LoggedInUser } from './example-server';

const app = express();

const {
  ENABLE_CONFORMANCE,
  ENABLE_HTTPS,
  RP_ID,
} = process.env;

app.use(express.static('./public/'));
app.use(express.json());
app.use(cors());

/**
 * If the words "metadata statements" mean anything to you, you'll want to enable this route. It
 * contains an example of a more complex deployment of SimpleWebAuthn with support enabled for the
 * FIDO Metadata Service. This enables greater control over the types of authenticators that can
 * interact with the Rely Party (a.k.a. "RP", a.k.a. "this server").
 */
if (ENABLE_CONFORMANCE === 'true') {
  import('./fido-conformance').then(({ fidoRouteSuffix, fidoConformanceRouter }) => {
    app.use(fidoRouteSuffix, fidoConformanceRouter);
  });
}

/**
 * RP ID represents the "scope" of websites on which a authenticator should be usable. The Origin
 * represents the expected URL from which registration or authentication occurs.
 */
export const rpID = RP_ID || 'localhost';
console.log(`RP ID: ${rpID}`);

// This value is set at the bottom of page as part of server initialization (the empty string is
// to appease TypeScript until we determine the expected origin based on whether or not HTTPS
// support is enabled)
export let expectedOrigin = [''];

/**
 * 2FA and Passwordless WebAuthn flows expect you to be able to uniquely identify the user that
 * performs registration or authentication. The user ID you specify here should be your internal,
 * _unique_ ID for that user (uuid, etc...). Avoid using identifying information here, like email
 * addresses, as it may be stored within the authenticator.
 *
 * Here, the example server assumes the following user has completed login:
 */
let loggedInUserId = 'internalUserId';

const inMemoryUserDeviceDB: { [loggedInUserId: string]: LoggedInUser } = {
  [loggedInUserId]: {
    id: loggedInUserId,
    username: "",
    devices: [],
    /**
     * A simple way of storing a user's current challenge being signed by registration or authentication.
     * It should be expired after `timeout` milliseconds (optional argument for `generate` methods,
     * defaults to 60000ms)
     */
    currentChallenge: undefined,
  },
};


/**
 * Registration (a.k.a. "Registration")
 */
app.get('/generate-registration-options', (req, res) => {
  const _username = req.query.username as string;

  loggedInUserId = uuidv4();

  inMemoryUserDeviceDB[loggedInUserId] = {
    id: loggedInUserId,
    username: _username,
    devices: [],
    currentChallenge: undefined,
  };
  
  const user = inMemoryUserDeviceDB[loggedInUserId];  

  const {
    /**
     * The username can be a human-readable name, email, etc... as it is intended only for display.
     */
    username,
    devices,
  } = user;

  const opts: GenerateRegistrationOptionsOpts = {
    rpName: 'SimpleWebAuthn Example',
    rpID,
    userID: loggedInUserId,
    userName: username,
    timeout: 60000,
    attestationType: 'none',
    /**
     * Passing in a user's list of already-registered authenticator IDs here prevents users from
     * registering the same device multiple times. The authenticator will simply throw an error in
     * the browser if it's asked to perform registration when one of these ID's already resides
     * on it.
     */
    excludeCredentials: devices.map(dev => ({
      id: dev.credentialID,
      type: 'public-key',
      transports: dev.transports,
    })),
    /**
     * The optional authenticatorSelection property allows for specifying more constraints around
     * the types of authenticators that users to can use for registration
     */
    authenticatorSelection: {
      userVerification: 'required',
      residentKey: 'required',
    },
    /**
     * Support the two most common algorithms: ES256, and RS256
     */
    supportedAlgorithmIDs: [-7, -257],
  };

  const options = generateRegistrationOptions(opts);

  /**
   * The server needs to temporarily remember this value for verification, so don't lose it until
   * after you verify an authenticator response.
   */
  inMemoryUserDeviceDB[loggedInUserId].currentChallenge = options.challenge;

  res.send(options);
});

app.post('/verify-registration', async (req, res) => {
  const body = req.body;
  const id = req.body.id as string;
  const registration: RegistrationCredentialJSON = body.attestationResponse;

  const user = inMemoryUserDeviceDB[id];

  const expectedChallenge = user.currentChallenge;

  let verification: VerifiedRegistrationResponse;
  try {
    const opts: VerifyRegistrationResponseOpts = {
      credential: registration,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true,
    };
    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    const _error = error as Error;
    console.error(_error);
    return res.status(400).send({ error: _error.message });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const existingDevice = user.devices.find(device => device.credentialID.equals(credentialID));

    if (!existingDevice) {
      /**
       * Add the returned device to the user's list of devices
       */
      const newDevice: AuthenticatorDevice = {
        credentialPublicKey,
        credentialID,
        counter,
        transports: registration.transports,
      };
      user.devices.push(newDevice);
    }
  }

  res.send({ verified });
});

/**
 * Login (a.k.a. "Authentication")
 */
app.get('/generate-authentication-options', (req, res) => {
  const username = req.query.username as string;
  
  // get user by username
  const user = Object.values(inMemoryUserDeviceDB).find(user => user.username === username) as LoggedInUser;

  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    allowCredentials: user.devices.map(dev => ({
      id: dev.credentialID,
      type: 'public-key',
      transports: dev.transports,
    })),
    userVerification: 'required',
    rpID,
  };

  const options = generateAuthenticationOptions(opts);

  /**
   * The server needs to temporarily remember this value for verification, so don't lose it until
   * after you verify an authenticator response.
   */
  inMemoryUserDeviceDB[loggedInUserId].currentChallenge = options.challenge;

  res.send(options);
});

app.post('/verify-authentication', async (req, res) => {
  const body = req.body;
  const username = body.username as string;
  const authentication: AuthenticationCredentialJSON = body.assertionResponse;

  // get user by username
  const user = Object.values(inMemoryUserDeviceDB).find(user => user.username === username) as LoggedInUser;

  const expectedChallenge = user.currentChallenge;

  let dbAuthenticator;
  const bodyCredIDBuffer = base64url.toBuffer(authentication.rawId);
  // "Query the DB" here for an authenticator matching `credentialID`
  for (const dev of user.devices) {
    if (dev.credentialID.equals(bodyCredIDBuffer)) {
      dbAuthenticator = dev;
      break;
    }
  }

  if (!dbAuthenticator) {
    return res.status(400).send({ error: 'Authenticator is not registered with this site' });
  }

  let verification: VerifiedAuthenticationResponse;
  try {
    const opts: VerifyAuthenticationResponseOpts = {
      credential: authentication,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: dbAuthenticator,
      requireUserVerification: true,
    };
    verification = await verifyAuthenticationResponse(opts);
  } catch (error) {
    const _error = error as Error;
    console.error(_error);
    return res.status(400).send({ error: _error.message });
  }

  const { verified, authenticationInfo } = verification;

  if (verified) {
    // Update the authenticator's counter in the DB to the newest count in the authentication
    dbAuthenticator.counter = authenticationInfo.newCounter;
  }

  res.send({ verified,  user});
});

app.get('/user', (req, res) => {
  try {
    const id = req.query.id as string;
    const user = inMemoryUserDeviceDB[id];
    console.log({user});
    if(!user) throw new Error('User not found')
    res.send(user);
  } catch (error) {
    console.log({error});
    res.status(400).json(error);
  }
});

// if (ENABLE_HTTPS) {
//   const host = '0.0.0.0';
//   const port = 443;
//   expectedOrigin = [`https://${rpID}`];

//   https
//     .createServer(
//       {
//         /**
//          * See the README on how to generate this SSL cert and key pair using mkcert
//          */
//         key: fs.readFileSync(`./${rpID}.key`),
//         cert: fs.readFileSync(`./${rpID}.crt`),
//       },
//       app,
//     )
//     .listen(port, host, () => {
//       console.log(`🚀 Server ready at ${expectedOrigin} (${host}:${port})`);
//     });
// } else {
//   const host = '127.0.0.1';
//   const port = 8000;
//   expectedOrigin = [`http://localhost:${port}`, `http://localhost:4200`];

//   app.listen(port, () => {
//     console.log(`🚀 Server ready at ${expectedOrigin} (${host}:${port})`);
//   });
// }

const port = 8000;
expectedOrigin = [`http://localhost:${port}`, `http://localhost:4200`, `https://passkeys-angular.netlify.app`];

app.listen(port, () => {
  console.log(`🚀 Server ready at ${expectedOrigin} (port ${port})`);
});
