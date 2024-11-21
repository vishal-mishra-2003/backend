import express from 'express'
import mongoose from 'mongoose'
import messageModel from './models/blogs.model.js'


const app = express()
app.use(express.json())

// function to connect mongodb
const connectDB = async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost:27017')
            .then(() => {
                console.log('mongodb connected')
            })
    } catch (error) {
        console.log("Error connecting database", error)
    }
}
connectDB()

app.post('/api/create', async (req, res) => {
    const { author, title, description } = req.body
    console.log(author, title, description)
    try {
        const newBlog = new messageModel({
            author, title, description
        })

        await newBlog.save()
        console.log("Blog saved");
        res.send({ success: true, message: "Blog Creation successfull" })

    } catch (error) {
        console.log("Error creating blog", error)
        res.send({ success: false, message: "Blog Creation failed" })
    }
})

app.get('/api/allblogs', async (req, res) => {
    try {
        const blogs = await messageModel.find({})
        res.send({ success: true, blogs: blogs })
    } catch (error) {
        req.send({ success: false, blogs: "Blogs not found" })
    }
})

app.put('/api/blog/update/:id', async (req, res) => {
    const { id } = req.params
    const { author, title, description } = req.body
    try {
        const updateBlog = await messageModel.findByIdAndUpdate(id, {
            author, title, description
        })
        if (updateBlog) {
            res.send({ success: true, message: "Blog updated successfully" })
        }
    } catch (error) {
        res.send({ success: false, message: "Blog updatedation failed" })
    }
})

app.delete('/api/blog/remove/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteBlog = await messageModel.findByIdAndDelete(id)
        if (deleteBlog) {
            res.send({ success: true, message: "Blog deleted successfully" })
        }else{
            res.send({ success: false, message: "Blog not found" })
        }
    } catch (error) {
        res.send({ success: false, message: "Blog deletion failed" })
    }
})
app.listen(5501, () => {
    console.log('Server is running');
})