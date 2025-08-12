/**
 * 电力世界网络协议定义
 */

import type { NetworkValue } from '@esengine/ecs-framework-network-shared';
import {
  PlayerJoinMessage,
  PlayerLeaveMessage,
  PlayerStateMessage,
  PowerDeviceCreateMessage,
  PowerDeviceUpdateMessage,
  PowerDeviceDeleteMessage,
  PowerConnectionMessage,
  PowerNetworkUpdateMessage,
  ChatMessage,
  GameEventMessage
} from './messages';

/**
 * 客户端发送到服务端的协议
 */
export interface ClientToServerProtocol {
  // 玩家相关
  'player/join': PlayerJoinMessage;
  'player/leave': PlayerLeaveMessage;
  'player/updateState': PlayerStateMessage;
  
  // 电力设备相关
  'device/create': PowerDeviceCreateMessage;
  'device/update': PowerDeviceUpdateMessage;
  'device/delete': PowerDeviceDeleteMessage;
  
  // 电力网络相关
  'power/connect': PowerConnectionMessage;
  'power/disconnect': { fromDeviceId: string; toDeviceId: string };
  
  // 聊天相关
  'chat/send': ChatMessage;
  
  // 房间相关
  'room/join': { roomId: string; password?: string };
  'room/leave': { roomId: string };
  'room/create': {
    roomName: string;
    maxPlayers: number;
    gameMode: string;
    isPrivate: boolean;
    password?: string;
  };
  
  // 游戏操作相关
  'game/start': { roomId: string };
  'game/pause': { roomId: string };
  'game/resume': { roomId: string };
  
  // 建造相关
  'build/start': {
    deviceType: string;
    position: { x: number; y: number };
    rotation: number;
  };
  'build/cancel': { buildId: string };
  
  // 维护相关
  'maintenance/start': { deviceId: string };
  'maintenance/complete': { deviceId: string };
}

/**
 * 服务端发送到客户端的协议
 */
export interface ServerToClientProtocol {
  // 玩家相关通知
  'player/joined': PlayerJoinMessage;
  'player/left': PlayerLeaveMessage;
  'player/stateChanged': PlayerStateMessage;
  
  // 电力设备相关通知
  'device/created': PowerDeviceCreateMessage;
  'device/updated': PowerDeviceUpdateMessage;
  'device/deleted': PowerDeviceDeleteMessage;
  
  // 电力网络相关通知
  'power/connected': PowerConnectionMessage;
  'power/disconnected': { fromDeviceId: string; toDeviceId: string };
  'power/networkUpdated': PowerNetworkUpdateMessage;
  
  // 聊天相关通知
  'chat/received': ChatMessage;
  
  // 房间相关通知
  'room/playerJoined': { roomId: string; player: PlayerJoinMessage };
  'room/playerLeft': { roomId: string; playerId: string };
  'room/stateChanged': {
    roomId: string;
    gameStarted: boolean;
    gamePaused: boolean;
    elapsedTime: number;
  };
  
  // 游戏事件通知
  'game/eventOccurred': GameEventMessage;
  'game/started': { roomId: string };
  'game/paused': { roomId: string };
  'game/resumed': { roomId: string };
  
  // 建造相关通知
  'build/started': {
    buildId: string;
    playerId: string;
    deviceType: string;
    position: { x: number; y: number };
  };
  'build/completed': {
    buildId: string;
    deviceId: string;
  };
  'build/cancelled': { buildId: string };
  
  // 维护相关通知
  'maintenance/started': { deviceId: string; playerId: string };
  'maintenance/completed': { deviceId: string; playerId: string };
  
  // 系统通知
  'system/error': { code: string; message: string };
  'system/warning': { message: string };
  'system/info': { message: string };
}

/**
 * 服务端RPC方法协议
 */
export interface ServerRpcProtocol {
  // 玩家管理
  'getRoomList': {
    request: void;
    response: {
      rooms: Array<{
        roomId: string;
        roomName: string;
        playerCount: number;
        maxPlayers: number;
        gameMode: string;
        isPrivate: boolean;
      }>;
    };
  };
  
  'getPlayerStats': {
    request: { playerId: string };
    response: {
      score: number;
      buildingsBuilt: number;
      maintenancePerformed: number;
      playtime: number;
    };
  };
  
  // 房间管理
  'getRoomDetails': {
    request: { roomId: string };
    response: {
      roomId: string;
      roomName: string;
      hostPlayerId: string;
      players: PlayerJoinMessage[];
      maxPlayers: number;
      gameMode: string;
      isPrivate: boolean;
      gameStarted: boolean;
    };
  };
  
  // 电力网络查询
  'getPowerNetworkStatus': {
    request: { networkId: string };
    response: {
      networkId: string;
      devices: string[];
      totalGeneration: number;
      totalConsumption: number;
      efficiency: number;
      isStable: boolean;
    };
  };
  
  // 设备信息查询
  'getDeviceInfo': {
    request: { deviceId: string };
    response: {
      deviceId: string;
      deviceType: string;
      position: { x: number; y: number };
      state: string;
      power: number;
      health: number;
      connections: string[];
    };
  };
  
  // 游戏统计
  'getGameStats': {
    request: { roomId: string };
    response: {
      totalDevices: number;
      totalPower: number;
      totalConsumption: number;
      averageEfficiency: number;
      maintenanceNeeded: number;
    };
  };
}

/**
 * 客户端RPC方法协议
 */
export interface ClientRpcProtocol {
  // 客户端状态同步
  'syncGameState': {
    request: {
      devices: PowerDeviceUpdateMessage[];
      players: PlayerStateMessage[];
      powerNetworks: PowerNetworkUpdateMessage[];
    };
    response: void;
  };
  
  // 客户端通知
  'showNotification': {
    request: {
      type: 'info' | 'warning' | 'error' | 'success';
      title: string;
      message: string;
      duration?: number;
    };
    response: void;
  };
  
  // 强制断线
  'forceDisconnect': {
    request: { reason: string };
    response: void;
  };
  
  // 游戏状态更新
  'updateGameTime': {
    request: { elapsedTime: number; gameSpeed: number };
    response: void;
  };
}

/**
 * 完整的网络协议接口
 */
export interface ElectricWorldProtocol {
  clientToServer: ClientToServerProtocol;
  serverToClient: ServerToClientProtocol;
  serverRpc: ServerRpcProtocol;
  clientRpc: ClientRpcProtocol;
}

/**
 * 网络协议配置
 */
export const PROTOCOL_CONFIG = {
  // 连接配置
  CONNECTION: {
    HEARTBEAT_INTERVAL: 30000,
    CONNECTION_TIMEOUT: 5000,
    RECONNECT_ATTEMPTS: 3,
    RECONNECT_DELAY: 1000,
  },
  
  // 消息配置
  MESSAGE: {
    MAX_MESSAGE_SIZE: 1024 * 64, // 64KB
    COMPRESSION_THRESHOLD: 1024, // 1KB
    BATCH_SIZE: 50,
    BATCH_TIMEOUT: 16, // ~60fps
  },
  
  // 同步配置
  SYNC: {
    PLAYER_STATE_INTERVAL: 100,
    DEVICE_STATE_INTERVAL: 200,
    POWER_NETWORK_INTERVAL: 500,
    ROOM_STATE_INTERVAL: 1000,
  },
  
  // 优先级配置
  PRIORITY: {
    CHAT: 'low' as const,
    PLAYER_STATE: 'medium' as const,
    DEVICE_OPERATIONS: 'high' as const,
    SYSTEM_EVENTS: 'high' as const,
  }
};