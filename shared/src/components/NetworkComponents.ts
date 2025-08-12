/**
 * 电力世界网络组件实现
 */

import { Component } from '@esengine/ecs-framework';
import { NetworkValue } from '@esengine/ecs-framework-network-shared';
import {
  NetworkPlayerData,
  NetworkPowerDeviceData,
  NetworkPowerNetworkData,
  NetworkRoomData,
  NetworkWeatherData,
  NetworkBuildingData,
  NetworkResourceData,
  NetworkTaskData,
  BaseNetworkComponentData,
  NetworkSyncConfig,
  WeatherType
} from '../network/components';
import { PowerDeviceType, PowerDeviceState } from '../network/messages';

/**
 * 网络玩家组件
 */
export class NetworkPlayer extends Component implements NetworkPlayerData {
  public playerId: string = '';
  public playerName: string = '';
  public position: { x: number; y: number } = { x: 0, y: 0 };
  public isConnected: boolean = true;
  public lastActiveTime: number = Date.now();
  public avatar?: string;
  public score: number = 0;
  public buildingsOwned: string[] = [];

  constructor(data?: Partial<NetworkPlayerData>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  public serialize(): { [key: string]: NetworkValue } {
    return {
      playerId: this.playerId,
      playerName: this.playerName,
      position: this.position as { [key: string]: NetworkValue },
      isConnected: this.isConnected,
      lastActiveTime: this.lastActiveTime,
      avatar: this.avatar || '',
      score: this.score,
      buildingsOwned: this.buildingsOwned
    };
  }

  public deserialize(data: NetworkValue): void {
    const typedData = data as { [key: string]: NetworkValue };
    this.playerId = typedData.playerId as string;
    this.playerName = typedData.playerName as string;
    this.position = typedData.position as { x: number; y: number };
    this.isConnected = typedData.isConnected as boolean;
    this.lastActiveTime = typedData.lastActiveTime as number;
    this.avatar = typedData.avatar as string | undefined;
    this.score = typedData.score as number;
    this.buildingsOwned = typedData.buildingsOwned as string[];
  }
}

/**
 * 网络电力设备组件
 */
export class NetworkPowerDevice extends Component implements NetworkPowerDeviceData {
  public deviceId: string = '';
  public deviceType: PowerDeviceType = PowerDeviceType.GENERATOR;
  public position: { x: number; y: number } = { x: 0, y: 0 };
  public rotation: number = 0;
  public state: PowerDeviceState = PowerDeviceState.OFFLINE;
  public ownerId: string = '';
  
  public powerOutput: number = 0;
  public powerInput: number = 0;
  public maxPower: number = 100;
  public efficiency: number = 1.0;
  
  public inputConnections: string[] = [];
  public outputConnections: string[] = [];
  
  public lastMaintenanceTime: number = Date.now();
  public healthPercentage: number = 100;
  public isUpgraded: boolean = false;
  
  public specialProperties: { [key: string]: NetworkValue } = {};

  constructor(data?: Partial<NetworkPowerDeviceData>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  public serialize(): { [key: string]: NetworkValue } {
    return {
      deviceId: this.deviceId,
      deviceType: this.deviceType,
      position: this.position as { [key: string]: NetworkValue },
      rotation: this.rotation,
      state: this.state,
      ownerId: this.ownerId,
      powerOutput: this.powerOutput,
      powerInput: this.powerInput,
      maxPower: this.maxPower,
      efficiency: this.efficiency,
      inputConnections: this.inputConnections,
      outputConnections: this.outputConnections,
      lastMaintenanceTime: this.lastMaintenanceTime,
      healthPercentage: this.healthPercentage,
      isUpgraded: this.isUpgraded,
      specialProperties: this.specialProperties
    };
  }

  public deserialize(data: NetworkValue): void {
    const typedData = data as { [key: string]: NetworkValue };
    this.deviceId = typedData.deviceId as string;
    this.deviceType = typedData.deviceType as PowerDeviceType;
    this.position = typedData.position as { x: number; y: number };
    this.rotation = typedData.rotation as number;
    this.state = typedData.state as PowerDeviceState;
    this.ownerId = typedData.ownerId as string;
    this.powerOutput = typedData.powerOutput as number;
    this.powerInput = typedData.powerInput as number;
    this.maxPower = typedData.maxPower as number;
    this.efficiency = typedData.efficiency as number;
    this.inputConnections = typedData.inputConnections as string[];
    this.outputConnections = typedData.outputConnections as string[];
    this.lastMaintenanceTime = typedData.lastMaintenanceTime as number;
    this.healthPercentage = typedData.healthPercentage as number;
    this.isUpgraded = typedData.isUpgraded as boolean;
    this.specialProperties = typedData.specialProperties as { [key: string]: NetworkValue };
  }
}

/**
 * 网络电力网络组件
 */
export class NetworkPowerNetwork extends Component implements NetworkPowerNetworkData {
  public networkId: string = '';
  public connectedDevices: string[] = [];
  public totalPowerGeneration: number = 0;
  public totalPowerConsumption: number = 0;
  public networkEfficiency: number = 1.0;
  public isStable: boolean = true;
  public powerFlow: { from: string; to: string; amount: number }[] = [];

