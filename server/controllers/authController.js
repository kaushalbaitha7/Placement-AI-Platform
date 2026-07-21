const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ==========================
   Generate JWT
========================== */

const generateToken = (id) => {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

};

/* ==========================
   REGISTER
========================== */

exports.signup = async (req, res) => {

    try {

        const {
            name,
            urn,
            email,
            phone,
            password,
            branch,
            semester
        } = req.body;

        if (
            !name ||
            !urn ||
            !email ||
            !phone ||
            !password ||
            !branch ||
            !semester
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });

        }

        const existingUser = await User.findOne({

            $or: [

                { email: email.toLowerCase() },

                { phone },

                { urn: urn.toUpperCase() }

            ]

        });

        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "User already exists with Email, Phone or URN."

            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({

            name,

            urn: urn.toUpperCase(),

            email: email.toLowerCase(),

            phone,

            password: hashedPassword,

            branch,

            semester

        });

        const token =
            generateToken(user._id);

        res.status(201).json({

            success: true,

            message: "Registration Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                urn: user.urn,

                branch: user.branch,

                semester: user.semester

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/* ==========================
   LOGIN
========================== */

exports.login = async (req, res) => {

    try {

        const {
            loginId,
            password
        } = req.body;

        if (!loginId || !password) {

            return res.status(400).json({

                success: false,

                message: "Please enter Email/Phone and Password."

            });

        }

        const user =
            await User.findOne({

                $or: [

                    {
                        email: loginId.toLowerCase()
                    },

                    {
                        phone: loginId
                    }

                ]

            });

        if (!user) {

            return res.status(400).json({

                success: false,

                message: "User not found."

            });

        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message: "Invalid Password."

            });

        }

        const token =
            generateToken(user._id);

        res.status(200).json({

            success: true,

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                urn: user.urn,

                branch: user.branch,

                semester: user.semester,

                role: user.role

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};