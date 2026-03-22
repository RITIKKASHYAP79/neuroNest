const express = require('express');
let ejs = require('ejs');
let mysql = require("mysql2");
const bodyParser = require('body-parser');
const fs = require("fs").promises;
const { GoogleGenerativeAI } = require("@google/generative-ai");
let questionCount = 0;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
require('dotenv').config();

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let register = 'Login/Register';
  res.render("index", { User: register })
})

app.get('/auth', (req, res) => {
  res.render("auth")
})

app.get('/Ai', (req, res) => {
  let userprompt = '';
  let aigenerated = '';
  res.render("Ai", { userPrompt: userprompt, aiGenerated: aigenerated })
})

app.get('/loginPage', (req, res) => {
  res.render('login')
})


/* database credential to connect with DB */

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'neuronest'
});

/* establish connection to MySQL */
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

/* Handling Registration Request */

app.post("/submit", (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    return res.status(400).send('password not match to confirm password please try again later');

  } else {

    // Insert Details into database
    const sql = 'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?,?)';
    db.query(sql, [name, email, role, password], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err.message);
        return res.status(500).send('Database error.');
      }
      res.send('Data saved successfully!');
    });
  }
})

/* handling login request */
app.post("/login", (req, res) => {
  const { lemail, lpassword } = req.body;
  const sql = 'select password,name from users where email=(?);';
  db.query(sql, [lemail], (err, result) => {
    if (err) {
      console.error('Error fecthing data:', err.message);
      return res.status(500).send('Database error.');
    } else {

      /* loged in */
      if (result[0].password != lpassword) {
        console.log(result[0].password)
        res.send("user not found ");
        res.redirect('/login');
      }
      else {
        let dbname = result[0].name;
        let name = dbname.toUpperCase();
        res.render("index", { User: name })
      }
    }

  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


/*     AI   */


const generate = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    let content = result.response.text();
    return content;



  } catch (err) {
    console.log(err);
  }
}



async function saveData(data) {
    try {
        // Convert object to string so it can be saved
        const content = JSON.stringify(data, null, 2); 
        
        await fs.writeFile('results.json', content);
        console.log('File saved successfully!');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

/* generating questions by given user query */

app.post('/Ai/generate', async (req, res) => {
  const { userQuery } = req.body;
  let content = await generate(`Generate 10 MCQ questions about ${userQuery}. Format the output as raw json file use formate {"question": "question", "a": "answer1", "b": "answer2", "c": "answer3", "d": "answer4", "answer": "correct answer"}.`)
  await saveData(content);
  res.redirect('/startQuiz');
  // res.render("Ai", { userPrompt: userQuery, aiGenerated: content })

})


//********* file ******* */

async function readingFile(index) {
  try {
        const data = await fs.readFile('questions.json', 'utf8');
        const questionsArray = JSON.parse(data);
        
        // Safety check: make sure the index exists
        if (!questionsArray[index]) return null;

        let q = questionsArray[index];
        // Return the array so it can be assigned to 'list' in your route
        return [q.question, q.a, q.b, q.c, q.d,q.answer]; 
    } catch (err) {
        console.error("Error reading file:", err);
        return null;
    }
    
  
}


app.get('/startQuiz', async(req, res) => {
  
  let list = await readingFile(questionCount);
  if (!list) {
        return res.status(500).send("Could not load quiz questions.");
    }
  res.render("quiz", {questionNumber: questionCount+1, question: list[0], answer1: list[1], answer2: list[2], answer3: list[3], answer4: list[4] })

})


app.post('/check', async(req, res) => {
  const { element, userAnswer } = req.body;
  let list = await readingFile(questionCount);
  if (!list) {
        return res.status(500).send("answer fetch error");
  }
  if(userAnswer == list[5]){
    console.log("correct")
    
  }
  else{
    console.log("incorrect")
  }

})

app.get('/next',(req,res)=>{
  if(questionCount<9){
    ++questionCount;
    res.redirect("/startQuiz");
  }
  else{
    res.send("quiz completed")
  }
})





/**** inserting quiz in DB */
//   const sql = 'INSERT INTO quiz (question,answer1,answer2,answer3,answer4,c_answer) VALUES ?;';
//   db.query(sql,[content],(err,result)=>{
//     if(err){
//       console.error('Error fecthing data:', err.message);
//             return res.status(500).send('Database error.');
//     }
//   })





