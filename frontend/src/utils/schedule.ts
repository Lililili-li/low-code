interface ScheduleOptions {
  immediate?: boolean; // 是否立即执行
  interval: number;    // 时间间隔（毫秒）
}

export class Schedule {
  private timer: number | null = null;
  private isRunning: boolean = false;
  private options: ScheduleOptions;
  private task: () => void;

  constructor(task: () => void, options: ScheduleOptions) {
    this.task = task;
    this.options = {
      immediate: false,
      ...options
    };
  }

  /**
   * 启动定时任务
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    // 如果设置了立即执行，则立即执行一次
    if (this.options.immediate) {
      this.task();
    }

    // 设置定时器
    this.timer = window.setInterval(() => {
      this.task();
    }, this.options.interval);
  }

  /**
   * 停止定时任务
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    this.isRunning = false;
  }

  /**
   * 重启定时任务
   */
  restart(): void {
    this.stop();
    this.start();
  }

  /**
   * 立即执行一次任务
   */
  runOnce(): void {
    this.task();
  }

  /**
   * 更新定时任务配置
   */
  updateOptions(options: Partial<ScheduleOptions>): void {
    this.options = {
      ...this.options,
      ...options
    };

    // 如果任务正在运行，则重启以应用新的配置
    if (this.isRunning) {
      this.restart();
    }
  }

  /**
   * 获取任务运行状态
   */
  getStatus(): boolean {
    return this.isRunning;
  }

  /**
   * 销毁定时任务
   */
  destroy(): void {
    this.stop();
    this.task = () => {};
  }
}

// 工厂函数，创建定时任务实例
export function createSchedule(task: () => void, options: ScheduleOptions): Schedule {
  return new Schedule(task, options);
}
