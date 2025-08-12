import { Component } from '@esengine/ecs-framework';

/**
 * 网络连接组件
 */
export class NetworkComponent extends Component {
    public isConnected: boolean = false;
    public connectionState: string = 'disconnected';
    public lastPingTime: number = 0;
    public latency: number = 0;
    
    /**
     * 重置组件状态
     */
    public reset(): void {
        this.isConnected = false;
        this.connectionState = 'disconnected';
        this.lastPingTime = 0;
        this.latency = 0;
    }
    
    /**
     * 更新连接状态
     */
    public updateConnectionState(isConnected: boolean, state: string): void {
        this.isConnected = isConnected;
        this.connectionState = state;
    }
    
    /**
     * 更新延迟信息
     */
    public updateLatency(latency: number): void {
        this.latency = latency;
        this.lastPingTime = Date.now();
    }
}