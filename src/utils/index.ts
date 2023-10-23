/**
 * 给storage的key设置过期时间
 * @param key  键
 * @param value 值
 * @param expire 过期时间，单位是分钟
 */
export function setStorageExpire(key, value, expire) {
    const obj = {
        data: value,
        time: Date.now(),
        expire: 1000 * 60 * expire // 单位是分钟
    };
    localStorage.setItem(key, JSON.stringify(obj));
}


/**
 * 判断key是否过期
 * @param key 键
 */
export function getStorageExpire(key) {

    const val = localStorage.getItem(key);
    let storageInfo: any = {}
    if (val != null) {
        storageInfo = JSON.parse(val);
        const timeSpan = Date.now() - storageInfo.time;

        if (timeSpan > storageInfo.expire) {
            localStorage.removeItem(key);
            return null;
        }

        return storageInfo.data;

    }
    return null;

}