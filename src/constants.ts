import { Snowflake } from 'discord-api-types';
import fs from 'fs';
import path from 'path';
import { ImageFormat, ImageSize } from './types';
const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);
export const CONSTANTS = {
  urls: {
    base: 'https://discord.com/api/v9',
    getGatewayBot: '/gateway/bot',
    socketUrl: `wss://gateway.discord.gg/?v=9&encoding=json`,
    cdn: {
      base: 'https://cdn.discordapp.com',
      avatar(hash: string, format: ImageFormat, size: ImageSize): string {
        return `${this.base}/avatars/${hash}.${format}${
          size ? `?size=${size}` : ''
        }`;
      },
      defaultAvatar(disc: number): string {
        return `${this.base}/embed/avatars/${disc % 5}.png`;
      },
    },
    message(channelid: Snowflake, id: Snowflake): string {
      return `${this.channelMessages(channelid)}/${id}`;
    },
    channelMessages(channelid: Snowflake): string {
      return `${this.base}/channels/${channelid}/messages`;
    },
  },
  api: {
    version: 'v9',
    userAgent: `DiscordBot (https://github.com/nearlySplat/fuwa, ${version}) Fuwa/${version} Node.js/${process.version}`,
    gatewayProperties: {
      $os: process.platform,
      $browser: 'fuwa',
      $device: 'fuwa',
    },
    headers: {
      get 'User-Agent'(): string {
        return CONSTANTS.api.userAgent;
      },
    },
  },
  getUrl(str: string): string {
    if (str in this.urls === false) return this.urls.base;
    return this.urls.base + this.urls[str as keyof typeof CONSTANTS.urls];
  },
};

export const ERRORS = {
  NO_TOKEN: new TypeError('An invalid token was provided for the client.'),
  NO_INTENTS: new TypeError('No intents were provided for the Client.'),
  SHARDING: new TypeError('Sharding is not supported by Fuwa.'),
  IDENTIFY_LIMIT: new RangeError(
    'Your client has exceeded the 1000 daily log-in limit.'
  ),
  BASE_CLASS_USAGE: new Error('A base class was instantiated.'),
};

export type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'get'
  | 'head'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace';

export type InteractionType =
  | 'ping'
  | 'applicationCommand'
  | 'messageComponent';
