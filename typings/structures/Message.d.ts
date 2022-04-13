import { BaseStructure } from './templates/BaseStructure';
import { APIMessage, MessageType } from 'discord-api-types/v10';
import { Snowflake } from '../client/ClientOptions';
import { User } from './User';
import { ExtendedUser } from './ExtendedUser';
import { MessageFlags } from '../util/bitfields/MessageFlags';
import { TextChannel } from './templates/BaseTextChannel';
import { MessageAttachment } from './MessageAttachment';
import { FileResolvable } from '../util/resolvables/FileResolvable';
import { MessagePayload } from '../util/resolvables/MessagePayload';
import { APIRequest } from '../rest/APIRequest';
export declare class Message<ChannelType extends TextChannel = TextChannel> extends BaseStructure<APIMessage> {
    nonce: string | number | null;
    guildId: Snowflake | null;
    get guild(): import("./Guild").Guild | null;
    channelId: Snowflake;
    get channel(): ChannelType;
    tts: boolean;
    type: MessageType;
    flags: MessageFlags;
    pinned: boolean;
    author: User | ExtendedUser;
    get member(): import("./GuildMember").GuildMember | null;
    content: string;
    get createdTimestamp(): number;
    get createdAt(): Date;
    timestamp: number;
    editedTimestamp: number | null;
    get editedAt(): Date | null;
    attachments: MessageAttachment[];
    _deserialise(data: APIMessage): this;
    _modify(data: Partial<APIMessage> | APIRequest): Promise<this>;
    fetchMember(): Promise<import("./GuildMember").GuildMember | null>;
    edit(content: string | MessagePayload): Promise<this>;
    delete(): Promise<void>;
    setFlags(flags: MessageFlags | number): Promise<this>;
    suppressEmbeds(suppress: boolean): Promise<this>;
    removeAttachments(): Promise<this>;
    attach(...files: (FileResolvable | MessageAttachment)[] | [(FileResolvable | MessageAttachment)[]]): Promise<this>;
    toJSON(): APIMessage;
}
