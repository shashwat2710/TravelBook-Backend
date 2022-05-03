import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getPosts =async (req, res) =>{
    const {page} = req.query;
    try{
        const LIMIT = 5;
        const startIndex = (Number(page) -1) * LIMIT // get the starting Index of every page
        const total = await PostMessage.countDocuments({});
        const posts =await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});
    }
    catch (error){
        res.status(404).json({message: error.message})
    }
}

export const getPostById =  async(req, res)=>{
    const {id: _id} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')
        const post = await PostMessage.findById(_id);
        res.status(200).json({data: post})

    }catch(err){
        console.log(err);
    }

}

export const getPostBySearch = async(req, res)=>{
    const {searchQuery, tags} = req.query;
    try{
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({$or: [{title}, {tags: {$in: tags.split(',')}}]})
        res.status(200).json({posts})


    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createPost =async (req, res) =>{
    const post =  req.body;
    // const postDatra = {...post}
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()})
    try{
        await newPost.save();
        res.status(201).json(newPost);
    }
    catch (error){
        console.log(error)
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req, res) =>{
    const {id: _id }=  req.params;
    const post  =  req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post with that id')
    const updatedPost = await PostMessage.findByIdAndUpdate(_id,{...post, _id}, {new: true} );
    res.json(updatedPost)
}

export const deletePost =  async(req, res) =>{
    const {id: _id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')
    await PostMessage.findByIdAndRemove(_id)
    res.json({message: 'Post Deleted Successfully'})
}

export const likePost =  async(req, res)=>{
    const {id: _id}= req.params;
    if(!req.userId) return res.status(402).json({message:'Unauthenticated'});

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post with that id')
    const post = await PostMessage.findById(_id);

    const index = post.likeCount.findIndex((id)=>id===String(req.userId));
    if(index === -1) {
        // Like the post
        post.likeCount.push(req.userId);
    }else{
        //dislike the post
        post.likeCount = post.likeCount.filter((id)=> id!==String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new:true}).exec()
    res.json(updatedPost)
}

export const commentPost = async(req, res) => {
    const {id: _id} = req.params;
    console.log(_id);
    const {value}= req.body
    console.log(value);
    // if(!req.userId) return res.status(402).json({message: 'Unauthorized'});

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message: 'No Post with that Id'})
    const post  =  await PostMessage.findById(_id);

    post.comments.push(value);
    const updatedPost =await  PostMessage.findByIdAndUpdate(_id, post, {new:true})
    res.status(201).json(updatedPost);

}