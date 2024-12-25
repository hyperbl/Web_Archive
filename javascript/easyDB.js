// easyDB.mjs -- 提供方便的数据库操作接口

/**
 * EasyDB -- 简单的数据库操作接口(目前只支持localStorage)，
 * 尽管数据库存的都是字符串，但是这个类会自动将对象转换为字符串存储，
 * 取出时也会自动转换为对象
 */
class EasyDB {
    constructor(dbname) {
        this.dbname = dbname || "localStorage";
    }
    #db = null;
    /**
     * 获取数据库数据最大条数
     * @returns {int} 返回数据库数据最大条数
     */
    getLength() {
        return this.#db.length;
    }
    /**
     * 连接数据库
     */
    connect() {
        if (this.dbname === "localStorage") {
            this.#db = localStorage;
        } else {
            this.#db = null;
        }
    }
    /**
     * 关闭数据库
     */
    close() {
        this.#db = null;
    }
    /**
     * 根据key(一个整数)和value(一个文件对象)来存储数据,
     * 如果key已存在，则覆盖原有数据(相当于更新数据)
     * @param {int} key 
     * @param {object} value 
     */
    setItem(key, value) {
        this.#db.setItem(key, JSON.stringify(value));
    }
    /**
     * 根据key来获取数据
     * @param {int} key 
     * @returns {object} 返回key对应的value
     */
    getItem(key) {
        const value = this.#db.getItem(key);
        try {
            return JSON.parse(value);
        } catch (e) {
            console.warn(`EasyDB.getItem: Invalid JSON for key "${key}": .`, value);
            return null;
        }
    }
    /**
     * 根据key来删除数据
     * @param {int} key 
     * @returns {object} 返回被删除的数据
     */
    removeItem(key) {
        const value = this.getItem(key);
        this.#db.removeItem(key);
        return value;
    }
    /**
     * 清空数据库，mode: "all" 清空所有数据，"numeric" 只清空key为数字的数据
     * @param {string} mode 
     */
    clear(mode = "numeric") {
        for (let key in this.#db) {
            if (mode === "all" || (mode === "numeric" && isNumber(key))) {
                this.#db.removeItem(key);
            } else {
                console.warn(`EasyDB.clear: Invalid mode "${mode}".`);
                break;
            }
        }
    }
    keys() {
        return Object.keys(this.#db);
    }
    values() {
        return Object.values(this.#db).map(value => {
            try {
                return JSON.parse(value);
            } catch {
                return null;
            }
        });
    }
    entries() {
        return Object.entries(this.#db).map(([key, value]) => {
            try {
                return [key, JSON.parse(value)];
            } catch {
                return [key, null];
            }
        });
    }
    /**
     * 迭代数据库中的所有key为整数的数据
     * @param {(key: int, value: object) => void} callback 
     */
    forEach(callback) {
        // 只处理key为数字的数据
        for (let key in this.#db) {
            if (isNumber(key)) {
                const value = this.getItem(key);
                callback(key, value);
            }
        }
    }
    /**
     * 插入数据
     * @param {object} value 
     */
    insert(value) {
        let index = parseInt(localStorage.getItem("index") || 0);
        this.setItem(index, value);
        localStorage.setItem("index", index + 1);
    }
    /**
     * 根据传入的对象来删除所有符合条件数据
     * @param {object} value
     * @returns {Array<object>} 返回被删除的数据
     */
    delete(value) {
        let data = [];
        if (typeof value !== "object") {
            console.warn("EasyDB.delete: Invalid value.");
            return;
        }
        let flag = true;
        this.forEach((key, val) => {
            flag = true;
            for (const item in value) {
                if (val[item] !== value[item]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                data.push(this.removeItem(key));
            }
        });
        return data;
    }
    /**
     * 根据传入的对象来获取所有符合条件数据
     * @param {object} value 
     * @returns {Array<object>} 返回符合条件的数据
     */
    select(value) {
        if (typeof value !== "object") {
            console.warn("EasyDB.select: Invalid value.");
            return;
        }
        let data = [];
        let flag = true;
        this.forEach((key, val) => {
            flag = true;
            for (const item in value) {
                if (val[item] !== value[item]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                data.push(val);
            }
        });
        return data;
    }
    // 以下方法均为异步方法
    /**
     * 异步方式插入数据
     * @param {object} value 
     * @returns {Promise<void>} 返回一个Promise对象
     */
    async insertAsync(value) {
        return new Promise((resolve, reject) => {
            try {
                this.insert(value);
                resolve();
            } catch (e) {
                console.log("EasyDB.insertAsync: Error occurred when inserting data.");
                reject(e);
            }
        });
    }
    /**
     * 异步方式删除数据
     * @param {object} value 
     * @returns {Promise<void>} 返回一个Promise对象
     */
    async deleteAsync(value) {
        return new Promise((resolve, reject) => {
            try {
                let data = this.delete(value);
                resolve(data);
            } catch (e) {
                console.log("EasyDB.deleteAsync: Error occurred when deleting data.");
                reject(e);
            }
        });
    }
    /**
     * 异步方式获取符合条件数据
     * @param {object} value 
     * @returns {Promise<object>} 返回一个Promise对象，resolve时返回key对应的value
     */
    async selectAsync(value) {
        return new Promise((resolve, reject) => {
            let data = [];
            try {
                data = this.select(value);
                resolve(data);
            } catch (e) {
                console.log("EasyDB.selectAsync: Error occurred when selecting data.");
                reject(e);
            }
        });
    }
    /**
     * 异步方式获取所有数据
     * @returns {Promise<Array>} 返回一个Promise对象，resolve时返回所有数据
     */
    async getAll() {
        return new Promise((resolve, reject) => {
            let data = [];
            try {
                this.forEach((key, value) => {
                    data.push(value);
                });
                resolve(data);
            } catch (e) {
                console.log("EasyDB.getAll: Error occurred when getting all data.");
                reject(e);
            }
        })
    };
}

function isNumber(value) {
    return /^\d+$/.test(value);
}

export {EasyDB};