const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const memoryBench = require('./models/memoryBench');


mongoose.connect('mongodb://localhost:27017/emfrm-memorylane', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

/* to parse request body otherwise it 
   won't be able to get the post request 
*/
app.use(express.urlencoded({extended : 'views'})); 
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



/* routers go here */
app.get('/', (req, res) => {
    res.render('home')
})

// router to list all memorybenches
app.get('/memorybench', async (req, res) => {
    const data = await memoryBench.find({}); // already connected above so just find 
    console.log(data);
    res.render('../memorybenches/index', {data});
})


// router to bring the form to add new memortbench
app.get('/newmemorybench', (req, res) => {
    res.render('../memorybenches/new');
})

// router to post new memorybench
app.post('/memorybench', async (req, res) => {
    const newMemoryBench = new memoryBench(req.body);
    await newMemoryBench.save();
    res.redirect('/memorybench');
})

// router to get a specific memorybench
app.get('/memorybench/:id', async (req, res) => {
    const id = req.params.id;
    const memorybench = await memoryBench.findById(id);
    res.render('../memorybenches/show', { memorybench });
})

// router to bring the form to edit a memorybench
app.get('/memorybench/:id/edit', async (req, res) => {
    const id = req.params.id;
    const memorybench = await memoryBench.findById(id);
    console.log(memorybench.location);
    res.render('../memorybenches/edit', { memorybench });
})


// router to update memorybench
app.put('/memorybench/:id', async (req, res) => {
    const { title, location } = req.body.memorybench; // get updated parameters
    const memorybench = await memoryBench.findById(req.params.id);
    memorybench.title = title;
    memorybench.location = location;
    memorybench.save();
    res.redirect(`/memorybench/${req.params.id}`)
})

// set port 
app.listen(3000, () => {
    console.log('serving on port 3000');
})