const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://zaidzaihan1611:n2kRMBbjonlmy6rF@vms.qotxlyq.mongodb.net/";
const client = new MongoClient(uri);

var jwt = require('jsonwebtoken');
const privatekey = "helloworld";
var token;

const express = require('express');
const app = express();
const port = 3000; 

const bcrypt = require('bcrypt');
const saltround = 10;
var hashed;

app.use(express.json())

async function register(identification, password, room_number, name, gender, ethnicity,temperature, dateofbirth, citizenship,document_type, expiryDate, address, town, postcode, state, country, phone_number, vehicle_number, vehicle_type, visitor_category, preregistered_pass, fever, sorethroat, drycough, runnynose, shortnessbreath, bodyache, travelledoversea, contactwithcovid, recoveredfromcovid, covidtestdone, date){
    await client.connect();
    const exist = await client.db("VMS").collection("Visitors").findOne({identification_No: identification});
    if(exist){
        console.log("User is already registered!");
    }else{
        await client.db("VMS").collection("Visitors").insertOne({
            identification_No: identification,
            password: password,
            room_number : room_number,
            name: name,
            gender: gender,
            ethnicity: ethnicity,
            temperature: temperature,
            dateofbirth: dateofbirth,
            citizenship: citizenship,
            document_type: document_type,
            expiryDate: expiryDate,
            address: address,
            town: town,
            postcode: postcode,
            state: state,
            country: country,
            phone_number: phone_number,
            vehicle_number: vehicle_number,
            vehicle_type: vehicle_type,
            visitor_category: visitor_category,
            preregistered_pass: preregistered_pass
        });
        await client.db("VMS").collection("Health Status").insertOne({
            identification_No: identification,
            name: name,
            fever: fever,
            sore_throat: sorethroat,
            dry_cough: drycough,
            runny_nose: runnynose,
            shortness_of_breath: shortnessbreath,
            body_ache: bodyache,
            travelled_oversea_last_14_days: travelledoversea,
            contact_with_person_with_Covid_19: contactwithcovid,
            recovered_from_covid_19: recoveredfromcovid,
            covid_19_test: covidtestdone,
            date: date
        });
        console.log("registered successfully!");
    }
}
    

async function login(identification, password){
    await client.connect();
    const exist =await client.db("VMS").collection("UserInfo").findOne({identification_No: identification});
    console.log(exist.password);
    if(exist){
        if(await exist.password == password){
            console.log("Login Success!");
            token = jwt.sign({ identification_No: identification, role: exist.role }, privatekey);//login usage simpan dlu
            console.log(token);
        }else{
            console.log("Wrong password!");
        }
    }else{
        console.log("Username not exist!");
    }
}

app.post('/register', async function(req, res){
    var token = req.header('Authorization').split(" ")[1];
    try {
        var decoded = jwt.verify(token, privatekey);
        console.log(decoded.role)
      } catch(err) {
        console.log("Error!")
      }
    console.log(decoded);
    if (await decoded.role == "Admin" || await decoded.role == "Security"){
        const {identification_No, password, room_number, name, gender, ethnicity, temperature, dateofbirth, citizenship, document_type, expiryDate, address, town, postcode, state, country, phone_number, vehicle_number, vehicle_type, visitor_category, preregistered_pass, fever, sore_throat, dry_cough, runny_nose, shortness_of_breath, body_ache, travelled_oversea_last_14_days, contact_with_person_with_Covid_19, recovered_from_covid_19, covid_19_test, date} = req.body;
        await register(identification_No, password, room_number, name, gender, ethnicity, temperature, dateofbirth, citizenship, document_type, expiryDate, address, town, postcode, state, country, phone_number, vehicle_number, vehicle_type, visitor_category, preregistered_pass, fever, sore_throat, dry_cough, runny_nose, shortness_of_breath, body_ache, travelled_oversea_last_14_days, contact_with_person_with_Covid_19, recovered_from_covid_19, covid_19_test, date);
    }else{
        console.log("You have no access!")
    }
    
});

//login post function
app.post('/login', async function(req, res){
    const {identification_No, password, visitor_category} = req.body;
    await login(identification_No, password, visitor_category);
    
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  });

