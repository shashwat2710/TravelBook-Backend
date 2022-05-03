import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
export const getLogin =async (req,res)=>{
    const {email, password} = req.body;
    try{
        const existingUser =  await User.findOne({email});
        if(!existingUser) res.status(404).json({message: 'User does not exist in system'})

        const isPasswordCorrect = await bcrypt.compareSync(password, existingUser.password);

        if(!isPasswordCorrect) res.status(400).json({message: 'Invalid Credentials'});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: '1h'})
        console.log(token, existingUser);
        res.status(200).json({result: existingUser, token})
    }
    catch(err){
        res.status(500).json({message: 'Some Internal Error Occurred. Please try again.'})
    }
}

export const getSignUp = async(req,res)=>{
    console.log(req.body);
    const {email, password, confirmPass: confirmPassword, firstName, lastName}= req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser) {
            console.log('Send Status')
            res.status(404).json({message: 'User already exist in system'});
    }
        else {  
            if(password!==confirmPassword) res.sendStatus(400).json({message: 'Password do not match'})
            console.log('here')
            const hashedPassword =  await bcrypt.hashSync(password, 12);
            
            const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`, })
            
            const token =  jwt.sign({email: result.email, id: result._id},process.env.SECRET_KEY, {expiresIn: '1h'})
            
            res.status(201).json({result, token})
        }

    }catch(err){
        console.log(err)
        res.sendStatus(500).json({message: 'Some Internal Error Occurred. Please try again.'})

    }

}