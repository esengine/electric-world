/**
 * 电力世界网络消息定义
 */

import { NetworkValue } from '@esengine/ecs-framework-network-shared';

/**
 * 玩家相关消息
 */
export interface PlayerJoinMessage {
  playerId: string;
  playerName: string;
  avatar?: string;
}

export interface PlayerLeaveMessage {
  playerId: string;
  reason?: string;
}

export interface PlayerStateMessage {
  playerId: string;
  position: { x: number; y: number };
  isBuilding: boolean;
  selectedTool?: string;
}

/**
 * 电力设备相关消息
 */
export interface PowerDeviceCreateMessage {
  deviceId: string;
  deviceType: PowerDeviceType;
  position: { x: number; y: number };
  rotation: number;
  ownerId: string;
}

export interface PowerDeviceUpdateMessage {
  deviceId: string;
  state: PowerDeviceState;
  power: number;
  connections: string[];
}

export interface PowerDeviceDeleteMessage {
  deviceId: string;
  ownerId: string;
}

/**
 * 电力网络相关消息
 */
export interface PowerConnectionMessage {
  fromDeviceId: string;
  toDeviceId: string;
  connectionType: 'power' | 'data';
}

export interface PowerNetworkUpdateMessage {
  networkId: string;
  totalPower: number;
  totalConsumption: number;
  efficiency: number;
  devices: string[];
}

/**
 * 房间相关消息
 */
export interface RoomStateMessage {
  roomId: string;
  playerCount: number;
  maxPlayers: number;
  gameMode: string;
  mapSize: { width: number; height: number };
}

/**
 * 聊天消息
 */
export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'public' | 'private' | 'system';
}

/**
 * 电力设备类型枚举
 */
export enum PowerDeviceType {
  GENERATOR = 'generator',
  BATTERY = 'battery',
  SOLAR_PANEL = 'solar_panel',
  WIND_TURBINE = 'wind_turbine',
  POWER_LINE = 'power_line',
  TRANSFORMER = 'transformer',
  CONSUMER = 'consumer',
  SWITCH = 'switch'
}

/**
 * 电力设备状态枚举
 */
export enum PowerDeviceState {
  OFFLINE = 'offline',
  ONLINE = 'online',
  MAINTENANCE = 'maintenance',
  OVERLOADED = 'overloaded',
  DAMAGED = 'damaged'
}

/**
 * 游戏事件消息
 */
export interface GameEventMessage {
  eventType: GameEventType;
  data: NetworkValue;
  timestamp: number;
}

export enum GameEventType {
  POWER_OUTAGE = 'power_outage',
  DEVICE_OVERLOAD = 'device_overload',
  MAINTENANCE_REQUIRED = 'maintenance_required',
  EFFICIENCY_BONUS = 'efficiency_bonus',
  WEATHER_CHANGE = 'weather_change'
}