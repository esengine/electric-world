import { Core } from '@esengine/ecs-framework';
import { ServerScene } from './scenes/ServerScene';

/**
 * 服务端ECS核心管理器
 */
export class ECSCore {
    private static instance: ECSCore | null = null;
    private isInitialized: boolean = false;
    private lastUpdateTime: number = 0;
    
    private constructor() {}
    
    public static getInstance(): ECSCore {
        if (!ECSCore.instance) {
            ECSCore.instance = new ECSCore();
        }
        return ECSCore.instance;
    }
    
    /**
     * 初始化ECS框架
     */
    public initialize(debugMode: boolean = false): void {
        if (this.isInitialized) return;
        
        try {
            // 创建ECS核心实例
            Core.create({
                debug: debugMode,
                enableEntitySystems: true
            });
            
            // 创建服务端场景
            const serverScene = new ServerScene();
            Core.scene = serverScene;
            
            this.isInitialized = true;
            this.lastUpdateTime = Date.now();
            
            console.log('服务端ECS框架初始化成功');
            
        } catch (error) {
            console.error('服务端ECS框架初始化失败:', error);
        }
    }
    
    /**
     * 更新ECS框架
     * 通常在游戏循环中调用
     */
    public update(): void {
        if (!this.isInitialized) return;
        
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // 转换为秒
        this.lastUpdateTime = currentTime;
        
        Core.update(deltaTime);
    }
    
    /**
     * 启动定时更新循环
     * @param tickRate 每秒更新次数，默认60FPS
     */
    public startUpdateLoop(tickRate: number = 60): void {
        const interval = 1000 / tickRate; // 计算更新间隔
        
        setInterval(() => {
            this.update();
        }, interval);
        
        console.log(`ECS更新循环已启动，tick rate: ${tickRate}FPS`);
    }
    
    /**
     * 获取初始化状态
     */
    public get initialized(): boolean {
        return this.isInitialized;
    }
    
    /**
     * 清理资源
     */
    public cleanup(): void {
        if (this.isInitialized) {
            console.log('清理服务端ECS框架...');
            this.isInitialized = false;
        }
    }
}