import { instance } from "../index.js";
import { tryCatch } from "../middlewares/tryCatch.js";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { Payment } from "../models/payment.model.js";
import User from "../models/user.model.js";
import crypto from "crypto"

export const getAllCourse = tryCatch(async (req, res) => {

    const allCourse = await Course.find({});
    return res.status(200).json({
        allCourse
    })

})

export const getSingleCourse = tryCatch(async (req, res) => {

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({
        message: "Course not found"
    })
    return res.status(200).json({
        course
    })

})

export const fetchCourseLecture = tryCatch(async (req, res) => {

    const allLecture = await Lecture.find({ course: req.params.id })
    // console.log("req.user",req.user)
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.status(200).json({
            allLecture
        })
    }

    if (!user.subscription?.includes(req.params.id)) {
        return res.status(403).json({
            message: "You haven't subscribed to this course!"
        })
    }

    return res.status(200).json({
        allLecture
    })


})

export const fetchSingleLecture = tryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.status(200).json({
            lecture
        })
    }

    if (!user.subscription?.includes(lecture.course)) {
        return res.status(403).json({
            message: "You haven't subscribed to this course!"
        })
    }

    return res.status(200).json({
        lecture
    })


})

export const getMyCourses = tryCatch(async (req, res) => {
    const myCourses = await Course.find({ _id: req.user?.subscription })

    return res.status(200).json({
        myCourses
    })
})

export const checkout = tryCatch(async (req, res) => {
    const course = await Course.find(req.params.id);
    const user = await User.find(req.user._id);

    if (user?.subscription?.includes(course._id)) {
        return res.status(400).json({
            message: "You have already subscribed to this course!"
        })

    }

    const option = {
        amount: Number(course.price * 100),
        currency: "INR",
        description: "Course Purchase",
        receipt: "STUDI_ON_LMS",
    }

    const order = await instance.orders.create(option)

    return res.status(200).json({
        order,
        course
    })



})

export const paymentVerification = tryCatch(async (req, res) => {
    const { razarpay_order_id, razarpay_payment_id, razarpay_signature } = req.body;

    const body = razarpay_order_id + "|" + razarpay_payment_id;

    const verifyHashSignature = crypto
        .createHmac('sha256', process.env.RAZARPAY_SECRET)
        .update(body)
        .digest('hex');

    const isAuthentic = razarpay_signature === verifyHashSignature

    if (isAuthentic) {
        await Payment.create({
            razarpay_order_id,
            razarpay_payment_id,
            razarpay_signature

        })

        const user = await User.findById(req.user._id);

        user.subscription.push(req.params.id);
        await user.save();

        return res.status(200).json({
            message: "Course Purchased successfully",
            user,
        })

    } else {
        return res.status(401).json({
            message: "Payment verification failed"
        })
    }




})