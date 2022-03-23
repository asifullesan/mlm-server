const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;




// middleware

app.use(cors());
app.use(express.json());
app.use(fileUpload());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfooq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






async function run() {
    try {
        await client.connect();
        const database = client.db('mlm');
        // const usersCollection = database.collection('users');
        const clientrequestCollection = database.collection('client-request');
        const complainCollection = database.collection('complain');




        // complain data

        app.get('/complain', async (req, res) => {
            const cursor = complainCollection.find({});
            const complain = await cursor.toArray();
            res.send(complain);
        })

        app.post('/complain', async (req, res) => {
            const complainItem = req.body;
            const result = await complainCollection.insertOne(complainItem)
            res.json(result);
        })







        // // users data

        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     const result = await usersCollection.insertOne(user)
        //     res.json(result);
        // })

        // app.put('/users', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // })


        // teams data

        app.post('/client-request', async (req, res) => {
            const accountType = req.body.accountType;
            const referId = req.body.referId;
            const name = req.body.name;
            const fatherName = req.body.fatherName;
            const motherName = req.body.motherName;
            const nomineeName = req.body.nomineeName;
            const dateOfBirth = req.body.dateOfBirth;
            const nidBirth = req.body.nidBirth;
            const profession = req.body.profession;
            const division = req.body.division;
            const district = req.body.district;
            const upzilla = req.body.upzilla;
            const post = req.body.post;
            const profilePic = req.files.profilePic;
            const profilePicData = profilePic.data;
            const encodeProfilePic = profilePicData.toString('base64');
            const profilePicBuffer = Buffer.from(encodeProfilePic, 'base64');
        
            const userReq = {
                accountType,
                referId,
                name,
                fatherName,
                motherName,
                nomineeName,
                dateOfBirth,
                nidBirth,
                profession,
                division,
                district,
                upzilla,
                post,
                profilePic: profilePicBuffer,

            }

            const result = await clientrequestCollection.insertOne(userReq);
            res.json(result);
        });

        app.get('/client-request', async (req, res) => {
            const cursor = clientrequestCollection.find({});
            const userReq = await cursor.toArray();
            res.json(userReq);
        });


      












    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('mlm server')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});