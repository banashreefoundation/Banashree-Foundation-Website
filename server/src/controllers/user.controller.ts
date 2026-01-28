import User, { IUser } from '../models/User'
import { Request, Response } from 'express';
import auth, { CustomRequest } from '../middleware/auth'
// import zxcvbn from 'zxcvbn'


const isPasswordSimilar = (password: string, name: string, email: string): boolean => {
    const normalizedPassword = password.toLowerCase()
    const normalizedName = name.toLowerCase()
    const normalizedEmail = email.toLowerCase()
    return normalizedPassword.includes(normalizedName) || normalizedPassword.includes(normalizedEmail)
}

const registerUser = async (user: Partial<IUser>) => {
    const { name, email, password } = user
    if (!name || !email || !password) {
        return {
            error: 'Please provide all the required fields',
        }
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return {
            error: 'User with that email already exists.',
        }
    }

    if (isPasswordSimilar(password, name, email)) {
        return {
            error: 'Password should not be similar to your name or email.',
        }
    }

    // const passwordStrength = zxcvbn(password)
    // if (passwordStrength.score < 3) {
    //     return {
    //         error: 'Password is too weak. Please choose a stronger password.',
    //     }
    // }

    const newUser = new User({ name, email, password })
    await newUser.save()
    const token = await newUser.generateAuthToken()
    return {
        user: newUser,
        token,
    }
}

const loginUser = async (user: Partial<IUser>) => {
    const { email, password } = user
    if (!email || !password) {
        return {
            error: 'Please provide all the required fields',
        }
    }
    const existingUser = await User.findByUser(email)
    if (!existingUser) {
        return {
            error: 'User is not registered, please sign up.',
        }
    }
    const passwordMatch = await User.findByCredentials(email, password)
    if (!passwordMatch) {
        return {
            error: 'Invalid credentials',
        }
    }
    const token = await passwordMatch.generateAuthToken()
    return {
        user: passwordMatch,
        token,
    }
}

export const handleRegisterUser = async (req: Request, res: Response): Promise<any> => {
    if (!req.body) {
        return res.status(400).json({
            error: 'Request body is missing',
        });
    }

    const userData: Partial<IUser> = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    const registeredUser = await registerUser(userData)
    if (registeredUser.error) {
        return res.status(400).json({
            error: registeredUser.error,
        })
    }
    return res.status(201).json(registeredUser)
}

export const handleLoginUser = async (req: Request, res: Response): Promise<any> => {
    const userData: Partial<IUser> = {
        email: req.body.email,
        password: req.body.password,
    }
    const loggedInUser = await loginUser(userData)
    if (loggedInUser?.error) {
        return res.status(400).json({
            error: loggedInUser.error,
        })
    }
    return res.status(200).json(loggedInUser)
}

export const getProfile = async (req: CustomRequest, res: Response): Promise<any> => {
    return res.status(200).json({
        user: req.user,
    })
}

export const logoutUser = async (req: CustomRequest, res: Response): Promise<any> => {
    if (req.user) {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
    }

    return res.status(200).json({
        message: 'User logged out successfully.',
    })
}

export const logoutAllUser = async (req: CustomRequest, res: Response): Promise<any> => {
    if (req.user) {
        req.user.tokens = []
        await req.user.save()
    }
    return res.status(200).json({
        message: 'User logged out from all devices successfully.',
    })
}