import { Scene } from '@esengine/ecs-framework';

/**
 * 服务端游戏场景
 */
export class ServerScene extends Scene {
    
    /**
     * 场景初始化
     */
    public initialize(): void {
        super.initialize();
        
        this.name = "ServerScene";
        console.log(`服务端场景 "${this.name}" 初始化完成`);
        
        // 这里可以添加服务端系统
        // this.addEntityProcessor(new ServerNetworkSystem());
        // this.addEntityProcessor(new GameLogicSystem());
        
        // 创建初始服务端实体
        this.createServerEntities();
    }
    
    /**
     * 创建服务端实体
     */
    private createServerEntities(): void {
        // 创建游戏世界实体
        const worldEntity = this.createEntity("GameWorld");
        console.log(`创建游戏世界实体: ${worldEntity.name}`);
        
        // 创建网络管理器实体
        const networkEntity = this.createEntity("NetworkManager");
        console.log(`创建网络管理器实体: ${networkEntity.name}`);
    }
    
    /**
     * 场景开始时调用
     */
    public onStart(): void {
        console.log(`服务端场景 "${this.name}" 开始运行`);
    }
    
    /**
     * 场景结束时调用
     */
    public onEnd(): void {
        console.log(`服务端场景 "${this.name}" 结束运行`);
    }
}