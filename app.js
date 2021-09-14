var   express    = require("express"),
	  app        = express(),
	  expressSanitizer = require("express-sanitizer"),
	  bodyParser = require("body-parser"),
	  methodOverride = require("method-override");
const mongoose   = require('mongoose');
//app config
mongoose.connect('mongodb://localhost:27017/blogs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// .then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'))
app.set("view engine", "ejs");

//blogmodel
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
// 	title: "Great Dane",
// 	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT2jco110L8Jdj8kfqR_RqCid-E48L9qWXaqA&usqp=CAU",
// 	body: "DOgie tera gaav bada pyara"
// })

app.get("/", (req, res)=>{
    res.redirect("/Blogs");
});

app.get("/blogs", (req, res)=>{
	 Blog.find({},(err, blogs)=>{
       if(err){
           console.log(err);
       } else {
          res.render("index",{blogs:blogs});
       }
    });
});

app.get("/blogs/new", (req, res)=>{
    res.render("new");
});
app.get("/blogs/:id", (req, res)=>{
	Blog.findById(req.params.id,(err,fb)=>{
		if(err) {res.redirect("/blogs")}
		else {
			res.render("show",{blow:fb})
		}
	})
});
app.get("/blogs/:id/edit", (req, res)=>{
	Blog.findById(req.params.id,(err,eb)=>{
		if(err) {res.redirect("/blogs")}
		else {
			res.render("edit",{blog:eb})
		}
	})
});

app.put("/blogs/:id", (req, res)=>{
	res.body.blog.body = req.sanitize(res.body.blog.body);
	 Blog.findByIdAndUpdate(req.params.id,req.body.blog, (err,updatedBlog)=>{
		if(err){ res.redirect("/blogs");}
		else {res.redirect("/blogs/" + req.params.id); }
	});
});

app.delete("/blogs/:id", (req, res)=>{
	 Blog.findByIdAndRemove (req.params.id, (err)=>{
		if(err){ res.redirect("/blogs");}
		else {res.redirect("/blogs"); }
	});
	// res.send("delete")
});

app.post("/blogs/new", (req, res)=>{
	res.body.blog.body = req.sanitize(res.body.blog.body);
    Blog.create(req.body.blog, (err,newBlog)=>{
		if(err){ res.render("new");}
		else {res.redirect("/blogs"); }
	});
});
app.listen(3000, ()=>{
   console.log("The Blogapp Server Has Started!");
});