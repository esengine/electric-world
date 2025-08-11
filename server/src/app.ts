import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ECSCore } from './ecs/ECSCore';

const app: Application = express();

// 初始化ECS框架
const ecsCore = ECSCore.getInstance();
ecsCore.initialize(process.env.NODE_ENV === 'development');
ecsCore.startUpdateLoop(30); // 30FPS服务端更新

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;