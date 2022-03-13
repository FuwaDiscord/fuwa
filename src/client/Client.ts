import { RequestManager } from '../rest/RequestManager.js';
import { RESTClient } from '../rest/RESTClient';
import {
  ClientOptions,
  DefaultClientOptions,
  resolveIntents,
} from './ClientOptions';
import { APIGatewayBotInfo, Routes } from '@splatterxl/discord-api-types';
import EventEmitter from 'events';
import { GatewayShard } from '../ws/GatewayShard.js';
import { GuildManager } from '../structures/managers/GuildManager.js';
import { ILogger } from '../logging/ILogger.js';
import { DisabledLogger } from '../logging/DisabledLogger.js';
import { DefaultLogger } from '../logging/DefaultLogger.js';
import {
  DefaultLoggerOptions,
  LoggerOptions,
} from '../logging/LoggerOptions.js';
import { UserManager } from '../structures/managers/UserManager.js';
import { ExtendedUser } from '../structures/ExtendedUser.js';
import { ChannelManager } from '../structures/managers/ChannelManager.js';
import { SubscriptionBuilder } from '@fuwa/events';

export class Client extends EventEmitter {
  #token: string;
  public http: RequestManager;
  public options: Required<ClientOptions>;

  public logger: ILogger;

  public ws?: GatewayShard;

  public guilds: GuildManager;
  public users: UserManager;
  public channels: ChannelManager;

  public user: ExtendedUser | null = null;

  public constructor(token: string, options?: ClientOptions) {
    super();

    this.options = Object.assign(
      DefaultClientOptions,
      options
    ) as Required<ClientOptions>;
    this.options.intents = resolveIntents(this.options.intents!);
    this.#token = token;
    this.http = new RequestManager(
      new RESTClient(
        RESTClient.createRESTOptions(this.options, this.#token, 'Bot')
      ),
      this
    );

    if (!this.options.logger) {
      this.logger = new DisabledLogger();
    } else if (typeof this.options.logger === 'boolean') {
      this.logger = new DefaultLogger(DefaultLoggerOptions);
    } else if (!('warn' in this.options.logger)) {
      this.logger = new DefaultLogger(this.options.logger as LoggerOptions);
    } else {
      this.logger = this.options.logger;
    }

    this.guilds = new GuildManager(this);
    this.users = new UserManager(this);
    this.channels = new ChannelManager(this);
  }

  public async connect(): Promise<void> {
    let gatewayInfo: APIGatewayBotInfo;

    if (!process.env.__FUWA_SHARD_ID) {
      gatewayInfo = await this.http
        .queue({
          route: Routes.gatewayBot(),
        })
        .then((res) => res.body.json());
    } else {
      gatewayInfo = {
        shards: +process.env.__FUWA_SHARD_COUNT!,
        session_start_limit: {
          remaining: 1,
          reset_after: -1,
          total: Infinity,
          max_concurrency: +process.env.__FUWA_SHARD_CONCURRENCY!,
        },
        url: process.env.__FUWA_GATEWAY_URL!,
      };
    }

    if (gatewayInfo.shards > 1 && !process.env.__FUWA_SHARD_COUNT)
      throw new Error(
        'Discord has recommended to use shards for this user but no shard information was found. Consider using a ShardingManager.'
      );

    const url = this.constructGatewayURL(gatewayInfo.url);
    const shard: [id: number, total: number] = [
      +(process.env.__FUWA_SHARD_ID ?? 0),
      +(gatewayInfo.shards ?? 1),
    ];

    this.debug(
      `
[${this.logger.kleur().blue('WS')} => ${this.logger
        .kleur()
        .green('Manager')}] connecting to gateway 
\t url \t:\t ${url}
\t shard \t:\t [${shard.join(', ')}]
`.trim()
    );

    this.ws = new GatewayShard(this, shard, this.#token);

    await this.ws.connect(url);
  }

  private constructGatewayURL(url: string) {
    return `${url}?v=${this.options.apiVersion}&encoding=${
      this.options.etf ? 'etf' : 'json'
    }`;
  }

  public debug(...data: any[]) {
    this.logger.debug(...data);
  }

  public delegate(event: `${string}.${string}`, ...data: any[]) {
    const [scope, name] = event.split('.');

    switch(scope) {
      case 'meta':
        this.emit(name, ...data);
        break;
      case 'guilds': {
        if (name.startsWith("members.")) {
          const [, eventName] = name.split('.');
          this.guilds.get(data[0].guild.id)!.members.emit(eventName, ...data);
        } else {
          this.guilds.emit(name, ...data);
          break;
        }
      }
      case 'channels':
        this.channels.emit(name, ...data);
        break;
      case 'users':
        this.users.emit(name, ...data);
        break;
      default:
        this.logger.warn(`Unknown event scope: ${scope}`);
        this.emit(name, ...data);
        break;
    }
  }

  public event(name: string) {
    return new SubscriptionBuilder(name, this);
  }
}

export type Awaitable<T> = Promise<T> | T;
