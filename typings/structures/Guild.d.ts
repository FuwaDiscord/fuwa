import { APIGuild, APIUnavailableGuild, GuildDefaultMessageNotifications, GuildExplicitContentFilter, GuildFeature, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, GuildVerificationLevel } from 'discord-api-types/v10';
import { Snowflake } from '../client/ClientOptions';
import { GuildSystemChannelFlags } from '../util/bitfields/GuildSystemChannelFlags';
import { FileResolvable } from '../util/resolvables/FileResolvable.js';
import { GuildChannelManager } from './managers/GuildChannelManager';
import { GuildMemberManager } from './managers/GuildMemberManager';
import { BaseStructure } from './templates/BaseStructure';
export declare class Guild extends BaseStructure<APIGuild | APIUnavailableGuild> {
    available: boolean;
    name: string | null;
    description: string | null;
    ownerId: Snowflake;
    get owner(): import("./ExtendedUser").ExtendedUser | import("./User").User;
    applicationId: Snowflake | null;
    preferredLocale: string;
    features: GuildFeature[];
    mfaLevel: GuildMFALevel;
    nsfwLevel: GuildNSFWLevel;
    verificationLevel: GuildVerificationLevel;
    explicitContentFilter: GuildExplicitContentFilter;
    approximateMemberCount: number;
    approximatePresenceCount: number;
    memberCount: number | null;
    presenceCount: number | null;
    maxMembers: number;
    maxPresences: number;
    maxVideoChannelUsers: number;
    members: GuildMemberManager;
    /** Whether the guild is considered large by Discord. */
    large: boolean;
    icon: string | null;
    banner: string | null;
    splash: string | null;
    discoverySplash: string | null;
    joinedAt?: Date;
    get joinedTimestamp(): number;
    created: Date;
    get createdTimestamp(): number;
    premiumTier: GuildPremiumTier;
    premiumSubscriptionCount: number;
    premiumProgressBarEnabled: boolean;
    defaultMessageNotifications: GuildDefaultMessageNotifications;
    vanityURLCode: string | null;
    afkTimeout: number | null;
    afkChannelId: Snowflake | null;
    widgetEnabled: boolean;
    widgetChannelId: Snowflake | null;
    rulesChannelId: Snowflake | null;
    systemChannelId: Snowflake | null;
    systemChannelFlags: GuildSystemChannelFlags | null;
    publicUpdatesChannelId: Snowflake | null;
    channels: GuildChannelManager;
    /**
     * @internal
     * @private
     */
    _deserialise(data: APIGuild | APIUnavailableGuild): this;
    fetch(force?: boolean): Promise<Guild>;
    edit(data: Partial<APIGuild | Guild>, reason?: string): Promise<this>;
    setIcon(icon: FileResolvable | null, reason?: string): Promise<this>;
    setBanner(banner: FileResolvable | null, reason?: string): Promise<this>;
    setSplash(splash: FileResolvable | null, reason?: string): Promise<this>;
    setDiscoverySplash(splash: FileResolvable | null, reason?: string): Promise<this>;
    setName(name: string, reason?: string): Promise<this>;
    /**
     * @deprecated use {@link VoiceChannel.setRTCRegion} instead
     */
    setRegion(region: string, reason?: string): Promise<this>;
    setAFKTimeout(timeout: number, reason?: string): Promise<this>;
    setAFKChannel(channel: Snowflake, reason?: string): Promise<this>;
    setSystemChannel(channel: Snowflake, reason?: string): Promise<this>;
    setSystemChannelFlags(flags: GuildSystemChannelFlags, reason?: string): Promise<this>;
    setVerificationLevel(level: GuildVerificationLevel, reason?: string): Promise<this>;
    setExplicitContentFilter(filter: GuildExplicitContentFilter, reason?: string): Promise<this>;
    setDefaultMessageNotifications(notifications: GuildDefaultMessageNotifications, reason?: string): Promise<this>;
    setWidgetEnabled(enabled: boolean, reason?: string): Promise<this>;
    setWidgetChannel(channel: Snowflake, reason?: string): Promise<this>;
    setPublicUpdatesChannel(channel: Snowflake, reason?: string): Promise<this>;
    setMaxMembers(max: number, reason?: string): Promise<this>;
    setMaxPresences(max: number, reason?: string): Promise<this>;
    setMaxVideoChannelUsers(max: number, reason?: string): Promise<this>;
    setVanityURLCode(code: string, reason?: string): Promise<this>;
    setDescription(description: string, reason?: string): Promise<this>;
    delete(): Promise<void>;
    leave(): Promise<void>;
    toJSON(): APIGuild;
}
