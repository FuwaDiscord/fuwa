import { SubscriptionBuilder } from '@fuwa/events';
import { EventEmitter } from 'stream';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';

export class BaseManager<
  T extends { id: Snowflake; _deserialise(data: any): T }
> extends EventEmitter {
  public cache: Map<Snowflake, T> = new Map();

  public get size(): number {
    return this.cache.size;
  }

  constructor(public client: Client, public __class: any) {
    super();
  }

  public get(id: T['id']): T | undefined {
    return this.cache.get(id);
  }

  public add(data: T) {
    this.cache.set(data.id, data);
    return data;
  }

  public addMany(data: T[]): T[] {
    for (const d of data) {
      this.add(d);
    }
    return data;
  }

  public update(data: T): T {
    this.add(data);
    return data;
  }

  public remove(id: Snowflake) {
    this.cache.delete(id);
  }

  public map(fn: (data: T, key: Snowflake, cache: Map<Snowflake, T>) => any) {
    return Array.from(this.cache.entries()).map(
      (([key, data]: [Snowflake, T]) => fn(data, key, this.cache)).bind(this)
    );
  }

  public resolve(data: Snowflake | any) {
    if (typeof data === 'string') {
      return this.get(data as T['id']);
    } else {
      if (this.cache.has(data.id)) {
        return this.update(this.get(data.id)!._deserialise(data));
      } else {
        return this.add(new this.__class(this.client)._deserialise(data));
      }
    }
  }

  public event(name: string) {
    return new SubscriptionBuilder(name, this);
  }

  public isManager = true;
}