  constructor(data?: Partial<NetworkPowerNetworkData>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  public serialize(): { [key: string]: NetworkValue } {
    return {
      networkId: this.networkId,
      connectedDevices: this.connectedDevices,
      totalPowerGeneration: this.totalPowerGeneration,
      totalPowerConsumption: this.totalPowerConsumption,
      networkEfficiency: this.networkEfficiency,
      isStable: this.isStable,
      powerFlow: this.powerFlow as NetworkValue[]
    };
  }

  public deserialize(data: NetworkValue): void {
    const typedData = data as { [key: string]: NetworkValue };
    this.networkId = typedData.networkId as string;
    this.connectedDevices = typedData.connectedDevices as string[];
    this.totalPowerGeneration = typedData.totalPowerGeneration as number;
    this.totalPowerConsumption = typedData.totalPowerConsumption as number;
    this.networkEfficiency = typedData.networkEfficiency as number;
    this.isStable = typedData.isStable as boolean;
    this.powerFlow = typedData.powerFlow as { from: string; to: string; amount: number }[];
  }
}

/**
 * 网络房间组件
 */
export class NetworkRoom extends Component implements NetworkRoomData {
  public roomId: string = '';
  public roomName: string = '';
  public hostPlayerId: string = '';
  public players: NetworkPlayerData[] = [];
  public maxPlayers: number = 4;
  public gameMode: string = 'cooperative';
  public isPrivate: boolean = false;
  public settings: {
    mapSize: { width: number; height: number };
    weatherEnabled: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    gameSpeed: number;
  } = {
    mapSize: { width: 1000, height: 1000 },
    weatherEnabled: true,
    difficulty: 'medium',
    gameSpeed: 1.0
  };
  public gameState: {
    isStarted: boolean;
    isPaused: boolean;
    elapsedTime: number;
    totalScore: number;
  } = {
    isStarted: false,
    isPaused: false,
    elapsedTime: 0,
    totalScore: 0
  };

  constructor(data?: Partial<NetworkRoomData>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  public serialize(): { [key: string]: NetworkValue } {
    return {
      roomId: this.roomId,
      roomName: this.roomName,
      hostPlayerId: this.hostPlayerId,
      players: this.players as unknown as NetworkValue[],
      maxPlayers: this.maxPlayers,
      gameMode: this.gameMode,
      isPrivate: this.isPrivate,
      settings: this.settings as { [key: string]: NetworkValue },
      gameState: this.gameState as { [key: string]: NetworkValue }
    };
  }

  public deserialize(data: NetworkValue): void {
    const typedData = data as { [key: string]: NetworkValue };
    this.roomId = typedData.roomId as string;
    this.roomName = typedData.roomName as string;
    this.hostPlayerId = typedData.hostPlayerId as string;
    this.players = typedData.players as unknown as NetworkPlayerData[];
    this.maxPlayers = typedData.maxPlayers as number;
    this.gameMode = typedData.gameMode as string;
    this.isPrivate = typedData.isPrivate as boolean;
    this.settings = typedData.settings as typeof this.settings;
    this.gameState = typedData.gameState as typeof this.gameState;
  }
}

/**
 * 网络天气组件
 */
export class NetworkWeather extends Component implements NetworkWeatherData {
  public weatherType: WeatherType = WeatherType.SUNNY;
  public intensity: number = 0;
  public duration: number = 0;
  public remainingTime: number = 0;
  public affectedDevices: string[] = [];
  public powerModifier: number = 1.0;

  constructor(data?: Partial<NetworkWeatherData>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  public serialize(): { [key: string]: NetworkValue } {
    return {
      weatherType: this.weatherType,
      intensity: this.intensity,
      duration: this.duration,
      remainingTime: this.remainingTime,
      affectedDevices: this.affectedDevices,
      powerModifier: this.powerModifier
    };
  }

  public deserialize(data: NetworkValue): void {
    const typedData = data as { [key: string]: NetworkValue };
    this.weatherType = typedData.weatherType as WeatherType;
    this.intensity = typedData.intensity as number;
    this.duration = typedData.duration as number;
    this.remainingTime = typedData.remainingTime as number;
    this.affectedDevices = typedData.affectedDevices as string[];
    this.powerModifier = typedData.powerModifier as number;
  }
}

/**
 * 网络资源管理组件
 */
export class NetworkResource extends Component implements NetworkResourceData {
  public playerId: string = '';
  public resources: {
    money: number;
    copper: number;
    steel: number;
    silicon: number;
    oil: number;
    coal: number;
  } = {
    money: 1000,
    copper: 100,
    steel: 50,
    silicon: 25,
    oil: 75,
    coal: 100
  };
  public income: {
    moneyPerSecond: number;
    resourceMultiplier: number;
  } = {
    moneyPerSecond: 1.0,
    resourceMultiplier: 1.0
  };

  constructor(data?: Partial<NetworkResourceData>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  public serialize(): { [key: string]: NetworkValue } {
    return {
      playerId: this.playerId,
      resources: this.resources as { [key: string]: NetworkValue },
      income: this.income as { [key: string]: NetworkValue }
    };
  }

  public deserialize(data: NetworkValue): void {
    const typedData = data as { [key: string]: NetworkValue };
    this.playerId = typedData.playerId as string;
    this.resources = typedData.resources as typeof this.resources;
    this.income = typedData.income as typeof this.income;
  }
}

/**
 * 基础网络组件实现
 */
export abstract class BaseNetworkComponent extends Component implements BaseNetworkComponentData {
  public componentId: string = '';
  public entityId: string = '';
  public lastUpdateTime: number = Date.now();
  public isDirty: boolean = false;

  constructor(data?: Partial<BaseNetworkComponentData>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  public markDirty(): void {
    this.isDirty = true;
    this.lastUpdateTime = Date.now();
  }

  public markClean(): void {
    this.isDirty = false;
  }

  public abstract serialize(): { [key: string]: NetworkValue };
  public abstract deserialize(data: NetworkValue): void;
}