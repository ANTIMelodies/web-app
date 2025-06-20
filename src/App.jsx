import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ConfigProvider, Button, Input, Modal, Form, List, message, Tabs } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { CopyOutlined, UploadOutlined, DownloadOutlined, ImportOutlined, LikeOutlined } from '@ant-design/icons';

function Navbar() {
  return (
    <nav className="w-full flex justify-center py-6 bg-white/80 backdrop-blur shadow-sm mb-8 sticky top-0 z-10">
      <ul className="flex gap-8 text-lg font-medium">
        <li><Link className="transition hover:text-black hover:scale-110" to="/">首页</Link></li>
        <li><Link className="transition hover:text-black hover:scale-110" to="/resources">资源分享</Link></li>
        <li><Link className="transition hover:text-black hover:scale-110" to="/events">活动展示</Link></li>
        <li><Link className="transition hover:text-black hover:scale-110" to="/board">留言板</Link></li>
        <li><Link className="transition hover:text-black hover:scale-110" to="/contact">联系我们</Link></li>
      </ul>
    </nav>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 }
};
const pageTransition = { type: "spring", duration: 0.6 };

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}

function HeroBanner() {
  // 图片列表，hero_banner 永远第一张
  const images = [
    '/img/hero_banner.JPG',
    '/img/test.PNG'
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-4xl h-64 md:h-96 mx-auto rounded-3xl overflow-hidden shadow-xl mb-8 bg-gray-200">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt="banner"
          className="object-contain w-full h-full select-none pointer-events-none"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8 }}
          draggable={false}
        />
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index ? 'bg-white/90 shadow' : 'bg-white/40'}`}
            onClick={() => setIndex(i)}
            aria-label={`切换到第${i+1}张`}
          />
        ))}
      </div>
    </div>
  );
}

function Home() {
  return (
    <AnimatedPage>
      <HeroBanner />
      <section className="flex flex-col items-center justify-center min-h-[40vh]">
        <motion.h1 className="text-5xl font-bold mb-4" initial={{opacity:0, y:-40}} animate={{opacity:1, y:0}} transition={{duration:0.8}}>创想网络信息协会</motion.h1>
        <motion.p className="text-xl text-gray-500 mb-6" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3, duration:0.7}}>创新 · 交流 · 成长</motion.p>
        <motion.p className="text-gray-700 max-w-xl text-center" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6, duration:0.7}}>
          欢迎来到创想网络信息协会官网！我们致力于为同学们提供一个学习、交流、创新的平台，定期举办各类活动，分享优质资源，欢迎你的加入！
        </motion.p>
      </section>
    </AnimatedPage>
  );
}

// 工具函数：本地存储
const STORAGE_KEY = 'cxnet_data_v1';
const defaultData = {
  resources: [
    { title: '开源项目推荐', desc: '精选开源项目，适合学习和参与', img: '', link: '' },
    { title: '技术讲座PPT', desc: '历届讲座PPT下载', img: '', link: '' },
    { title: '社团内部文档', desc: '协会内部资料文档', img: '', link: '' }
  ],
  coding: [
    { name: 'LeetCode 刷题', link: 'https://leetcode.cn/' },
    { name: '菜鸟教程', link: 'https://www.runoob.com/' },
    { name: '力扣题解精选', link: 'https://leetcode-solution.cn/' }
  ],
  events: [
    { title: '2024春季编程马拉松', desc: '春季编程马拉松精彩回顾', img: '', link: '' },
    { title: '2023秋季技术沙龙', desc: '技术沙龙活动集锦', img: '', link: '' },
    { title: '2023暑期创新训练营', desc: '暑期创新训练营精彩瞬间', img: '', link: '' },
    { title: '更多精彩活动，敬请期待！', desc: '', img: '', link: '' }
  ],
  messages: []
};
function loadData() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d && d.resources && d.events && d.coding && d.messages) return d;
  } catch {}
  return defaultData;
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function exportData() {
  const data = localStorage.getItem(STORAGE_KEY);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cxnet_data_backup.json';
  a.click();
  URL.revokeObjectURL(url);
}
function importData(cb) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const d = JSON.parse(evt.target.result);
        if (d && d.resources && d.events && d.coding && d.messages) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
          cb && cb();
        } else {
          message.error('数据格式不正确');
        }
      } catch {
        message.error('导入失败，文件格式错误');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Admin 管理后台
function Admin() {
  const [data, setData] = useState(loadData());
  const [form] = Form.useForm();
  const [codingForm] = Form.useForm();
  const [modal, setModal] = useState({ open: false, type: '', idx: -1 });
  const [codingModal, setCodingModal] = useState({ open: false, idx: -1 });
  const [tab, setTab] = useState('resources');

  // 资源其它部分 新增/编辑
  const handleOk = () => {
    form.validateFields().then(values => {
      const newData = { ...data };
      if (modal.type === 'add') {
        newData.resources.push(values);
      } else if (modal.type === 'edit') {
        newData.resources[modal.idx] = values;
      }
      setData(newData);
      saveData(newData);
      setModal({ open: false, type: '', idx: -1 });
      message.success('保存成功');
      form.resetFields();
    });
  };
  // 资源其它部分 删除
  const handleDelete = idx => {
    Modal.confirm({
      title: '确定要删除吗？',
      onOk: () => {
        const newData = { ...data };
        newData.resources.splice(idx, 1);
        setData(newData);
        saveData(newData);
        message.success('已删除');
      }
    });
  };
  // 资源其它部分 打开编辑
  const openEdit = (type, idx = -1) => {
    setModal({ open: true, type, idx });
    if (type === 'edit') {
      form.setFieldsValue(data.resources[idx]);
    } else {
      form.resetFields();
    }
  };
  // 编程学习资料 新增/编辑
  const handleCodingOk = () => {
    codingForm.validateFields().then(values => {
      const newData = { ...data };
      if (codingModal.idx === -1) {
        newData.coding.push(values);
      } else {
        newData.coding[codingModal.idx] = values;
      }
      setData(newData);
      saveData(newData);
      setCodingModal({ open: false, idx: -1 });
      message.success('保存成功');
      codingForm.resetFields();
    });
  };
  // 编程学习资料 删除条目
  const handleCodingDelete = idx => {
    Modal.confirm({
      title: '确定要删除这条编程学习资料吗？',
      onOk: () => {
        const newData = { ...data };
        newData.coding.splice(idx, 1);
        setData(newData);
        saveData(newData);
        message.success('已删除');
      }
    });
  };
  // 编程学习资料 打开编辑
  const openCodingEdit = (idx = -1) => {
    setCodingModal({ open: true, idx });
    if (idx !== -1) {
      codingForm.setFieldsValue(data.coding[idx]);
    } else {
      codingForm.resetFields();
    }
  };
  // 留言删除
  const handleDeleteMsg = idx => {
    Modal.confirm({
      title: '确定要删除这条留言吗？',
      onOk: () => {
        const newData = { ...data };
        newData.messages.splice(idx, 1);
        setData(newData);
        saveData(newData);
        message.success('留言已删除');
      }
    });
  };
  // 图片上传（Base64）
  const handleImgUpload = (info, formIns, field) => {
    const file = info.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      formIns.setFieldsValue({ [field]: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-gray-100 p-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">内容管理后台</h2>
            <div className="flex gap-2">
              <Button icon={<DownloadOutlined />} onClick={exportData}>导出数据</Button>
              <Button icon={<ImportOutlined />} onClick={() => importData(()=>window.location.reload())}>导入数据</Button>
            </div>
          </div>
          <Tabs
            activeKey={tab}
            onChange={setTab}
            items={[{
              key: 'resources',
              label: '资源分享',
              children: (
                <>
                  <div className="mb-6">
                    <div className="font-bold text-lg mb-2">编程学习资料（置顶）</div>
                    <List
                      bordered
                      dataSource={data.coding}
                      renderItem={(item, idx) => (
                        <List.Item
                          actions={[
                            <Button size="small" onClick={() => openCodingEdit(idx)}>编辑</Button>,
                            <Button size="small" danger onClick={() => handleCodingDelete(idx)}>删除</Button>
                          ]}
                        >
                          <div className="flex flex-col md:flex-row md:items-center w-full gap-2">
                            <span className="font-bold text-gray-800 flex-1">{item.name}</span>
                            <span className="text-blue-500 break-all flex-1">{item.link}</span>
                          </div>
                        </List.Item>
                      )}
                      footer={<Button type="primary" onClick={() => openCodingEdit(-1)}>新增条目</Button>}
                    />
                  </div>
                  <div className="font-bold text-lg mb-2">其它资源</div>
                  <List
                    bordered
                    dataSource={data.resources}
                    renderItem={(item, idx) => (
                      <List.Item
                        actions={[
                          <Button size="small" onClick={() => openEdit('edit', idx)}>编辑</Button>,
                          <Button size="small" danger onClick={() => handleDelete(idx)}>删除</Button>
                        ]}
                      >
                        <div>
                          <b>{item.title}</b>
                          <div className="text-gray-500 text-sm">{item.desc}</div>
                          {item.img && <img src={item.img} alt="" className="h-10 mt-1 rounded" />}
                          {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">链接</a>}
                        </div>
                      </List.Item>
                    )}
                    footer={<Button type="primary" onClick={() => openEdit('add')}>新增资源</Button>}
                  />
                </>
              )
            }, {
              key: 'events',
              label: '活动展示',
              children: (
                <List
                  bordered
                  dataSource={data.events}
                  renderItem={(item, idx) => (
                    <List.Item
                      actions={[
                        <Button size="small" onClick={() => openEdit('edit', idx)}>编辑</Button>,
                        <Button size="small" danger onClick={() => handleDelete(idx)}>删除</Button>
                      ]}
                    >
                      <div>
                        <b>{item.title}</b>
                        <div className="text-gray-500 text-sm">{item.desc}</div>
                        {item.img && <img src={item.img} alt="" className="h-10 mt-1 rounded" />}
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">链接</a>}
                      </div>
                    </List.Item>
                  )}
                  footer={<Button type="primary" onClick={() => openEdit('add')}>新增活动</Button>}
                />
              )
            }, {
              key: 'messages',
              label: '留言管理',
              children: (
                <List
                  bordered
                  dataSource={data.messages}
                  renderItem={(item, idx) => (
                    <List.Item
                      actions={[
                        <Button size="small" danger onClick={() => handleDeleteMsg(idx)}>删除</Button>
                      ]}
                    >
                      <div>
                        <b>{item.name || '匿名'}</b>：{item.content}
                        <div className="text-gray-400 text-xs">{item.time}</div>
                        {typeof item.likes === 'number' && <span className="ml-2 text-green-600"><LikeOutlined /> {item.likes}</span>}
                      </div>
                    </List.Item>
                  )}
                />
              )
            }]}
          />
        </div>
        {/* 编程学习资料条目编辑弹窗 */}
        <Modal
          open={codingModal.open}
          title={codingModal.idx === -1 ? '新增条目' : '编辑条目'}
          onOk={handleCodingOk}
          onCancel={() => setCodingModal({ open: false, idx: -1 })}
          okText="保存"
          cancelText="取消"
        >
          <Form form={codingForm} layout="vertical">
            <Form.Item name="name" label="资源名称" rules={[{ required: true, message: '请输入资源名称' }]}> 
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item name="link" label="链接" rules={[{ required: true, message: '请输入链接' }]}> 
              <Input maxLength={200} />
            </Form.Item>
          </Form>
        </Modal>
        {/* 其它资源编辑弹窗 */}
        <Modal
          open={modal.open}
          title={modal.type === 'add' ? '新增' : '编辑'}
          onOk={handleOk}
          onCancel={() => setModal({ open: false, type: '', idx: -1 })}
          okText="保存"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}> 
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item name="desc" label="描述">
              <Input.TextArea maxLength={200} rows={2} />
            </Form.Item>
            <Form.Item name="img" label="图片URL">
              <Input placeholder="如 /img/xxx.jpg 或 https://..." addonAfter={
                <label className="cursor-pointer text-primary">
                  <UploadOutlined />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImgUpload(e, form, 'img')} />
                </label>
              } />
              <div className="text-xs text-gray-400 mt-1">可上传图片或粘贴图片链接</div>
            </Form.Item>
            <Form.Item name="link" label="链接">
              <Input placeholder="https://..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

function AnimatedModal({ open, onCancel, children }) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      maskStyle={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.3)' }}
      bodyStyle={{ borderRadius: 16, padding: 24, background: 'white' }}
      width={700}
      destroyOnClose
      modalRender={node => (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.32, type: 'spring' }}
        >{node}</motion.div>
      )}
    >
      {children}
    </Modal>
  );
}

function Resources() {
  const [items, setItems] = useState(() => (loadData().resources));
  const [coding, setCoding] = useState(() => (loadData().coding));
  const [modal, setModal] = useState({ open: false, item: null });
  const [codingModal, setCodingModal] = useState(false);
  useEffect(() => {
    const onStorage = () => {
      setItems(loadData().resources);
      setCoding(loadData().coding);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  // 复制链接
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <AnimatedPage>
      <section className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl mt-8">
        <motion.h2 className="text-3xl font-bold mb-4" initial={{opacity:0, x:-40}} animate={{opacity:1, x:0}} transition={{duration:0.7}}>资源分享</motion.h2>
        {/* 编程学习资料卡片 */}
        <motion.div
          className="bg-gradient-to-br from-blue-100 to-white rounded-3xl p-5 shadow-lg transition cursor-pointer mb-8 hover:shadow-2xl hover:scale-105 border border-blue-200"
          whileHover={{ scale: 1.04, boxShadow: '0 12px 40px 0 rgba(31,38,135,0.14)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setCodingModal(true)}
        >
          <div className="font-bold text-lg mb-2 text-blue-900">编程学习资料</div>
          <div className="text-gray-500 text-sm">点击查看全部条目</div>
        </motion.div>
        {/* 其它资源 */}
        <div className="grid gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.title + idx}
              className="bg-gray-50 rounded-2xl p-4 shadow transition cursor-pointer"
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.12)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
              onClick={() => setModal({ open: true, item })}
            >
              <div className="flex gap-4 items-center">
                {item.img && <img src={item.img} alt="" className="h-16 w-16 object-cover rounded-lg border" />}
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-800">{item.title}</div>
                  {item.desc && <div className="text-gray-500 text-sm mb-1">{item.desc}</div>}
                  {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">点击查看</a>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* 其它资源弹窗 */}
        <AnimatedModal open={modal.open} onCancel={() => setModal({ open: false, item: null })}>
          {modal.item && (
            <div className="flex flex-col items-center">
              {modal.item.img && <img src={modal.item.img} alt="" className="h-32 w-32 object-cover rounded-2xl mb-4" />}
              <div className="text-2xl font-bold mb-2 text-center">{modal.item.title}</div>
              {modal.item.desc && <div className="text-gray-600 mb-2 text-center whitespace-pre-line">{modal.item.desc}</div>}
              {modal.item.link && <a href={modal.item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">点击访问链接</a>}
            </div>
          )}
        </AnimatedModal>
        {/* 编程学习资料弹窗 */}
        <AnimatedModal open={codingModal} onCancel={() => setCodingModal(false)}>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-4 text-center text-blue-900">编程学习资料</div>
            <ul className="w-full space-y-3">
              {coding.map((item, idx) => (
                <li
                  key={idx}
                  className="flex flex-col md:flex-row md:items-center bg-blue-50 rounded-xl px-4 py-3 select-all break-all border border-blue-100 shadow-sm"
                >
                  <span className="font-bold text-gray-800 flex-shrink-0 md:w-32 mb-1 md:mb-0 truncate">{item.name}</span>
                  <Button
                    type="link"
                    icon={<CopyOutlined />}
                    size="small"
                    className="text-blue-600 font-mono break-all text-left"
                    style={{ padding: 0, wordBreak: 'break-all', whiteSpace: 'normal' }}
                    onClick={() => handleCopy(item.link)}
                  >{item.link}</Button>
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-400 mt-2">* 点击链接可复制</div>
          </div>
        </AnimatedModal>
      </section>
    </AnimatedPage>
  );
}

function Events() {
  const [items, setItems] = useState(() => (loadData().events));
  const [modal, setModal] = useState({ open: false, item: null });
  useEffect(() => {
    const onStorage = () => setItems(loadData().events);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return (
    <AnimatedPage>
      <section className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-8">
        <motion.h2 className="text-3xl font-bold mb-4" initial={{opacity:0, x:40}} animate={{opacity:1, x:0}} transition={{duration:0.7}}>活动展示</motion.h2>
        <div className="grid gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.title + idx}
              className="bg-gray-50 rounded-xl p-4 shadow transition cursor-pointer"
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.12)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
              onClick={() => setModal({ open: true, item })}
            >
              <div className="flex gap-4 items-center">
                {item.img && <img src={item.img} alt="" className="h-16 w-16 object-cover rounded-lg border" />}
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-800">{item.title}</div>
                  {item.desc && <div className="text-gray-500 text-sm mb-1">{item.desc}</div>}
                  {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">点击查看</a>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* 弹窗展示详细内容，带毛玻璃遮罩 */}
        <Modal
          open={modal.open}
          onCancel={() => setModal({ open: false, item: null })}
          footer={null}
          centered
          maskStyle={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.3)' }}
          bodyStyle={{ borderRadius: 16, padding: 24 }}
          width={400}
          destroyOnClose
        >
          {modal.item && (
            <div className="flex flex-col items-center">
              {modal.item.img && <img src={modal.item.img} alt="" className="h-32 w-32 object-cover rounded-xl mb-4" />}
              <div className="text-2xl font-bold mb-2 text-center">{modal.item.title}</div>
              {modal.item.desc && <div className="text-gray-600 mb-2 text-center whitespace-pre-line">{modal.item.desc}</div>}
              {modal.item.link && <a href={modal.item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">点击访问链接</a>}
            </div>
          )}
        </Modal>
      </section>
    </AnimatedPage>
  );
}

function Board() {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [msgs, setMsgs] = useState(() => loadData().messages);
  // 提交留言
  const handleSubmit = () => {
    if (!content.trim()) return;
    const newMsg = {
      name: name.trim(),
      content: content.trim(),
      time: new Date().toLocaleString(),
      likes: 0
    };
    const all = [...msgs, newMsg];
    setMsgs(all);
    const d = loadData();
    d.messages = all;
    saveData(d);
    setContent('');
    setName('');
  };
  // 点赞
  const handleLike = idx => {
    const all = msgs.slice();
    all[idx].likes = (all[idx].likes || 0) + 1;
    setMsgs(all);
    const d = loadData();
    d.messages = all;
    saveData(d);
  };
  useEffect(() => {
    const onStorage = () => setMsgs(loadData().messages);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return (
    <AnimatedPage>
      <section className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-8">
        <motion.h2 className="text-3xl font-bold mb-4" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{duration:0.7}}>留言板</motion.h2>
        <motion.p className="text-gray-500 mb-4" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2, duration:0.7}}>欢迎留言交流建议或想法！</motion.p>
        <motion.form className="flex flex-col gap-4" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4, duration:0.7}} onSubmit={e => {e.preventDefault();handleSubmit();}}>
          <input className="border rounded px-3 py-2 focus:ring-2 focus:ring-primary/30 transition" placeholder="你的名字（可选）" value={name} onChange={e=>setName(e.target.value)} />
          <textarea className="border rounded px-3 py-2 focus:ring-2 focus:ring-primary/30 transition" placeholder="留言内容" rows={3} value={content} onChange={e=>setContent(e.target.value)} />
          <motion.button
            type="submit"
            className="bg-primary text-white rounded px-4 py-2 w-fit self-end transition"
            whileHover={{ scale: 1.08, boxShadow: "0 4px 16px 0 rgba(31,38,135,0.12)" }}
            whileTap={{ scale: 0.96 }}
          >
            提交
          </motion.button>
        </motion.form>
        <div className="mt-8 space-y-4">
          {msgs.map((msg, idx) => (
            <div key={idx} className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-700">{msg.name || '匿名'}</div>
                <div className="text-gray-800 mb-1">{msg.content}</div>
                <div className="text-gray-400 text-xs">{msg.time}</div>
              </div>
              <button className="ml-4 flex items-center gap-1 text-success hover:scale-110 transition" onClick={()=>handleLike(idx)}>
                <LikeOutlined /> {msg.likes || 0}
              </button>
            </div>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
}

function Contact() {
  return (
    <AnimatedPage>
      <section className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-8">
        <motion.h2 className="text-3xl font-bold mb-4" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{duration:0.7}}>联系我们</motion.h2>
        <motion.ul className="text-gray-700 space-y-2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3, duration:0.7}}>
          <li>邮箱：cxnet@university.edu</li>
          <li>QQ群：123456789</li>
          <li>微信：cxnet_official</li>
        </motion.ul>
      </section>
    </AnimatedPage>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/events" element={<Events />} />
        <Route path="/board" element={<Board />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
        <Navbar />
        <AnimatedRoutes />
        <footer className="mt-10 text-gray-400 text-sm text-center py-6">© 2024 创想网络信息协会</footer>
      </div>
    </Router>
  );
} 