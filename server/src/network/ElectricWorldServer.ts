/**
 * 电力世界网络服务端
 */

import { NetworkServer, ClientConnection, TransportMessage } from '@esengine/ecs-framework-network-server';
import { PowerNetworkManager } from '../game/PowerNetworkManager';

/**
 * 玩家信息
 */
interface Player {
  id: string;
  clientId: string;
  name: string;
}

/**
 * 电力世界网络服务端
 */
export class ElectricWorldServer {
  private networkServer: NetworkServer;
  private powerNetworkManager: PowerNetworkManager;
  private players: Map<string, Player> = new Map();
  private playerIdCounter: number = 1;

  constructor() {
    this.networkServer = new NetworkServer({
      name: 'ElectricWorldServer',
      websocket: {
        port: 8080,
        host: '0.0.0.0',
        maxConnections: 10,
        heartbeatInterval: 30000,
        connectionTimeout: 30000
      },
      maxConnections: 10,
      enableStats: true
    });
    this.powerNetworkManager = new PowerNetworkManager();
    
    this.initializeEventHandlers();
  }

  /**
   * 启动服务端
   */
  public async start(): Promise<void> {
    try {
      await this.networkServer.start();
      console.log(`电力世界服务端启动在端口 8080`);
    } catch (error) {
      console.error('启动服务端失败:', error);
      throw error;
    }
  }

  /**
   * 停止服务端
   */
  public async stop(): Promise<void> {
    try {
      await this.networkServer.stop();
      console.log('电力世界服务端已停止');
    } catch (error) {
      console.error('停止服务端失败:', error);
      throw error;
    }
  }

  /**
   * 初始化事件处理器
   */
  private initializeEventHandlers(): void {
    this.networkServer.on('client-connected', (client: ClientConnection) => {
      console.log(`客户端连接: ${client.id}`);
      const player: Player = {
        id: `player_${this.playerIdCounter++}`,
        clientId: client.id,
        name: `玩家${client.id}`
      };
      this.players.set(client.id, player);
    });

    this.networkServer.on('client-disconnected', (clientId: string) => {
      console.log(`客户端断开: ${clientId}`);
      this.players.delete(clientId);
    });

    this.networkServer.on('message', (client: ClientConnection, message: TransportMessage) => {
      this.handleMessage(client, message);
    });

    this.networkServer.on('error', (error: Error) => {
      console.error('网络错误:', error);
    });
  }

  /**
   * 处理客户端消息
   */
  private async handleMessage(client: ClientConnection, message: TransportMessage): Promise<void> {
    try {
      const { type, data } = message;
      
      if (type === 'custom') {
        await this.handleCustomMessage(client, data);
      }
    } catch (error) {
      console.error('处理消息失败:', error);
      await this.sendErrorToClient(client.id, 'MESSAGE_HANDLER_ERROR', '消息处理失败');
    }
  }

  /**
   * 处理自定义消息
   */
  private async handleCustomMessage(client: ClientConnection, data: any): Promise<void> {
    const { messageType, payload } = data;

    switch (messageType) {
      case 'test/ping':
        await this.handleTestPing(client, payload);
        break;
      case 'player/join':
        await this.handlePlayerJoin(client, payload);
        break;
      case 'device/create':
        await this.handleDeviceCreate(client, payload);
        break;
      case 'device/update':
        await this.handleDeviceUpdate(client, payload);
        break;
      case 'device/delete':
        await this.handleDeviceDelete(client, payload);
        break;
      case 'chat/send':
        await this.handleChatMessage(client, payload);
        break;
      default:
        console.warn(`未知消息类型: ${messageType}`);
    }
  }

  /**
   * 处理测试ping消息
   */
  private async handleTestPing(client: ClientConnection, payload: any): Promise<void> {
    console.log(`收到来自客户端 ${client.id} 的测试ping:`, payload);
    
    await this.sendToClient(client.id, 'test/pong', {
      originalTimestamp: payload.timestamp,
      serverTimestamp: Date.now(),
      message: '服务端pong响应',
      clientMessage: payload.message
    });
  }

