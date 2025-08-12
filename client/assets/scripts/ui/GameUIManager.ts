/**
 * 游戏UI管理器
 */

import { _decorator, Component, Node, Button, EditBox, Label } from 'cc';
import { ElectricWorldScene } from '../scenes/ElectricWorldScene';
const { ccclass, property } = _decorator;

@ccclass('GameUIManager')
export class GameUIManager extends Component {
    
    @property({
        type: Button,
        tooltip: '连接按钮'
    })
    public connectButton: Button | null = null;
    
    @property({
        type: Button,
        tooltip: '断开按钮'
    })
    public disconnectButton: Button | null = null;
    
    @property({
        type: Button,
        tooltip: '创建发电机按钮'
    })
    public createGeneratorButton: Button | null = null;
    
    @property({
        type: Button,
        tooltip: '创建电池按钮'
    })
    public createBatteryButton: Button | null = null;
    
    @property({
        type: Button,
        tooltip: '发送聊天按钮'
    })
    public sendChatButton: Button | null = null;
    
    @property({
        type: EditBox,
        tooltip: '聊天输入框'
    })
    public chatInput: EditBox | null = null;
    
    @property({
        type: Label,
        tooltip: '状态标签'
    })
    public statusLabel: Label | null = null;
    
    @property({
        type: Label,
        tooltip: '聊天显示区域'
    })
    public chatDisplay: Label | null = null;
    
    private gameScene: ElectricWorldScene | null = null;
    
    start() {
        this.initializeUI();
        this.updateStatus('准备就绪');
    }
    
    /**
     * 初始化UI事件
     */
    private initializeUI(): void {
        if (this.connectButton) {
            this.connectButton.node.on(Button.EventType.CLICK, this.onConnectClick, this);
        }
        
        if (this.disconnectButton) {
            this.disconnectButton.node.on(Button.EventType.CLICK, this.onDisconnectClick, this);
        }
        
        if (this.createGeneratorButton) {
            this.createGeneratorButton.node.on(Button.EventType.CLICK, this.onCreateGeneratorClick, this);
        }
        
        if (this.createBatteryButton) {
            this.createBatteryButton.node.on(Button.EventType.CLICK, this.onCreateBatteryClick, this);
        }
        
        if (this.sendChatButton) {
            this.sendChatButton.node.on(Button.EventType.CLICK, this.onSendChatClick, this);
        }
    }
    
    /**
     * 设置游戏场景引用
     */
    public setGameScene(scene: ElectricWorldScene): void {
        this.gameScene = scene;
    }
    
    /**
     * 连接按钮点击
     */
    private async onConnectClick(): Promise<void> {
        if (!this.gameScene) {
            this.updateStatus('场景未初始化');
            return;
        }
        
        this.updateStatus('连接中...');
        try {
            await this.gameScene.connectToServer();
            this.updateStatus('连接成功');
            this.updateButtonStates(true);
        } catch (error) {
            this.updateStatus('连接失败');
            console.error('连接失败:', error);
        }
    }
    
    /**
     * 断开按钮点击
     */
    private async onDisconnectClick(): Promise<void> {
        if (!this.gameScene) {
            return;
        }
        
        this.updateStatus('断开连接中...');
        try {
            await this.gameScene.disconnectFromServer();
            this.updateStatus('已断开连接');
            this.updateButtonStates(false);
        } catch (error) {
            this.updateStatus('断开连接失败');
            console.error('断开连接失败:', error);
        }
    }
    
    /**
     * 创建发电机按钮点击
     */
    private async onCreateGeneratorClick(): Promise<void> {
        if (!this.gameScene) {
            return;
        }
        
        try {
            await this.gameScene.sendTestMessage();
            this.updateStatus('测试消息已发送');
        } catch (error) {
            this.updateStatus('发送测试消息失败');
            console.error('发送测试消息失败:', error);
        }
    }
    
    /**
     * 创建电池按钮点击
     */
    private async onCreateBatteryClick(): Promise<void> {
        if (!this.gameScene) {
            return;
        }
        
        try {
            await this.gameScene.sendTestMessage();
            this.updateStatus('测试消息已发送');
        } catch (error) {
            this.updateStatus('发送测试消息失败');
            console.error('发送测试消息失败:', error);
        }
    }
    
    /**
     * 发送聊天按钮点击
     */
    private async onSendChatClick(): Promise<void> {
        if (!this.gameScene || !this.chatInput) {
            return;
        }
        
        const message = this.chatInput.string.trim();
        if (!message) {
            return;
        }
        
        try {
            await this.gameScene.sendTestMessage();
            this.chatInput.string = '';
            this.updateStatus('测试消息已发送');
        } catch (error) {
            this.updateStatus('发送测试消息失败');
            console.error('发送测试消息失败:', error);
        }
    }
    
    /**
     * 更新状态显示
     */
    private updateStatus(status: string): void {
        if (this.statusLabel) {
            this.statusLabel.string = `状态: ${status}`;
        }
        console.log(`UI状态: ${status}`);
    }
    
    /**
     * 更新按钮状态
     */
    private updateButtonStates(connected: boolean): void {
        if (this.connectButton) {
            this.connectButton.interactable = !connected;
        }
        if (this.disconnectButton) {
            this.disconnectButton.interactable = connected;
        }
        if (this.createGeneratorButton) {
            this.createGeneratorButton.interactable = connected;
        }
        if (this.createBatteryButton) {
            this.createBatteryButton.interactable = connected;
        }
        if (this.sendChatButton) {
            this.sendChatButton.interactable = connected;
        }
    }
    
    /**
     * 显示聊天消息
     */
    public showChatMessage(playerName: string, message: string): void {
        if (this.chatDisplay) {
            const currentText = this.chatDisplay.string;
            const newMessage = `${playerName}: ${message}\n`;
            this.chatDisplay.string = currentText + newMessage;
        }
    }
    
    /**
     * 显示系统消息
     */
    public showSystemMessage(message: string): void {
        if (this.chatDisplay) {
            const currentText = this.chatDisplay.string;
            const systemMessage = `[系统]: ${message}\n`;
            this.chatDisplay.string = currentText + systemMessage;
        }
    }
}