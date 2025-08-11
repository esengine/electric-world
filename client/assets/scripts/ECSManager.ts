import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;
import { Core } from '@esengine/ecs-framework';
import { ElectricWorldScene } from './scenes/ElectricWorldScene';

@ccclass('ECSManager')
export class ECSManager extends Component {
    
    @property({
        tooltip: '是否启用调试模式'
    })
    public debugMode: boolean = true;
    
    private isInitialized: boolean = false;
    
    start() {
        this.initializeECS();
    }
    
    private initializeECS(): void {
        if (this.isInitialized) return;
        
        try {
            // 创建ECS核心实例
            Core.create({
                debug: this.debugMode,
                enableEntitySystems: true
            });
            
            // 创建游戏场景
            const gameScene = new ElectricWorldScene();
            Core.scene = gameScene;
            
            this.isInitialized = true;
            console.log('ECS框架初始化成功');
            
        } catch (error) {
            console.error('ECS框架初始化失败:', error);
        }
    }
    
    /**
     * 每帧更新ECS框架
     */
    update(deltaTime: number) {
        if (this.isInitialized) {
            Core.update(deltaTime);
        }
    }
    
    /**
     * 组件销毁时清理ECS
     */
    onDestroy() {
        if (this.isInitialized) {
            console.log('清理ECS框架...');
            this.isInitialized = false;
        }
    }
}