  /**
   * 处理玩家加入
   */
  private async handlePlayerJoin(client: ClientConnection, data: any): Promise<void> {
    const player = this.players.get(client.id);
    if (player) {
      player.name = data.playerName || player.name;
      
      await this.sendToClient(client.id, 'player/joined', {
        playerId: player.id,
        playerName: player.name,
        avatar: data.avatar
      });

      console.log(`玩家加入: ${player.name} (${player.id})`);
    }
  }

  /**
   * 处理设备创建
   */
  private async handleDeviceCreate(client: ClientConnection, data: any): Promise<void> {
    try {
      const player = this.players.get(client.id);
      if (!player) {
        throw new Error('玩家不存在');
      }

      const device = await this.powerNetworkManager.createDevice(data, player.id);
      
      // 广播给所有客户端
      await this.broadcastMessage('device/created', device.serialize());
      
      console.log(`设备创建: ${data.deviceType} (${data.deviceId})`);
    } catch (error) {
      console.error('设备创建失败:', error);
      await this.sendErrorToClient(client.id, 'DEVICE_CREATE_FAILED', '创建设备失败');
    }
  }

  /**
   * 处理设备更新
   */
  private async handleDeviceUpdate(client: ClientConnection, data: any): Promise<void> {
    try {
      await this.powerNetworkManager.updateDevice(data.deviceId, data);
      
      // 广播给所有客户端
      await this.broadcastMessage('device/updated', data);
      
      console.log(`设备更新: ${data.deviceId}`);
    } catch (error) {
      console.error('设备更新失败:', error);
      await this.sendErrorToClient(client.id, 'DEVICE_UPDATE_FAILED', '更新设备失败');
    }
  }

  /**
   * 处理设备删除
   */
  private async handleDeviceDelete(client: ClientConnection, data: any): Promise<void> {
    try {
      const player = this.players.get(client.id);
      if (!player) {
        throw new Error('玩家不存在');
      }

      await this.powerNetworkManager.deleteDevice(data.deviceId, player.id);
      
      // 广播给所有客户端
      await this.broadcastMessage('device/deleted', data);
      
      console.log(`设备删除: ${data.deviceId}`);
    } catch (error) {
      console.error('设备删除失败:', error);
      await this.sendErrorToClient(client.id, 'DEVICE_DELETE_FAILED', '删除设备失败');
    }
  }

  /**
   * 处理聊天消息
   */
  private async handleChatMessage(client: ClientConnection, data: any): Promise<void> {
    const player = this.players.get(client.id);
    if (player) {
      const chatMessage = {
        playerId: player.id,
        playerName: player.name,
        message: data.message,
        timestamp: Date.now(),
        type: 'public'
      };

      // 广播给所有客户端
      await this.broadcastMessage('chat/received', chatMessage);
      
      console.log(`聊天消息: ${player.name}: ${data.message}`);
    }
  }

  /**
   * 发送消息给客户端
   */
  private async sendToClient(clientId: string, messageType: string, payload: any): Promise<void> {
    const message: TransportMessage = {
      type: 'custom',
      data: { messageType, payload }
    };
    await this.networkServer.sendToClient(clientId, message);
  }

  /**
   * 广播消息给所有客户端
   */
  private async broadcastMessage(messageType: string, payload: any): Promise<void> {
    const message: TransportMessage = {
      type: 'custom',
      data: { messageType, payload }
    };
    await this.networkServer.broadcast(message);
  }

  /**
   * 发送错误消息给客户端
   */
  private async sendErrorToClient(clientId: string, code: string, message: string): Promise<void> {
    await this.sendToClient(clientId, 'system/error', { code, message });
  }

  /**
   * 获取网络统计信息
   */
  public getNetworkStats() {
    return {
      ...this.networkServer.getStats(),
      playerCount: this.players.size,
      players: Array.from(this.players.values())
    };
  }
}