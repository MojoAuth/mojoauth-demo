# MojoAuth Passkey custom Implementation Guide

To communicate with MojoAuth APIs you will need to set up the MojoAuth Dashboard configurations. Here are the steps to start.

## Getting Credentials

Login to [MojoAuth Dashboard](https://mojoauth.com/dashboard/getting-started)

## Create Project
Create your first project by adding your Website URL and Project Name as displayed in the below screen:


## Grab the API key and Secret 

Get your API credentials, The API key and API secret are used to interact with MojoAuth’s APIs.


## Enable Passkey
From the settings tab on the dashboard.



## Add MojoAuth JavaScript SDK
To start Integrating MojoAuth in your web app, add MojoAuth javascript SDK in the head of your web page and follow the mentioned steps:

```
<script  charset="UTF-8"  src="https://cdn.mojoauth.com/js/mojoauth.min.js">
```

> Update MojoAuth JS SDK URL in Demo file `index.html` and `profile.html`

Create a MojoAuth instance with your API key if you use API implementation and haven’t used our JS framework before.

```
const mojoauth = new MojoAuth("<MojoAuth API Key>")
```

> Update MojoAuth API Key in Demo file `index.html` and `profile.html`

## JavaScript API Reference

### Check Passkey Status

```
var identifier = "<email/phone>";

mojoauth.getPasskeyStatus(identifier).then(response => {
   console.log(response);
});
```


**Response:** 

```
{ "passkey_registered": true }
```


### Register or add a new Passkey Credential
This function is used to create a new set of passkey credentials for the user’s account.

```
var identifier = "<email/phone>";
var accessToken = "<access_token>";

mojoauth.registerPasskey(identifier, accessToken).then(response => {
   console.log(response);
});
```

**Response:** 

```
{
    "authenticated": true,
    "oauth": {
        "access_token": "<access_token>",
        "id_token": "<id_token>",
        "refresh_token": "65***737-****-8e54-****-4a2*****020d-74bf",
        "expires_in": "2024-01-29T14:35:54.802150924Z",
        "token_type": "Bearer"
    },
    "user": {
        "created_at": "2024-01-29T14:35:54.80215071Z",
        "updated_at": "2024-01-29T14:35:54.802150792Z",
        "issuer": "https://www.mojoauth.com",
        "user_id": "65b3********3ee4a211",
        "identifier": "example@example.com"
    }
}
```


### Login with Passkey
This function is used to create a new set of passkey credentials for the user’s account.

```
mojoauth.loginWithPasskey().then(response => {
   console.log(response);
});
```

**Response:**

```
{
    "authenticated": true,
    "oauth": {
        "access_token": "<access_token>",
        "id_token": "<ID Token>",
        "refresh_token": "65***737-****-8e54-****-4a2*****020d-74bf",
        "expires_in": "2024-01-29T14:35:54.802150924Z",
        "token_type": "Bearer"
    },
    "user": {
        "created_at": "2024-01-29T14:35:54.80215071Z",
        "updated_at": "2024-01-29T14:35:54.802150792Z",
        "issuer": "https://www.mojoauth.com",
        "user_id": "65b3********3ee4a211",
        "identifier": "example@example.com"
    }
}
```



### List Passkey Credentials 
This will return all the information of Passkey credentials for the user’s account, i.e., ID, name, last used, etc.

```
var accessToken = "<access_token>";

mojoauth.getPasskeyCredentials(accessToken).then(response => {
   console.log(response);
});

/*
   Along with credentials, It will return the Passkey name in response if available, otherwise no name.
*/
```


**Response:**

```
[
    {
        "id": "F9**********h53Cr********MqkY********Ak",
        "name": "passkey123",
        "public_key": "pQ*****************PGPzGjJs7****************KnrAXIlg**********",
        "attestation_type": "none",
        "aaguid": "*******",
        "last_used_at": "2024-01-30T15:44:58.628Z",
        "created_at": "2024-01-30T07:40:02.457Z",
        "transports": [
            "internal"
        ],
        "backup_eligible": false,
        "backup_state": false
    }
]
```


Update Passkey Credentials 
To rename the passkey for the account, pass the Passkey ID to Rename the Passkey.

```
var id = "<passkey_id>";
var accessToken = "<access_token>";

mojoauth.updatePasskeyCredential(id, accessToken, {name:"<Passkey Name>"}).then(response => {
   console.log(response);
});
```

**Response:** 

```
{ "updated": true }
```

### Delete Passkey Credentials
Use this JS function to remove the registered passkey credentials from the account permanently. 

```
var id = "<passkey_id>";
var accessToken = "<access_token>";

mojoauth.deletePasskeyCredential(id, accessToken).then(response => {
   window.alert(response);
});
```

Response: 
```
{ "updated": true }

```
Note: The Passkey javascript will work only when used with HTTPS or on the localhost hostname (in this case HTTPS is not required), Passkey JS does not support IP addresses.

