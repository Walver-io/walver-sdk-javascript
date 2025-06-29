import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface CustomField {
  type: string;
  [key: string]: any;
}

interface VerificationOptions {
  id: string;
  service_name: string;
  chain: string;
  internal_id?: string;
  webhook?: string;
  expiration?: string | Date;
  secret?: string;
  redirect_url?: string;
  one_time?: boolean;
  folder_id?: string;
  custom_fields?: CustomField[];
  token_gate?: boolean;
  token_address?: string;
  token_amount?: number;
  is_nft?: boolean;
  force_email_verification?: boolean;
  force_telegram_verification?: boolean;
  force_twitter_verification?: boolean;
  force_telephone_verification?: boolean;
  force_discord_verification?: boolean;
}

export class Walver {
  private apiKey: string;
  private baseUrl: string;
  private client: AxiosInstance;

  constructor(apiKey?: string, baseUrl: string = 'https://walver.io/', timeout: number = 10000) {
    if (!apiKey) {
      apiKey = process.env.WALVER_API_KEY;
      if (!apiKey) {
        throw new Error('API key is required. Either pass it as an argument or set the WALVER_API_KEY environment variable in .env file');
      }
    }
    
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: timeout,
      headers: {
        'X-API-Key': this.apiKey
      }
    });
  }

  private async _get(path: string, params?: Record<string, any>): Promise<any> {
    const response = await this.client.get(path, { params });
    return response.data;
  }

  private async _post(path: string, data?: Record<string, any>): Promise<any> {
    const response = await this.client.post(path, data);
    return response.data;
  }

  private async _delete(path: string, params?: Record<string, any>): Promise<any> {
    const response = await this.client.delete(path, { params });
    return response.data;
  }

  public async createFolder(name: string, description?: string, customFields?: CustomField[]): Promise<any> {
    const data = {
      name,
      description,
      custom_fields: customFields || []
    };
    return this._post('/creator/folders', data);
  }

  public async getFolders(): Promise<any[]> {
    return this._get('/creator/folders');
  }

  public async getFolder(folderId: string): Promise<any> {
    return this._get(`/creator/folders/${folderId}`);
  }

  public async getFolderVerifications(folderId: string): Promise<any[]> {
    return this._get(`/creator/folders/${folderId}/verifications`);
  }

  public async createApiKey(name: string, description?: string): Promise<any> {
    const data = {
      name,
      description
    };
    return this._post('/creator/api-keys', data);
  }

  public async getApiKeys(): Promise<any[]> {
    return this._get('/creator/api-keys');
  }

  public async deleteApiKey(apiKeyId: string): Promise<any> {
    return this._delete(`/creator/api-keys/${apiKeyId}`);
  }

  public async createVerification(options: VerificationOptions): Promise<any> {
    const { 
      id, 
      service_name, 
      chain, 
      internal_id,
      webhook,
      expiration,
      secret,
      redirect_url,
      one_time = false,
      folder_id,
      custom_fields = [],
      token_gate = false,
      token_address,
      token_amount,
      is_nft = false,
      force_email_verification = false,
      force_telegram_verification = false,
      force_twitter_verification = false,
      force_telephone_verification = false,
      force_discord_verification = false
    } = options;

    let formattedExpiration = expiration;
    if (expiration instanceof Date) {
      formattedExpiration = expiration.toISOString();
    }

    const data: Record<string, any> = {
      id,
      service_name,
      chain,
      internal_id,
      webhook,
      expiration: formattedExpiration,
      secret,
      redirect_url,
      one_time,
      folder_id,
      custom_fields,
      token_gate,
      token_address,
      token_amount,
      is_nft,
      force_email_verification,
      force_telegram_verification,
      force_twitter_verification,
      force_telephone_verification,
      force_discord_verification
    };

    if (!folder_id && !webhook) {
      throw new Error('If no folder_id is provided, webhook is required');
    }

    // Validation
    if (webhook && !secret) {
      console.warn('Warning: secret is highly recommended when using webhooks');
    }

    if (webhook && !webhook.startsWith('https://')) {
      throw new Error('webhook must start with https://');
    }

    if (token_gate) {
      if (!token_address) {
        throw new Error('token_address is required when using token gate');
      }
      if (!token_amount) {
        throw new Error('token_amount is required when using token gate');
      }
    }

    if (force_email_verification) {
      if (!custom_fields || custom_fields.length === 0) {
        throw new Error('custom_fields[email] is required when using force_email_verification');
      }
      if (!custom_fields.some(field => field.type === 'email')) {
        throw new Error('custom_fields[email] is required when using force_email_verification');
      }
    }

    if (force_telegram_verification) {
      if (!custom_fields || custom_fields.length === 0) {
        throw new Error('custom_fields[telegram] is required when using force_telegram_verification');
      }
      if (!custom_fields.some(field => field.type === 'telegram')) {
        throw new Error('custom_fields[telegram] is required when using force_telegram_verification');
      }
    }

    if (force_twitter_verification) {
      if (!custom_fields || custom_fields.length === 0) {
        throw new Error('custom_fields[twitter] is required when using force_twitter_verification');
      }
      if (!custom_fields.some(field => field.type === 'twitter')) {
        throw new Error('custom_fields[twitter] is required when using force_twitter_verification');
      }
    }

    if (force_telephone_verification) {
      if (!custom_fields || custom_fields.length === 0) {
        throw new Error('custom_fields[telephone] is required when using force_telephone_verification');
      }
      if (!custom_fields.some(field => field.type === 'telephone')) {
        throw new Error('custom_fields[telephone] is required when using force_telephone_verification');
      }
    }

    if (force_discord_verification) {
      if (!custom_fields || custom_fields.length === 0) {
        throw new Error('custom_fields[discord] is required when using force_discord_verification');
      }
      if (!custom_fields.some(field => field.type === 'discord')) {
        throw new Error('custom_fields[discord] is required when using force_discord_verification');
      }
    }

    // Remove undefined values
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    try {
      return await this._post('/new', data);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        throw new Error('ID for the verification already exists. Choose another ID.');
      }
      throw error;
    }
  }
} 