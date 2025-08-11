import { Scene } from '@esengine/ecs-framework';

/**
 * Electric World游戏场景
 */
export class ElectricWorldScene extends Scene {
    
    /**
     * 场景初始化
     */
    public initialize(): void {
        super.initialize();
        
        this.name = "ElectricWorldScene";
        console.log(`场景 "${this.name}" 初始化完成`);
        
        // 这里可以添加系统
        // this.addEntityProcessor(new SomeSystem());
        
        // 创建初始实体
        this.createInitialEntities();
    }
    
    /**
     * 创建初始实体
     */
    private createInitialEntities(): void {
    }
    
    /**
     * 场景开始时调用
     */
    public onStart(): void {
        console.log(`场景 "${this.name}" 开始运行`);
    }
    
    /**
     * 场景结束时调用
     */
    public onEnd(): void {
        console.log(`场景 "${this.name}" 结束运行`);
    }
}