"use strict";

export class User {
    static DATA = Symbol("用户数据存储标识");
    static sex = {
        male: '男性',
        female: '女性',
        unknow: '未知',
    };
    constructor(name = '', age = null, gender = null, ID, passwd, image = new Image(), other = {}) {
        this[User.DATA] = { name, age, gender, ID, passwd, image, other };
    }
    //使用者姓名访问器
    get name() {
        return this[User.DATA].name;
    }
    set name(newName) {
        if ((newName ?? false) && (1 <= newName.length && newName.length <= 15)) {
            this[User.DATA].name = newName;
        } else {
            throw new Error("定义无效");
        }
    }
    //年龄访问器
    get age() {
        return this[User.DATA].age;
    }
    set age(newAge) {
        if ((newAge || false) && (newAge.length <= 3) && (Number.isSafeInteger(Number(newAge))) && newAge > 0) {
            this[User.DATA].age = Number(newAge);
        } else {
            throw new Error("定义无效");
        }
    }
    get gender() {
        return this[User.DATA].gender
    }
    set gender(value) {//
        this[User.DATA].gender = value
    }

    get ID() {//ID获取访问器
        return this[User.DATA].ID;
    }
    set ID(newID) {
        // #region 进行验证的代码
        // code
        // #endregion
        return this[User.DATA].ID = newID;
    }
    get passwd() {
        // #region 进行验证的代码
        // code
        // #endregion
        return this[User.DATA].passwd;
    }
    set passwd(newPW) {
        // #region 进行验证的代码
        // code
        // #endregion
        this[User.DATA].passwd = newPW;
    }
    get image() {
        return this[User.DATA]
    }
    set image(头像) {
        this[User.DATA].image = 头像;
    }
    get other() {
        return this[DATA].other;
    }
    set other(setValue) {
        this[DATA].other = setValue
    }
}
Object.preventExtensions(User);

// test
let user = new User('', '0', User.sex.unknow, 123456);
