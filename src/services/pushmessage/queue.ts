/*
 * @File: 消息队列
 * @Date: 2018-09-05 11:33:25 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-09-10 17:54:42
 */

// 时间排序
// 重要程度排序
// 队列
/**
 * 1. 生成实例
 * 2. 对外方法push
 * 3. push 需要排序
 * 4. pop 转化数据为action and data
 * 5. 通知db
 */

import Queue from "p-queue";

export const queueInstance: any = new Queue({
  autoStart: true,
});
// @ts-ignore
window.queueInstance = queueInstance;
// @ts-ignore
// queueInstance.onEmpty()
