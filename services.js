const fs = require('fs');

class Services {
    readAll(file) {
        return new Promise((resolve, reject)=>{
            fs.readFile(file, 'utf-8', (err, data)=>{
                if (err) {
                    reject("File read error")
                } else {
                    try {
                        let obj = JSON.parse(data);
                        resolve(obj)
                    } catch (error) {
                        reject("Parse error")
                    }
                }
            })
        })
    }

    write(file, data) {
        return new Promise(async(resolve, reject)=>{
            try {
                let datas = await this.readAll(file)
                let {name} = data;
                let index = await this.indexOfName(file, name)
                if (index!=-1) {
                    return reject("data already exist")
                }
                let newData = [...datas, data]
                fs.writeFile(file, JSON.stringify(newData, null, 2), err=>{
                    if (err) {
                        return reject("write Error")
                    }
                    resolve("Successful")
                })
            } catch (error) {
                reject("write error")
            }
        })
    }

    indexOfName(file, name) {
        return new Promise(async(resolve, reject)=>{
            try {
                let datas = await this.readAll(file);
                let index = datas.map(i=>i.name).indexOf(name);
                resolve(index)
            } catch (error) {
                reject("Index check failure")
            }
        })
    }

    dataForName(file, name) {
        return new Promise(async(resolve, reject)=>{
            try {
                let response = await Promise.all([this.indexOfName(file, name), this.readAll(file)])
                let index = response[0];
                if (index==-1) {
                    return reject("no data found for the name " + name)
                }
                let datas = response[1];
                let data = datas[index];
                resolve(data)
            } catch (error) {
                reject("data check error")
            }
        })
    }

    deleteByName(file, name) {
        return new Promise(async(resolve, reject)=>{
            try {
                let response = await Promise.all([this.indexOfName(file, name), this.readAll(file)])
                let index = response[0];
                if (index==-1) {
                    return reject(`no data found for ${name}`)
                }
                let datas = response[1];
                datas.splice(index,1);
                fs.writeFile(file, JSON.stringify(datas, null, 2), err=>{
                    if (err) {
                        return reject("Write error")
                    }
                    resolve("deleted")
                })
            } catch (error) {
                reject("Deletion error")
            }
        })
    }

    updateByName(file, name, age) {
        return new Promise(async(resolve, reject)=>{
            let index = await this.indexOfName(file, name)
            if (index==-1) {
                return reject("no data for the name " + name)
            }
            let datas = await this.readAll(file);
            datas[index] = {name, age}
            fs.writeFile(file, JSON.stringify(datas, null, 2), err=>{
                if (err) {
                    return reject("Write error")
                }
                resolve("Updated")
            })
        })
    }
}

module.exports = Services;