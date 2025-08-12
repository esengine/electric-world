import { Scene } from '@esengine/ecs-framework';
import { ElectricWorldClient } from '../network/ElectricWorldClient';

// 使用 WeakMap 来存储网络客户端，避免类属性问题
const networkClientMap = new WeakMap<ElectricWorldScene, ElectricWorldClient>();

/**
 * Electric World游戏场景
 */
export class ElectricWorldScene extends Scene {
    
    public get networkClient(): ElectricWorldClient {
        const client = networkClientMap.get(this);
        return client!;
    }
    
    public set networkClient(value: ElectricWorldClient) {
        networkClientMap.set(this, value);
    }
    
    /**
     * 场景初始化
     */
    public initialize(): void {
        super.initialize();
        
        this.name = "ElectricWorldScene";
        console.log(`场景 "${this.name}" 初始化完成`);
        
        // 初始化网络客户端
        this.initializeNetworkClient();
        
        // 这里可以添加系统
        // this.addEntityProcessor(new SomeSystem());
        
        // 创建初始实体
        this.createInitialEntities();
    }
    
    /**
     * 初始化网络客户端
     */
    private initializeNetworkClient(): void {
        this.networkClient = new ElectricWorldClient();
        
        // 设置事件回调
        this.networkClient.onConnected = () => {
            console.log('网络连接建立');
            this.onNetworkConnected();
        };
        
        this.networkClient.onDisconnected = (reason: string) => {
            console.log(`网络连接断开: ${reason}`);
            this.onNetworkDisconnected(reason);
        };
        
        this.networkClient.onTestPong = (payload: any) => {
            console.log('收到测试响应:', payload);
        };
        
        this.networkClient.onSystemError = (payload: any) => {
            console.error('系统错误:', payload);
        };
    }
    
    /**
     * 连接到服务端
     */
    public async connectToServer(): Promise<void> {
        try {
            await this.networkClient.connect();
            console.log('连接服务端成功');
        } catch (error) {
            console.error('连接服务端失败:', error);
            throw error;
        }
    }
    
    /**
     * 断开服务端连接
     */
    public async disconnectFromServer(): Promise<void> {
        try {
            await this.networkClient.disconnect();
            console.log('断开连接成功');
        } catch (error) {
            console.error('断开连接失败:', error);
            throw error;
        }
    }
    
    /**
     * 发送测试消息
     */
    public async sendTestMessage(): Promise<void> {
        try {
            await this.networkClient.sendTestMessage();
            console.log('测试消息已发送');
        } catch (error) {
            console.error('发送测试消息失败:', error);
            throw error;
        }
    }
    
    /**
     * 创建初始实体
     */
    private createInitialEntities(): void {
        // 这里可以创建初始的游戏实体
    }
    
    /**
     * 网络连接建立时的处理
     */
    private onNetworkConnected(): void {
        // 连接建立后的处理逻辑
    }
    
    /**
     * 网络连接断开时的处理
     */
    private onNetworkDisconnected(reason: string): void {
        // 连接断开后的处理逻辑
    }
    
    /**
     * 设备创建时的处理
     */
    private onDeviceCreated(payload: any): void {
        // 在场景中创建设备的视觉表示
        console.log(`在场景中创建设备: ${payload.deviceType} at (${payload.position.x}, ${payload.position.y})`);
    }
    
    /**
     * 场景开始时调用
     */
    public onStart(): void {
        console.log(`场景 "${this.name}" 开始运行`);
        
        // 自动连接到服务端
        this.connectToServer().catch(error => {
            console.error('自动连接失败:', error);
        });
    }
    
    /**
     * 场景结束时调用
     */
    public onEnd(): void {
        console.log(`场景 "${this.name}" 结束运行`);
        
        // 断开网络连接
        if (this.networkClient) {
            this.disconnectFromServer().catch(error => {
                console.error('断开连接失败:', error);
            });
        }
    }
}