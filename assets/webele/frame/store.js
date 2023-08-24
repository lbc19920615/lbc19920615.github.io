export function getStorageSync(key) {
    let str = localStorage.getItem(key)
    return JSON.parse(str)
}

export function setStorageSync(key, value) {
    let str = JSON.stringify(value)
    localStorage.setItem(key, str)
}

export function removeStorageSync(key) {
    localStorage.removeItem(key)
}