const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");


class AWSSecretsManager {
    constructor() {
        this.client = new SecretsManagerClient()
    }
    
    async getSecretKey(secretName) {
        const res = await this.client.send(
            new GetSecretValueCommand({ SecretId: secretName })
        );

        return res.SecretString;
    }
}


module.exports = AWSSecretsManager