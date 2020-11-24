export class User {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    authenticationToken: string;
    authenticationDate: number;
    authenticationExpires: number;
}

export class OauthUser {
    authenticationDate: number;
    authenticationMethod: string;
    credentialType: string;
    givenName: string;
    id: string;
    mail: string;
    oauthClientId: string;
    service: string;
    sn: string;
    successfulAuthenticationHandlers: string;
    userId: string;
}
