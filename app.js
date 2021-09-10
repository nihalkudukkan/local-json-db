const express = require('express');
const Services = require('./services');
const services = new Services()

const app = express();

app.use(express.json())

app.get('/readAll', async(_, res)=>{
    try {
        let users = await services.readAll('./database/user.json')
        res.json(users)
    } catch (error) {
        res.status(400).json(error);
    }
})

app.post('/write', async(req, res)=>{
    let {name, age} = req.body;
    if (!name || !age) {
        return res.json({error: "Please provide all fields"})
    }
    try {
        let message = await services.write('./database/user.json', {name, age})
        res.json({message})
    } catch (error) {
        res.status(400).json({error})
    }
})

app.get('/search', async(req, res)=>{
    let {name} = req.query;
    if (!name) {
        return res.status(400).json({error: "please give a name"})
    }
    try {
        let data = await services.dataForName('./database/user.json', name);
        res.json(data)
    } catch (error) {
        res.status(400).json({error})
    }
})

app.delete('/delete', async(req, res)=>{
    let {name} = req.query;
    if (!name) {
        return res.status(400).json({error: "please give a name"})
    }
    try {
        let message = await services.deleteByName('./database/user.json', name);
        res.json({message})
    } catch (error) {
        res.status(400).json({error})
    }
})

app.put('/update', async(req, res)=>{
    try{
        let {name, age} = req.body;
        if (!name || !age) {
            return res.json({error: "Please provide all fields"})
        }
        let message = await services.updateByName('./database/user.json', name, age)
        res.json({message})
    } catch(error) {
        res.status(400).json({error})
    }
})

app.listen(8080, ()=>{console.log("listening at http://localhost:8080");})