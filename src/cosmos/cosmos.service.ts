import { Injectable } from '@nestjs/common';
import { Container, CosmosClient, Database } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CosmosService {
    database: Database;
    constructor(private readonly configService: ConfigService) {
        const client = new CosmosClient({
            endpoint: this.configService.get('COSMOS_ENDPOINT'),
            key: this.configService.get('COSMOS_KEY'),
        })
        this.database = client.database(this.configService.get('COSMOS_DATABASE'));
    }

    users(): Container {
        return this.database.container('users');
    }

    userAddresses(): Container {
        return this.database.container('useraddresses');
    }

    userVips(): Container {
        return this.database.container('uservips');
    }

    userSubscriptions(): Container {
        return this.database.container('usersubscriptions');
    }
}
