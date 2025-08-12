/**
 * 电力世界共享网络组件定义
 */

import { NetworkValue } from '@esengine/ecs-framework-network-shared';
import { PowerDeviceType, PowerDeviceState } from './messages';

/**
 * 网络玩家组件数据
 */
export interface NetworkPlayerData {
  playerId: string;
  playerName: string;
  position: { x: number; y: number };
  isConnected: boolean;
  lastActiveTime: number;
  avatar?: string;
  score: number;
  buildingsOwned: string[];
}

/**
 * 网络电力设备组件数据
 */
export interface NetworkPowerDeviceData {
  deviceId: string;
  deviceType: PowerDeviceType;
  position: { x: number; y: number };
  rotation: number;
  state: PowerDeviceState;
  ownerId: string;
  
  // 电力属性
  powerOutput: number;
  powerInput: number;
  maxPower: number;
  efficiency: number;
  
  // 连接信息
  inputConnections: string[];
  outputConnections: string[];
  
  // 状态信息
  lastMaintenanceTime: number;
  healthPercentage: number;
  isUpgraded: boolean;
  
  // 特殊属性（根据设备类型）
  specialProperties: { [key: string]: NetworkValue };
}

/**
 * 网络电力网络组件数据
 */
export interface NetworkPowerNetworkData {
  networkId: string;
  connectedDevices: string[];
  totalPowerGeneration: number;
  totalPowerConsumption: number;
  networkEfficiency: number;
  isStable: boolean;
  powerFlow: { from: string; to: string; amount: number }[];
}

/**
 * 网络房间组件数据
 */
export interface NetworkRoomData {
  roomId: string;
  roomName: string;
  hostPlayerId: string;
  players: NetworkPlayerData[];
  maxPlayers: number;
  gameMode: string;
  isPrivate: boolean;
  settings: {
    mapSize: { width: number; height: number };
    weatherEnabled: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    gameSpeed: number;
  };
  gameState: {
    isStarted: boolean;
    isPaused: boolean;
    elapsedTime: number;
    totalScore: number;
  };
}

/**
 * 网络天气组件数据
 */
export interface NetworkWeatherData {
  weatherType: WeatherType;
  intensity: number;
  duration: number;
  remainingTime: number;
  affectedDevices: string[];
  powerModifier: number;
}

export enum WeatherType {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  STORMY = 'stormy',
  WINDY = 'windy',
  SNOW = 'snow'
}

/**
 * 网络建造组件数据
 */
export interface NetworkBuildingData {
  builderId: string;
  targetPosition: { x: number; y: number };
  deviceType: PowerDeviceType;
  buildProgress: number;
  isCompleted: boolean;
  requiredResources: { [resource: string]: number };
  usedResources: { [resource: string]: number };
}

/**
 * 网络资源管理组件数据
 */
export interface NetworkResourceData {
  playerId: string;
  resources: {
    money: number;
    copper: number;
    steel: number;
    silicon: number;
    oil: number;
    coal: number;
  };
  income: {
    moneyPerSecond: number;
    resourceMultiplier: number;
  };
}

/**
 * 网络任务组件数据
 */
export interface NetworkTaskData {
  taskId: string;
  title: string;
  description: string;
  targetPlayerId?: string;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  rewards: { [resource: string]: number };
  deadline?: number;
}

/**
 * 共享的网络组件基础接口
 */
export interface BaseNetworkComponentData {
  componentId: string;
  entityId: string;
  lastUpdateTime: number;
  isDirty: boolean;
}

/**
 * 网络同步配置
 */
export interface NetworkSyncConfig {
  syncInterval: number;
  priority: 'low' | 'medium' | 'high';
  deltaSync: boolean;
  ownerOnly: boolean;
  reliable: boolean;
}