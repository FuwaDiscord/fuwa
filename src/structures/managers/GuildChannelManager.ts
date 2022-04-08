import { Routes } from 'discord-api-types/v10';
import { Snowflake } from '../../client/ClientOptions';
import { Guild } from '../Guild';
import { GuildChannel, GuildChannels } from '../GuildChannel';
import { ChannelManager } from './ChannelManager.js';

export class GuildChannelManager extends ChannelManager<GuildChannels> {
  constructor(public guild: Guild) {
    super(guild.client, GuildChannel);
  }

  public fetch(id: Snowflake): Promise<GuildChannels> {
    return this.client.http
      .queue({
        route: Routes.channel(id),
      })
      .then((data) => this.resolve(data)!);
  }

  public resolve(data: any): GuildChannels | undefined {
    if (typeof data === 'string') {
      return this.get(data as Snowflake);
    } else {
      if (this.cache.has(data.id)) {
        return this.update(this.get(data.id)!._deserialise(data));
      } else {
        return this.add(GuildChannel.resolve(this.client, data, this.guild));
      }
    }
  }

  public add(data: GuildChannels): GuildChannels {
    super.add(data);
    this.client.channels.add(data);
    return data;
  }
}
