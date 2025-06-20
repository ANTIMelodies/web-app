import AV from 'leancloud-storage';

AV.init({
  appId: '5ItHp8kUxZZCYjIArBTttcwN-gzGzoHsz',
  appKey: 'xOKXw1QWGbqOCuKKG4l2hBn0',
  serverURL: 'https://5ithp8kz.lc-cn-n1-shared.com'
});

// 数据表名
export const TABLES = {
  resources: 'Resources',
  coding: 'Coding',
  events: 'Events',
  messages: 'Messages',
};

// 通用查询
export async function fetchAll(table) {
  const query = new AV.Query(table);
  query.ascending('order');
  const res = await query.find();
  return res.map(item => ({ ...item.toJSON(), objectId: item.id }));
}

// 通用保存（新增/更新）
export async function saveItem(table, data, objectId) {
  const Obj = AV.Object.extend(table);
  let obj;
  if (objectId) {
    obj = AV.Object.createWithoutData(table, objectId);
    Object.entries(data).forEach(([k, v]) => obj.set(k, v));
  } else {
    obj = new Obj();
    Object.entries(data).forEach(([k, v]) => obj.set(k, v));
  }
  await obj.save();
  return obj;
}

// 通用删除
export async function deleteItem(table, objectId) {
  const obj = AV.Object.createWithoutData(table, objectId);
  await obj.destroy();
} 