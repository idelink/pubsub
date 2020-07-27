# JavaScript中的发布/订阅模式

## 介绍
在JavaScript中发布/订阅模式非常常见，并且在工作方式上与观察者模式非常相似，除了在观察者模式中，观察者是直接由其主题通知的，而在发布者/订阅者中，订阅者是通过渠道通知的 位于发布者和订阅者之间的来回传递消息。

当我们实现它时，我们将需要一个发布者，一个订阅者，以及一个存储从订阅者那里注册的回调函数的对象。

## 发布者/订阅者

下面我们将在代码中实现发布者/订阅者。

### 存储器

首先我们定义一个变量用于存储回调函数：
```js
  const subscribers = {}
```

### 订阅者

接下来，我们将定义`subscribe`用于将回调添加到的方法`subscribers`：

```js
function subscribe(eventName, callback) {
  if (!Array.isArray(subscribers[eventName])) {
    subscribers[eventName] = []
  }
  subscribers[eventName].push(callback)
}
```
这里发生的是，在尝试为事件名称注册回调侦听器之前，它会检查存储中的`eventName`属性`subscribers`是否已经是`array`。如果不是，则假定这将是第一个注册的回调，`subscribers[eventName]`并将其初始化为数组。然后，将回调函数添加到数组中。

### 发布者

当publish事件触发时，它会带两个参数：
* 事件名称`eventName`
* 事件data，将作为`subscribers[eventName]`每个回调函数的参数。可以是一个或多个参数

```js
function publish(eventName, ...args) {
  if (!Array.isArray(subscribers[eventName])) {
    return false
  }

  subscribers[eventName].forEach(callback => {
    callback.apply(this, args)
  })
}
```

在发布事件时，回先检查事件是否被注册过，如果没有，则返回。然后我们通过遍历`subscribers[eventName]`中的回调函数，并将data(这里的data为args数组)作为回调参数来执行这它。

### 注册订阅者

根据上述代码描述，我们有了以下订阅者：

```js
subscribe('data', (...args) => {
  console.log(...args)
})
```

并且在将来的某个时间里通过`publish`调用该方法：
```js
publish('data', {
  type: 'update',
  data: {
    value: 1000
  }
})
```

### 取消订阅

这就是发布者/订阅者模式的工作方式！我们实现了`subscribe`和`publish`函数以及一个储存回调函数的全局变量`subscribers。subscribe用于注册事件以及回调函数，publish用于触发所有已注册回调的方法。

不过还有一个问题。在真实的应用程序中，如果我们订阅许多回调，我们可能会遭受永无止境的内存泄漏。因此，我们最后需要的是一种在不再需要订阅的回调时将其删除的方法。

通常有两种方案来取消订阅：
1. 实现unsubscribe方法, 在需要取消订阅时调用该方法
2. 在subscribe方法中返回取消订阅函数

这里我们采用方案2来实现取消订阅，更改订阅部分代码为：
```js
function subscribe(eventName, callback) {
  if (!Array.isArray(subscribers[eventName])) {
    subscribers[eventName] = []
  }
  const index = subscribers[eventName].length

  subscribers[eventName].push(callback)

  return () => {
    subscribers[eventName].splice(index, 1)
  }
}
```
在该示例中，我们在添加subscriber之前获取`subscribers`的长度，然后通过`splice`方法来删除我们要查找的项目索引。

这样，当我们需要取消调用时，只需要执行订阅时的返回函数即可.
```js
const unsubscribe = subscribe('data', (...args) => {
  console.log('Received data:', ...args)
})

// 取消订阅
unsubscribe()
```

## 在Vue中实现发布/订阅

在Vue中，我们可以通过event Hub更方便更简单的实现发布订阅模式。

```js
import Vue from 'vue'

const eventHub = new Vue()

const topic = {
  publish(eventName, ...args) {
    eventHub.$emit(eventName, ...args)
  },
  subscribe(eventName, listener) {
    eventHub.$on(eventName, listener)
  },
  off(eventName) {
    eventHub.$off(eventName)
  }
}

export default topic

```

---

本文已同步到个人博客网站, 地址:  [JavaScript中的发布/订阅模式](https://www.gogoing.site/articles/0e9d68bc-0b1c-484c-bc84-70ce0e4b01db.html)

如果你觉得这篇文章对你有帮助以及你对前端有着浓厚的兴趣，欢迎关注微信公众号-<b>前端学堂</b>，更多精彩文章等着你！
