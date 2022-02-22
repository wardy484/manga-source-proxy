
import axios, { Method } from 'axios';
import { CheerioAPI } from 'cheerio';

interface RequestManagerOptions {
    requestsPerSecond: number,
    requestTimeout: number,
}

interface Request {
    url: string,
    method: Method,
    param?: string,
    headers?: Record<string, string>,
    data?: string
}

class RequestManager {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    private requestsPerSecond: number;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    private requestTimeout: number;
    
    constructor(options: RequestManagerOptions) {
        this.requestTimeout = options.requestTimeout;
        this.requestsPerSecond = options.requestsPerSecond;
    }

    async schedule(
        request: Request,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _retries: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        let url = request.url;

        if (request.param) {
            url += request.param;
        }
        
        return await axios(
            url,
            {
                method: request.method,
                headers: request.headers ?? {},
                data: request.data,
            }
        )
    }
}

export abstract class Source {
    protected cheerio: CheerioAPI;
    protected requestManager?: RequestManager;

    constructor(cheerio: CheerioAPI) {
        this.cheerio = cheerio;
    }

    createRequestManager(options: RequestManagerOptions): RequestManager {
        return new RequestManager(options);
    }

    createRequestObject(request: Request): Request {
        return { ...request };
    }



}