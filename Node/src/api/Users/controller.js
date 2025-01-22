const User = require("../../api/Users/model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { validationResult } = require('express-validator');

const addUser = async (req, res) => {
  let { firstName, lastName, mobile, password} =
    req.body;
  let email = req.body.email.toLowerCase();

  try {
    mobile = mobile.replace(/-/g, "");
    // Check for missing fields
    const missingFields = [];
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!email) missingFields.push("email");
    if (!mobile) missingFields.push("mobile");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(", ")}.`,
        success: false,
        status: 400,
      });
    }

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Validation failed. Please correct the errors.',
      success: false,
      status: 400,
    });
  }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: `User with this email already exists.`,
        success: false,
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      password: hashedPassword,
    });

    return res.status(200).json({
      message:
        "Account created successfully.",
      data: newUser,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      status: 500,
      message: error.message || "An unexpected error occurred.",
      success: false,
    });
  }
};

const getSingleUser = async(req,res)=>{
  const {userId} = req.query;
  try {
    if (!req.rootUserId) {
      return res.status(401).send({
        status: 401,
        message: "Token is missing",
        success: false
      });
    }
    const foundUser = await User.findOne({_id:userId,isDeleted:false}).select('firstName lastName email mobile isDeleted createdAt updatedAt');
    return res.status(200).json({
      message:
        "Data retrieved successfully.",
      data: foundUser,
      success: true,
      status: 200,
    });
  } catch (error) {
    
  }
};

const getAllUsers = async (req, res) => {
  const { search = "", page, limit } = req.query;

  try {
    if (!req.rootUserId) {
      return res.status(401).send({
        status: 401,
        message: "Token is missing",
        success: false,
      });
    }

    const query = {
      isDeleted: false,
    };

    if (search.trim()) {
      const searchTerms = search.split(" ").map((term) => term.trim()); 
      if (searchTerms.length === 1) {
        query.$or = [
          { firstName: { $regex: searchTerms[0], $options: "i" } },
          { lastName: { $regex: searchTerms[0], $options: "i" } },
          { email: { $regex: searchTerms[0], $options: "i" } },
          { mobile: { $regex: searchTerms[0], $options: "i" } },
        ];
      } else if (searchTerms.length >= 2) {
        query.$or = [
          { 
            $and: [
              { firstName: { $regex: searchTerms[0], $options: "i" } },
              { lastName: { $regex: searchTerms[1], $options: "i" } },
            ],
          },
          { 
            $and: [
              { firstName: { $regex: searchTerms[1], $options: "i" } },
              { lastName: { $regex: searchTerms[0], $options: "i" } },
            ],
          },
        ];
      }
    }

    if (page && limit) {
      const options = {
        skip: (parseInt(page) - 1) * parseInt(limit),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        select:
          "firstName lastName email mobile isDeleted createdAt updatedAt",
      };

      const [foundUsers, totalUsers] = await Promise.all([
        User.find(query, options.select)
          .skip(options.skip)
          .limit(options.limit)
          .sort(options.sort),
        User.countDocuments(query),
      ]);

      return res.status(200).json({
        message: "Data retrieved successfully.",
        data: foundUsers,
        pagination: {
          totalUsers,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalUsers / limit),
        },
        success: true,
        status: 200,
      });
    } else {
      const foundUsers = await User.find(query)
        .sort({ createdAt: -1 })
        .select(
          "firstName lastName email mobile isDeleted createdAt updatedAt"
        );

      return res.status(200).json({
        message: "Data retrieved successfully.",
        data: foundUsers,
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error retrieving students:", error);
    return res.status(500).send({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};


const updateUser = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!req.rootUserId) {
      return res.status(401).send({
        status: 401,
        message: "Token is missing",
        success: false,
      });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid or missing userId",
        success: false,
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Request body is missing or empty",
        success: false,
      });
    }

    const { email,isDeleted, ...allowedUpdates } = req.body;

    const foundUser = await User.findByIdAndUpdate(userId, allowedUpdates, {
      new: true,
    });

    if (!foundUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User updated successfully.",
      data: foundUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!req.rootUserId) {
      return res.status(401).send({
        status: 401,
        message: "Token is missing",
        success: false,
      });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid or missing userId",
        success: false,
      });
    };

    const foundUser = await User.findByIdAndUpdate(userId, {isDeleted:true}, {
      new: true,
    });

    if (!foundUser) {
      return res.status(404).json({
        status: 404,
        message: "Could not find your profile!",
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User deleted successfully.",
      userId: foundUser._id,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};


module.exports = { addUser,getSingleUser,getAllUsers,updateUser,deleteUser };
