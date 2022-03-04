const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/MyFavCars');

const UUID = Sequelize.DataTypes.UUID;
const UUIDV4 = Sequelize.DataTypes.UUIDV4;

const Brand = db.define('brand', {
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: Sequelize.STRING
    },
    country: {
        type: Sequelize.STRING
    }
})

const Car = db.define('car', {
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.INTEGER
    }

})


Car.belongsTo(Brand);
Brand.hasMany(Car);

const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/brands', async(req, res, next) => {
    try{
        res.send(await Brand.findAll());
    }
    catch(ex){
        next(ex);
    }
})


const init =  async() => {
    try{
        await db.sync({ force:true });
        const alfaRomeo = await Brand.create({name:'ALFA ROMEO', country: 'ITALIAN'});
        const audi = await Brand.create({name:'AUDI', country: 'GERMAN'});
        const dodge = await Brand.create({name:'DODGE', country: 'AMERICAN'});
        const fordMustang = await Brand.create({name:'FORD MUSTANG', country: 'AMERICAN'});
        const jaguar = await Brand.create({name:'JAGUAR', country: 'BRITISH'});
        const lamborghini = await Brand.create({name:'LAMBORGHINI', country: 'ITALIAN'});
        const landRover = await Brand.create({name:'LAND ROVER', country: 'BRITISH'});
        const mercedesBenz = await Brand.create({name:'MERCEDES-BENZ', country: 'GERMAN'});
        const porsche = await Brand.create({name:'PORSCHE', country: 'GERMAN'});
        await Car.create({name: 'GUILIA', price: 43350, brandId: alfaRomeo.id });
        await Car.create({name: 'A5', price: 46000, brandId: audi.id });
        await Car.create({name: 'S5', price: 55300 , brandId: audi.id });
        await Car.create({name: 'CHALLENGER SRT', price: 61850, brandId: dodge.id });
        await Car.create({name: 'MUSTANG GT', price: 45785, brandId: fordMustang.id });
        await Car.create({name: 'SHELBY GT500', price: 72900, brandId: fordMustang.id });
        await Car.create({name: 'F-PACE', price: 50900, brandId: jaguar.id });
        await Car.create({name: 'F-TYPE', price: 71300, brandId: jaguar.id });
        await Car.create({name: 'URUS', price: 239231, brandId: lamborghini.id });
        await Car.create({name: 'RANGE ROVER SPORT', price: 70900, brandId: landRover.id });
        await Car.create({name: 'G63', price: 156450, brandId: mercedesBenz.id });
        await Car.create({name: 'PANAMERA', price: 88400, brandId: porsche.id });

        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port: ${port}`));
    }
    catch(ex){
        console.log(ex);
    }
};

init();