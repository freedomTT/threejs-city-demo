wip

```js
// 获取模型大小 调整位置到远点
let box = new THREE.Box3();
box.expandByObject(obj);
let x = -(box.max.x - box.min.x) / 2;
let y = -(box.max.y - box.min.y) / 2;
```
