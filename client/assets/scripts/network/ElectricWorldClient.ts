/**
 * 电力世界网络客户端
 */

import { WebSocketClientTransport, ClientMessage, ConnectionState } from '@esengine/ecs-framework-network-client';

/**
 * 电力世界网络客户端
 */
export class ElectricWorldClient {
  private transport: WebSocketClientTransport;
  private isConnected: boolean = false;
  private playerId: string = '';
  private playerName: string = '';

  constructor() {
    this.transport = new WebSocketClientTransport({
      host: 'localhost',
      port: 8080,
      secure: false,
      connectionTimeout: 5000,
      reconnectInterval: 1000,
      maxReconnectAttempts: 3,
      heartbeatInterval: 30000
    });

    this.initializeEventHandlers();
  }

  /**
   * 初始化事件处理器
   */
  private initializeEventHandlers(): void {
    this.transport.on('connected', () => {
      console.log('已连接到服务端');
      this.isConnected = true;
      this.onConnected();
    });

    this.transport.on('disconnected', (reason: string) => {
      console.log(`与服务端断开连接: ${reason}`);
      this.isConnected = false;
      this.onDisconnected(reason);
    });

    this.transport.on('state-changed', (oldState: ConnectionState, newState: ConnectionState) => {
      console.log(`连接状态变化: ${oldState} -> ${newState}`);
    });

    this.transport.on('message', (message: ClientMessage) => {
      this.handleMessage(message);
    });

    this.transport.on('error', (error: Error) => {
      console.error('网络错误:', error);
      this.onError(error);
    });
  }

  /**
   * 连接到服务端
   */
  public async connect(): Promise<void> {
    try {
      await this.transport.connect();
    } catch (error) {
      console.error('连接失败:', error);
      throw error;
    }
  }

  /**
   * 断开连接
   */
  public async disconnect(): Promise<void> {
    try {
      await this.transport.disconnect();
    } catch (error) {
      console.error('断开连接失败:', error);
      throw error;
    }
  }

  /**
   * 发送测试消息
   */
  public async sendTestMessage(): Promise<void> {
    await this.sendMessage('test/ping', {
      timestamp: Date.now(),
      message: 'Hello from client'
    });
  }

  /**
   * 发送消息到服务端
   */
  private async sendMessage(messageType: string, payload: any): Promise<void> {
    if (!this.isConnected) {
      throw new Error('未连接到服务端');
    }

    const message: ClientMessage = {
      type: 'custom',
      data: { messageType, payload },
      reliable: true,
      timestamp: Date.now()
    };

    await this.transport.sendMessage(message);
  }

  /**
   * 处理服务端消息
   */
  private handleMessage(message: ClientMessage): void {
    try {
      if (message.type === 'custom') {
        const { messageType, payload } = message.data as any;
        this.handleCustomMessage(messageType, payload);
      }
    } catch (error) {
      console.error('处理消息失败:', error);
    }
  }

  /**
   * 处理自定义消息
   */
  private handleCustomMessage(messageType: string, payload: any): void {
    switch (messageType) {
      case 'test/pong':
        this.handleTestPong(payload);
        break;
      case 'system/error':
        this.handleSystemError(payload);
        break;
      default:
        console.log(`收到消息: ${messageType}`, payload);
    }
  }

  /**
   * 处理测试pong响应
   */
  private handleTestPong(payload: any): void {
    console.log(`收到服务端pong响应:`, payload);
    this.onTestPong(payload);
  }

  /**
   * 处理系统错误
   */
  private handleSystemError(payload: any): void {
    console.error(`系统错误 [${payload.code}]: ${payload.message}`);
    this.onSystemError(payload);
  }

  // 事件回调方法，可被外部重写
  public onConnected(): void {}
  public onDisconnected(reason: string): void {}
  public onError(error: Error): void {}
  public onTestPong(payload: any): void {}
  public onSystemError(payload: any): void {}

  /**
   * 获取连接状态
   */
  public getConnectionState(): boolean {
    return this.isConnected;
  }

  /**
   * 获取玩家ID
   */
  public getPlayerId(): string {
    return this.playerId;
  }

  /**
   * 获取玩家名称
   */
  public getPlayerName(): string {
    return this.playerName;
  }

  /**
   * 获取网络统计信息
   */
  public getStats() {
    return this.transport.getStats();
  }
}