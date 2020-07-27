const subscribers = {}

const topic = {
  subscribe(eventName, callback) {
    if (!Array.isArray(subscribers[eventName])) {
      subscribers[eventName] = []
    }
    const index = subscribers[eventName].length

    subscribers[eventName].push(callback)

    return () => {
      subscribers[eventName].splice(index, 1)
    }
  },
  publish(eventName, ...args) {
    if (!Array.isArray(subscribers[eventName])) {
      return false
    }
  
    subscribers[eventName].forEach(callback => {
      callback.apply(this, args)
    })
  }
}

export default topic
