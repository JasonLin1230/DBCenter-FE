# DBCenter


> 数据库操作管理系统，通过后台系统，添加数据表、数据字段。通过接口调用，完成数据库增删改查的操作。
> 在需求简单的情况下，前端开发可以通过本系统，独立开发项目。


预览地址：[http://dbcenter.top](http://dbcenter.top)


## 技术栈

前端：vue + vue-router + axios

后端：koa + mysql


## 项目运行

#### 源码地址:  [https://github.com/wrz199306/dbcenter](https://github.com/wrz199306/dbcenter) 

#### 如何运行

运行前请先安装`nodejs`

`clone`项目到本地
```
git clone https://github.com/wrz199306/dbcenter
```

注意当前分支是否处于`develop`
```
git checkout develop
```

安装依赖
```
npm install
```

前端运行
```
npm run dev
```

后端运行

```
npm run server
```


## 接口列表

### 数据插入接口

#### 调用地址：/app/:tableName

#### 请求方式：POST

#### 返回类型：JSON

#### 请求参数(params)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| tableName | String | 是 | 将要操作的数据表名,通过[DBCenter](http://dbcenter.top)可添加数据表 |

#### 请求参数(header)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| phone | String | 是 | [DBCenter](http://dbcenter.top)登陆所用到的手机号 |
| secret | String | 是 | [DBCenter](http://dbcenter.top)登陆所用到的密码 |

#### 请求参数(body)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| attrData | Object | 是 | 将要插入的数据，请严格遵守[DBCenter](http://dbcenter.top)中所定义的数据规则 |

#### 请求示例：
```
var xhr = new XMLHttpRequest();

// 数据表person
xhr.open('post',`http://dbcenter.top/login/api/person`);

xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

// 头域中设置手机号和密码
xhr.setRequestHeader("phone", "186****8175");
xhr.setRequestHeader("secret", "123456");

// 将要插入数据表中的数据
var attrData = {
    person_name: 'Scrat',
    person_age: 25,
    person_base: '北京'
}

xhr.send(`attrData=${JSON.stringify(attrData)}`);

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
}
```

#### 正常返回示例：
| 字段 | 类型 | 描述 |
|:------:|:-------:|:-------------:|
| code | Number | 0为正确, >0错误 |
| data | Number | 插入的数据ID |

---
### 数据删除接口

#### 调用地址：/app/:tableName

#### 请求方式：DELETE

#### 返回类型：JSON

#### 请求参数(params)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| tableName | String | 是 | 将要操作的数据表名,通过[DBCenter](http://dbcenter.top/login/)可添加数据表 |

#### 请求参数(header)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| phone | String | 是 | [DBCenter](http://dbcenter.top/login/)登陆所用到的手机号 |
| secret | String | 是 | [DBCenter](http://dbcenter.top/login/)登陆所用到的密码 |

#### 请求参数(body)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| id | Number | 是 | 将要删除的数据ID |

#### 请求示例：
```
var xhr = new XMLHttpRequest();

// 数据表person
xhr.open('delete', `http://dbcenter.top/login/api/person`);

xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

// 头域中设置手机号和密码
xhr.setRequestHeader("phone", "186****8175");
xhr.setRequestHeader("secret", "123456");

// 将要删除的数据的ID
xhr.send(`id=1`);

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
}
```

#### 正常返回示例：
| 字段 | 类型 | 描述 |
|:------:|:-------:|:-------------:|
| code | Number | 0为正确, >0错误 |
| data | Number | success |

---
### 数据更新接口

#### 调用地址：/app/:tableName

#### 请求方式：PUT

#### 返回类型：JSON

#### 请求参数(params)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| tableName | String | 是 | 将要操作的数据表名,通过[DBCenter](http://dbcenter.top/login/)可添加数据表 |

#### 请求参数(header)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| phone | String | 是 | [DBCenter](http://dbcenter.top/login/)登陆所用到的手机号 |
| secret | String | 是 | [DBCenter](http://dbcenter.top/login/)登陆所用到的密码 |

#### 请求参数(body)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| id | Number | 是 | 将要更新的数据ID |
| newAttrData | Object | 是 | 将要更新的数据，请严格遵守[DBCenter](#)中所定义的数据规则 |


#### 请求示例：
```
var xhr = new XMLHttpRequest();
    
var attrData = {
    person_name: '大帅哥'
}

// 数据表Person
xhr.open('put', `http://dbcenter.top/login/api/person`);

xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

// 头域中设置手机号和密码
xhr.setRequestHeader("phone", "186****8175");
xhr.setRequestHeader("secret", "123456");

// id: 修改的数据id
// newAttrData: 新数据的值
xhr.send(`id=3&newAttrData=${JSON.stringify(attrData)}`);

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
}
```

#### 正常返回示例：
| 字段 | 类型 | 描述 |
|:------:|:-------:|:-------------:|
| code | Number | 0为正确, >0错误 |
| data | Number | success |
---
### 数据查询接口

#### 调用地址：/app/:tableName

#### 请求方式：GET

#### 返回类型：JSON

#### 请求参数(params)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| tableName | String | 是 | 将要操作的数据表名,通过[DBCenter](http://dbcenter.top/login/)可添加数据表 |

#### 请求参数(header)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| phone | String | 是 | [DBCenter](http://dbcenter.top/login/)登陆所用到的手机号 |
| secret | String | 是 | [DBCenter](http://dbcenter.top/login/)登陆所用到的密码 |

#### 请求参数(query)：
| 名称 | 类型 | 是否必须 | 说明 |
|:------:|:-------:|:-------------:|:-------------:|
| condition | String | 否 | 查询条件，JSON字符串 |


#### 请求示例：
```
var xhr = new XMLHttpRequest();
    
var condition = {
    person_name: 'Scrat'
}

// 数据表Person
xhr.open('get',`http://dbcenter.top/login/api/person?condition=${JSON.stringify(condition)}`);

// 头域中设置手机号和密码
xhr.setRequestHeader("phone","186****8175");
xhr.setRequestHeader("secret","123456");

xhr.send();

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
}
```

#### 正常返回示例：
| 字段 | 类型 | 描述 |
|:------:|:-------:|:-------------:|
| code | Number | 0为正确, >0错误 |
| data | Number | 数据列表 |
