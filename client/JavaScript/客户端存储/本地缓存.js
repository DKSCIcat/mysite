"use strict";

const dbName = "the_name";
// 我们的客户数据看起来像这样。
const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];
let request = indexedDB.open(dbName, 3);
var db = request.result;
// request.onerror = function (event) {
//     // 错误处理
//     console.log("Error :failed to open");
// };
// request.onupgradeneeded = (event) => {
//     db = event.target.result;

//     // 建立一个对象仓库来存储我们客户的相关信息，我们选择 ssn 作为键路径（key path）
//     // 因为 ssn 可以保证是不重复的
//     let objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

//     // 建立一个索引来通过姓名来搜索客户。名字可能会重复，所以我们不能使用 unique 索引
//     objectStore.createIndex("name", "name", { unique: false });

//     // 使用邮箱建立索引，我们向确保客户的邮箱不会重复，所以我们使用 unique 索引
//     objectStore.createIndex("email", "email", { unique: true });

//     // 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
//     objectStore.transaction.oncomplete = (event) => {
//         // 将数据保存到新创建的对象仓库
//         let customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
//         customerData.forEach(function (customer) {
//             customerObjectStore.add(customer);
//         });
//     };
//     // db = event.target.result;
//     // let objStore = db.createObjectStore('name', { autoIncrement: true });
//     // customerData.forEach((customer) => {
//     //     objStore.add(customer.name);
//     // });


// };

// request.onupgradeneeded = function() {
//     var db = request.result;
//     var storeName = db.createObjectStore("storeName", {keyPath: "keyAttribute"});
//     storeName.createIndex("testIndex", "testCase", { unique: false });
// };
// request.onerror = function(event) {
//   // Do something with request.errorCode!
//   console.log("failed opening DB: "+request.errorCode)
// };
// request.onsuccess = function(event) {
//   // Do something with request.result!
//   db = request.result;
//   console.log("opened DB")
// };

//Adding function - can pass values as function params
function addData(objectStoreName) {
    // Start a new transaction
    var transaction = db.transaction(objectStoreName, "readwrite");
    var objectStore = transaction.objectStore(objectStoreName);
    // Add some data
    var request = objectStore.put({ testCase: 'ddi', timestamp: performance.now(), name: "testname2", data: 'asdsadas' });
    request.onsuccess = function (event) {
        // event.target.result === customer.ssn;
        console.log("request.onsuccess: " + event.target.result);
    };
    request.onerror = function (event) {
        // event.target.result === customer.ssn;
        console.log("request.onerror: " + request.errorCode);
    };
    transaction.oncomplete = function (event) {
        console.log("All added to " + objectStore + "!");
    };
    transaction.onerror = function (event) {
        // Don't forget to handle errors!
        console.log("Error in adding data to " + objectStore + "!");
    };
}


function getData(objectStoreName) {
    // Start a new transaction
    var transaction = db.transaction(objectStoreName, "readwrite");
    var objectStore = transaction.objectStore(objectStoreName);
    var index = objectStore.index("TestCaseIndex");
    // Query the data
    var getDDIData = index.get("ddi");
    getDDIData.onsuccess = function () {
        console.log(getDDIData.result);
    };
}



addData(customerData);
getData(customerData)